"""FastAPI application entry point for the RAG chatbot API."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from config import get_settings
from routers import chat

# Load environment variables
load_dotenv()

# Get settings
settings = get_settings()

# Create FastAPI app
app = FastAPI(
    title="AI Book RAG Chatbot API",
    description="A Retrieval-Augmented Generation chatbot for answering questions about AI book content",
    version="1.0.0",
)

# Configure CORS
origins = [origin.strip() for origin in settings.allowed_origins.split(",")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(chat.router, prefix="/chat", tags=["chat"])


@app.get("/")
async def root():
    """Root endpoint with API info."""
    return {
        "name": "AI Book RAG Chatbot API",
        "version": "1.0.0",
        "description": "Ask questions about AI book content",
        "endpoints": {
            "chat": "/chat",
            "health": "/health",
        },
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "model": "gemini-2.5-flash",
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
