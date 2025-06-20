from fastapi import FastAPI, File, HTTPException, UploadFile, Body
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
import spacy
import google.generativeai as genai
import textwrap
import time
from urllib.parse import urlparse, urljoin
import fitz  # PyMuPDF
import os
import io
from PIL import Image
import cv2
import pytesseract
import numpy as np
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import TranscriptsDisabled, VideoUnavailable
from typing import Optional

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

# Set the API key for Gemini API
api_key = "AIzaSyDRq-ksyhLOI-T4OgkgbvE_Ik6QlqYB9Ck"

# Configure the API key
genai.configure(api_key=api_key)

# Initialize the Gemini model
# model = genai.GenerativeModel(model_name="gemini-1.5-flash")
model = genai.GenerativeModel(model_name="gemini-2.0-flash")
# model = genai.GenerativeModel(model_name="gemini-2.0-flash-lite")
# model = genai.GenerativeModel(model_name="gemini-2.5-pro-exp-03-25")


# Load spaCy model
nlp = spacy.load("en_core_web_sm")

chat_history = []
url_storage = {}
current_context = ""

class ChatRequest(BaseModel):
    text: str
    context: Optional[str] = None 

def get_video_id_from_url(url: str) -> str:
    """Extract the YouTube video ID from the URL."""
    parsed_url = urlparse(url)
    if parsed_url.hostname in ['www.youtube.com', 'youtube.com']:
        query = parsed_url.query
        query_params = dict(qc.split("=") for qc in query.split("&"))
        return query_params.get("v", "")
    elif parsed_url.hostname == 'youtu.be':
        return parsed_url.path.lstrip("/")
    return None

def fetch_youtube_transcript(video_url: str) -> str:
    """Fetch the transcript of a YouTube video."""
    video_id = get_video_id_from_url(video_url)
    if not video_id:
        raise HTTPException(status_code=400, detail="Invalid YouTube URL.")
    
    try:
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        # Combine transcript parts into a single text
        full_transcript = " ".join([item["text"] for item in transcript])
        return full_transcript
    except TranscriptsDisabled:
        raise HTTPException(status_code=400, detail="Transcripts are disabled for this video.")
    except VideoUnavailable:
        raise HTTPException(status_code=400, detail="Video unavailable or invalid ID.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch transcript: {str(e)}")

def enhance_description_with_gemini(initial_description: str) -> str:
    # Send the initial description to the Gemini API to get a more detailed response
    prompt = f"describe: {initial_description}"
    chat_session = model.start_chat()
    response = chat_session.send_message(prompt)
    return response.text


def get_image_description(image_data: bytes) -> str:
    try:
        # Load the image from byte data
        image = Image.open(io.BytesIO(image_data))

        # Convert the image to a format that Gemini can accept
        image = image.convert("RGB")

        # Send the image to the Gemini model
        response = model.generate_content(["Describe the image in detail.", image])

        # Return the generated description
        return response.text
    
    except Exception as e:
        print(f"Error processing image file: {e}")
        return "Error generating description"

def extract_text_from_image(image_data: bytes) -> str:
    # Convert bytes to a PIL Image
    image = Image.open(io.BytesIO(image_data))
    
    # Convert the image to grayscale
    gray_image = image.convert('L')

    # Convert the PIL Image to a numpy array (for OpenCV processing)
    open_cv_image = np.array(gray_image)

    # Apply a threshold to get rid of noise (adjust parameters as needed)
    _, threshold_image = cv2.threshold(open_cv_image, 150, 255, cv2.THRESH_BINARY)

    # Use Tesseract to extract text
    extracted_text = pytesseract.image_to_string(threshold_image)

    return extracted_text

def generate_title_from_messages(content: str) -> str:
    chat_session = model.start_chat()
    # Prompt Gemini for a single, brief, descriptive title
    prompt = f"Generate a single, concise title of up to four words for the following content, without any extra explanation:\n\n{content}\n\nTitle:"
    response = chat_session.send_message(prompt)
    
    # Extract the title text
    title = response.text.strip().split('\n')[0]  # Only the first line of the response
    return title if title else "Untitled Session"

def extract_text_from_pdf(pdf_path: str) -> str:
    text = ""
    try:
        with fitz.open(pdf_path) as doc:
            for page in doc:
                text += page.get_text()
    except Exception as e:
        print(f"Error reading PDF: {e}")
    return text

def extract_about_page_url(driver, base_url: str):
    # Get the base domain of the provided URL
    base_domain = urlparse(base_url).netloc

    # Search for potential 'About' links in the page
    about_link = None
    try:
        # Look for links containing 'about' in their text or href
        potential_links = driver.find_elements(By.XPATH, '//a[contains(translate(text(), "ABOUT", "about"), "about") or contains(translate(@href, "ABOUT", "about"), "about")]')
        
        for link in potential_links:
            href = link.get_attribute('href')

            if href:
                # Check if the link belongs to the same domain
                parsed_href = urlparse(href)
                if not parsed_href.netloc or parsed_href.netloc == base_domain:
                    # Make sure it's a full URL by joining it with the base URL if necessary
                    about_link = urljoin(base_url, href)
                    break
    except Exception as e:
        print(f"Error finding 'About' link: {e}")

    return about_link
    
def extract_text_from_website(url: str) -> dict:
    options = webdriver.ChromeOptions()
    options.add_argument("--headless")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-software-rasterizer")

    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)

    main_page_text = ""
    about_page_text = ""

    try:
        # Extract the main page content
        driver.get(url)
        time.sleep(1)  # Short delay to allow the page and consent dialog to load
        main_page_text = driver.find_element(By.TAG_NAME, 'body').text
        # print(main_page_text)
        # Try to extract the 'About' page content from the same domain
        about_url = extract_about_page_url(driver, url)
        if about_url:
            driver.get(about_url)
            time.sleep(1)
            about_page_text = driver.find_element(By.TAG_NAME, 'body').text
            # print(about_page_text)

    finally:
        driver.quit()

    return {
        "main_page_text": main_page_text,
        "about_page_text": about_page_text
    }

def preprocess_text(text: str) -> str:
    doc = nlp(text)
    tokens = [token.text for token in doc if not token.is_stop and not token.is_punct]
    return ' '.join(tokens)

def summarize_text(text: str) -> str:
    chat_session = model.start_chat()
    response = chat_session.send_message("read: " + text)
    return response.text

def answer_questions(context: str, question: str) -> str:
    prompt = f"Answer the following question based on the context: {context}\nQuestion: {question}"
    chat_session = model.start_chat()
    response = chat_session.send_message(prompt)
    return response.text

def generate_code(description: str) -> str:
    prompt = f"Generate code for the following description: {description}"
    chat_session = model.start_chat()
    response = chat_session.send_message(prompt)
    
    # Format the code response
    formatted_code = format_code(response.text)
    return formatted_code

def generate_normal_response(text: str) -> str:
    # Generates a normal conversational response
    chat_session = model.start_chat()
    response = chat_session.send_message(text)
    return response.text

def format_code(code: str) -> str:
    # Basic formatting of code to maintain indentation
    return textwrap.dedent(code).strip()

def add_to_history(question: str, response: str):
    if len(chat_history) >= 10:  # Limit the history to the last 10 messages
        chat_history.pop(0)  # Remove the oldest entry to maintain size
    chat_history.append({"question": question, "response": response})

def get_relevant_context(question: str) -> str:
    relevant_context = ""
    for entry in chat_history:
        if is_context_related(question, entry["question"]):
            relevant_context += f"Q: {entry['question']}\nA: {entry['response']}\n\n"
    return relevant_context.strip()

def is_context_related(question: str, context: str) -> bool:
    prompt = f"Is the following question related to the provided context?\n\nContext: {context}\n\nQuestion: {question}\n\nPlease answer with 'yes' or 'no'."
    chat_session = model.start_chat()
    response = chat_session.send_message(prompt)
    return response.text.strip().lower() == "yes"

@app.post("/generate_title")
async def generate_session_title(payload: dict = Body(...)):
    content = payload.get("content")
    if not content:
        return {"title": "Untitled Session"}
    title = generate_title_from_messages(content)
    return {"title": title}

@app.post("/upload_image")
async def upload_image(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type. Only image files are allowed.")
    
    try:
        # Read image content from the uploaded file
        image_data = await file.read()

        # Get description from Gemini model
        description = get_image_description(image_data)
        
        # Extract text using OCR
        extracted_text = extract_text_from_image(image_data)

        # Combine descriptions
        enhanced_response = f"Image description: {description}. Extracted text: {extracted_text}"

        return {"response": enhanced_response}
    except Exception as e:
        print(f"Error processing image file: {e}")
        raise HTTPException(status_code=500, detail="Failed to process image file.")

@app.post("/upload_pdf")
async def upload_pdf(file: UploadFile = File(...)):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Invalid file type. Only PDF files are allowed.")

    try:
        # Read PDF content from the uploaded file
        pdf_content = await file.read()
        with fitz.open("pdf", pdf_content) as doc:
            text = ""
            for page in doc:
                text += page.get_text()
        pdf_text_preprocessed = preprocess_text(text)
        pdf_summary = summarize_text(pdf_text_preprocessed)
        global current_context
        current_context = pdf_summary
        return {"response": pdf_summary}
    except Exception as e:
        print(f"Error processing PDF file: {e}")
        raise HTTPException(status_code=500, detail="Failed to process PDF file.")

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    input_text = request.text
    context = request.context if request.context else ""  # Context is managed by NestJS

    try:
        if input_text.startswith("http://") or input_text.startswith("https://"):
            # Check if the input is a YouTube video link
            if "youtube.com/watch" in input_text or "youtu.be" in input_text:
                # Handle YouTube video summarization
                transcript = fetch_youtube_transcript(input_text)  # Fetch transcript
                preprocessed_text = preprocess_text(transcript)   # Preprocess the transcript
                summary = summarize_text(preprocessed_text)       # Summarize the transcript
                current_context = summary  # Update context for the session
                return {"response": summary}
            
            # For other URLs, handle website summarization
            pages_text = extract_text_from_website(input_text)
            combined_text = preprocess_text(pages_text.get("main_page_text", "")) + " " + preprocess_text(pages_text.get("about_page_text", ""))
            combined_summary = summarize_text(combined_text)
            return {"response": combined_summary}

        elif input_text.lower().startswith("generate code for"):
            # Handle code generation logic
            description = input_text[len("generate code for"):].strip()
            code = generate_code(description)
            return {"response": code}

        elif input_text.lower().endswith(".pdf"):
            # Handle PDF summarization logic
            pdf_text = extract_text_from_pdf(input_text)
            pdf_summary = summarize_text(preprocess_text(pdf_text))
            return {"response": pdf_summary}

        else:
            
            # General conversation with provided context
            if context:
                prompt = f"{context}\nUser: {input_text}\nAI:"
            else:
                prompt = f"User: {input_text}\nAI:"    # No context, treat as a new chat
            response = generate_normal_response(prompt)
            return {"response": response}

    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))