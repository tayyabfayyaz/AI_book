# AI Book RAG Chatbot API

A FastAPI backend for the RAG (Retrieval-Augmented Generation) chatbot that answers questions about AI book content.

## Features

- General Q&A about book content using RAG
- Context-aware answers based on user-selected text
- Conversation history support
- Source references for answers

## Tech Stack

- **FastAPI**: Web framework
- **Google Gemini 2.0 Flash**: Language model (free tier)
- **Qdrant Cloud**: Vector database (free tier)
- **Python 3.12+**

## Setup

### 1. Create Virtual Environment

```bash
cd chatbot-api
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Copy the example environment file and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env` with your actual values:
- `GEMINI_API_KEY`: Get from [Google AI Studio](https://aistudio.google.com/)
- `QDRANT_URL`: Your Qdrant Cloud cluster URL
- `QDRANT_API_KEY`: Your Qdrant Cloud API key

### 4. Ingest Book Content

Before running the chatbot, ingest the book content into Qdrant:

```bash
python scripts/ingest_docs.py
```

### 5. Run the Server

```bash
# Development
uvicorn main:app --reload --port 8000

# Production
uvicorn main:app --host 0.0.0.0 --port 8000
```

## API Endpoints

### `POST /chat`

Send a question to the chatbot.

**Request:**
```json
{
  "query": "What is the Robotic Nervous System?",
  "selected_text": null,
  "conversation_history": []
}
```

**Response:**
```json
{
  "response": "The Robotic Nervous System is...",
  "sources": [
    {
      "title": "The Robotic Nervous System",
      "path": "/docs/module-1/the-robotic-nervous-system",
      "snippet": "...relevant excerpt..."
    }
  ]
}
```

### `GET /health`

Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "model": "gemini-2.0-flash"
}
```

### `GET /`

API info endpoint.

## Project Structure

```
chatbot-api/
├── main.py                 # FastAPI application entry point
├── config.py               # Configuration management
├── requirements.txt        # Python dependencies
├── .env.example            # Environment variable template
├── README.md               # This file
├── routers/
│   └── chat.py             # Chat endpoint router
├── services/
│   ├── embedding_service.py    # Document embedding
│   ├── vector_store.py         # Qdrant operations
│   ├── llm_service.py          # Gemini LLM interactions
│   └── rag_service.py          # RAG pipeline orchestration
├── models/
│   ├── chat.py             # Chat request/response models
│   └── document.py         # Document chunk models
└── scripts/
    └── ingest_docs.py      # Document ingestion script
```

## Development

### Running Tests

```bash
pytest
```

### Code Formatting

```bash
black .
isort .
```
