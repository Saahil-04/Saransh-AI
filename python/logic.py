# import requests
# from bs4 import BeautifulSoup
# import spacy
# import google.generativeai as genai
# from transformers import pipeline

# # Set the API key for Gemini API
# api_key = "AIzaSyDRq-ksyhLOI-T4OgkgbvE_Ik6QlqYB9Ck"

# # Configure the API key
# genai.configure(api_key=api_key)

# # Create the model configuration for Gemini API
# generation_config = {
#     "temperature": 1,
#     "top_p": 0.95,
#     "top_k": 64,
#     "max_output_tokens": 8192,
#     "response_mime_type": "text/plain",
# }

# # Initialize the Gemini model
# model = genai.GenerativeModel(
#     model_name="gemini-1.5-flash",
#     generation_config=generation_config,
# )

# # Load spaCy model
# nlp = spacy.load("en_core_web_sm")

# # Initialize the question-answering pipeline with a different model
# qa_pipeline = pipeline("question-answering", model="deepset/roberta-base-squad2")

# def extract_text_from_website(url):
#     response = requests.get(url)
#     soup = BeautifulSoup(response.content, "html.parser")
#     text = ' '.join([p.get_text() for p in soup.find_all('p')])
#     return text

# def preprocess_text(text):
#     doc = nlp(text)
#     tokens = [token.text for token in doc if not token.is_stop and not token.is_punct]
#     return ' '.join(tokens)

# def summarize_text(text):
#     chat_session = model.start_chat()
#     response = chat_session.send_message("read: " + text)
#     return response.text

# def answer_questions(text, question):
#     result = qa_pipeline(question=question, context=text)
#     return result['answer']

# try:
#     url = input("Enter the website URL: ")

#     # Extract text from website
#     raw_text = extract_text_from_website(url)

#     # Preprocess the text
#     preprocessed_text = preprocess_text(raw_text)

#     # Summarize the text
#     summary = summarize_text(preprocessed_text)
#     print("Summary:\n", summary)

#     # Ask questions based on the summarized text
#     while True:
#         question = input("Enter your question (or 'exit' to quit): ")
#         if question.lower() == 'exit':
#             break
#         answer = answer_questions(preprocessed_text, question)
#         print("Answer:", answer)

# except Exception as e:
#     print(f"An error occurred: {e}")
