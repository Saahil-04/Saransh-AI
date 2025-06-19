# 🚀 SaranshAI

**SaranshAI** is an intelligent text summarization and analysis platform powered by advanced natural language processing. Whether it's a lengthy article, PDF, or web page—SaranshAI delivers concise, accurate, and context-aware summaries in seconds.

---

## 🧠 Features

- 🔍 **Automatic Summarization** of articles, PDFs, and custom input
- 🌐 **Web Page Input** – paste any URL and get a summary
- 📄 **Document Parsing** – supports `.txt`, `.pdf`, and more
- 🗣️ **Conversational Follow-ups** – ask questions based on the summary
- 🎯 **Contextual Accuracy** – keeps the original intent intact
- 💬 **Multi-language Support** *(optional)*
- 🌙 **Dark Mode UI** *(frontend only)*

---

## 🛠️ Tech Stack

| Frontend         | Backend        | AI/ML Models     | Database      |
|------------------|----------------|------------------|---------------|
| Next.js / React  | FastAPI / NestJS | OpenAI / Gemini  | PostgreSQL    |

Optional:
- 🗂️ File uploads with Tesseract OCR (for images)
- 🧪 TypeScript, TailwindCSS, Prisma ORM, JWT Auth

---

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/SaranshAI.git
cd SaranshAI

## Backend Setup

cd backend
python -m venv env
source env/bin/activate  # or ./env/Scripts/activate on Windows
pip install -r requirements.txt
uvicorn main:app --reload

## Frontend Setup

cd frontend
npm install
npm run dev

