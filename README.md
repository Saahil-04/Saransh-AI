# SaranshAI – AI-Powered Text Summarization Platform

Portfolio: https://saahil-portfolio.vercel.app  
GitHub: https://github.com/Saahil-04  

---

## Overview

SaranshAI is a full-stack AI-powered text summarization platform that generates concise, context-aware summaries from articles, PDFs, and web pages.

The system integrates modern frontend architecture with scalable backend APIs and AI models to provide fast and accurate summarization.

This project demonstrates full-stack development, AI integration, REST API design, and production-level architecture.

---

## Key Features

- Summarize articles, documents, and custom text input
- URL-based web page summarization
- PDF and text file parsing support
- AI-powered contextual summarization
- Conversational follow-up questions based on summaries
- Modern responsive frontend with dark mode
- REST API backend with scalable architecture

---

## Tech Stack

Frontend:
- React / Next.js
- TypeScript
- TailwindCSS

Backend:
- FastAPI / NestJS
- Python / Node.js

Database:
- PostgreSQL
- Prisma ORM

AI Integration:
- Gemini API / OpenAI API

Other:
- JWT Authentication
- REST API Architecture

---

## System Architecture

The application follows a full-stack client-server architecture:

1. Frontend accepts user input (text, file, or URL)
2. Input is sent to backend via REST API
3. Backend processes and prepares text data
4. AI model generates contextual summary
5. Backend returns structured summary response
6. Frontend displays summary and allows follow-up queries

This architecture demonstrates scalable backend design and frontend-backend integration.

---

## What This Project Demonstrates

This project demonstrates my ability to:

- Build full-stack applications using React and FastAPI/NestJS
- Design scalable REST APIs
- Integrate AI APIs into production applications
- Handle file uploads and document processing
- Manage frontend-backend communication
- Structure real-world production-ready applications

---

## Repository Structure

```
Saransh-AI/
│
├── frontend/       # React / Next.js frontend
├── backend/        # FastAPI / NestJS backend
├── python/         # AI processing logic
└── README.md
```

---

## Installation

### Backend Setup

```
cd backend
python -m venv env
source env/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend Setup

```
cd frontend
npm install
npm run dev
```

---

## Challenges Solved

- Integrating AI APIs into web applications
- Managing frontend-backend communication
- Processing large text inputs efficiently
- Designing scalable backend architecture
- Handling document parsing and summarization

---

## Author

Saahil Vishwakarma  
Portfolio: https://saahil-portfolio.vercel.app  
GitHub: https://github.com/Saahil-04  
LinkedIn: https://www.linkedin.com/in/saahil-vishwakarma-7a5943288/
