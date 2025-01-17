from fastapi import FastAPI, File, HTTPException, UploadFile,Body
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
model = genai.GenerativeModel(model_name="gemini-1.5-flash")

# Load spaCy model
nlp = spacy.load("en_core_web_sm")

chat_history = []
url_storage = {}
current_context = ""


class ChatRequest(BaseModel):
    text: str

# Function to generate a title from messages using gemini model
def generate_title_from_messages(content: str) -> str:
    chat_session = model.start_chat()
    # Prompt Gemini for a single, brief, descriptive title
    prompt = f"Generate a single, concise title of up to four words for the following content, without any extra explanation:\n\n{content}\n\nTitle:"
    response = chat_session.send_message(prompt)
    
    # Extract the title text
    title = response.text.strip().split('\n')[0]  # Only the first line of the response
    return title if title else "Untitled Session"

# Function to extract text from PDF file
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
    global current_context
    input_text = request.text

    try:
        if input_text.startswith("http://") or input_text.startswith("https://"):
            # Handle URL input and summarization logic
            pages_text = extract_text_from_website(input_text)
            main_text_preprocessed = preprocess_text(pages_text["main_page_text"])
            about_text_preprocessed = preprocess_text(pages_text["about_page_text"])
            combined_text = main_text_preprocessed + " " + about_text_preprocessed
            combined_summary = summarize_text(combined_text)
            url_storage[input_text] = combined_summary
            current_context = combined_summary
            add_to_history(input_text, combined_summary)
            return {"response": combined_summary}

        elif input_text.lower().startswith("generate code for"):
            # Handle code generation logic
            description = input_text[len("generate code for"):].strip()
            code = generate_code(description)
            add_to_history(input_text, code)
            return {"response": code}

        elif input_text.lower().endswith(".pdf"):
            # Handle PDF summarization logic
            pdf_text = extract_text_from_pdf(input_text)
            pdf_text_preprocessed = preprocess_text(pdf_text)
            pdf_summary = summarize_text(pdf_text_preprocessed)
            current_context = pdf_summary
            add_to_history(input_text, pdf_summary)
            return {"response": pdf_summary}

        else:
            # Handle general questions and questions about previous messages
            relevant_context = get_relevant_context(input_text)
            
            if relevant_context:
                # If there's relevant context from previous messages, include it in the prompt
                prompt = f"Based on the following previous conversations:\n\n{relevant_context}\n\nCurrent question: {input_text}\n\nPlease provide a response that takes into account the relevant context from previous messages."
            else:
                # If there's no relevant context, use the current question as is
                prompt = input_text

            if current_context and is_context_related(input_text, current_context):
                # If the question is related to the current context (e.g., a recently processed URL or PDF)
                response = answer_questions(current_context, prompt)
            else:
                # For general questions or questions unrelated to the current context
                response = generate_normal_response(prompt)

            add_to_history(input_text, response)
            return {"response": response}

    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))  
    
