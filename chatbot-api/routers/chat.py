"""Chat router for the RAG chatbot API."""

import logging
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status

from models.chat import ChatRequest, ChatResponse
from services.rag_service import RAGService

logger = logging.getLogger(__name__)

router = APIRouter()

# Dependency for RAG service - create fresh instance for each request during development
def get_rag_service() -> RAGService:
    """Get RAG service instance."""
    try:
        return RAGService()
    except Exception as e:
        logger.error(f"Failed to initialize RAG service: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Failed to initialize services: {str(e)}",
        )


@router.post("", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    rag_service: Annotated[RAGService, Depends(get_rag_service)],
) -> ChatResponse:
    """Process a chat request and return a RAG-based response.

    Args:
        request: The chat request containing query, optional selected text,
                 and conversation history.
        rag_service: The RAG service for processing the request.

    Returns:
        ChatResponse with the generated response and source references.

    Raises:
        HTTPException: If processing fails.
    """
    try:
        logger.info(f"Chat request: {request.query[:50]}...")

        # Validate query
        if not request.query.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Query cannot be empty",
            )

        # Process the request
        response = rag_service.get_response(
            query=request.query,
            selected_text=request.selected_text,
            conversation_history=request.conversation_history,
        )

        return response

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Chat error: {e}", exc_info=True)
        # Provide more specific error messages for common issues
        error_msg = str(e).lower()
        if "api key" in error_msg or "invalid api key" in error_msg or "api_key" in error_msg:
            detail = "API key configuration error. Please check GEMINI_API_KEY."
        elif "qdrant" in error_msg or "connection" in error_msg:
            detail = "Vector database connection error. Please check QDRANT_URL and QDRANT_API_KEY."
        elif "quota" in error_msg or "rate limit" in error_msg:
            detail = "API rate limit exceeded. Please try again later."
        elif "timeout" in error_msg:
            detail = "Request timed out. Please try again."
        else:
            detail = f"Service error: {str(e)}"
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=detail,
        )


@router.get("/health")
async def chat_health(
    rag_service: Annotated[RAGService, Depends(get_rag_service)],
) -> dict:
    """Health check for the chat service.

    Returns:
        Dictionary with health status information.
    """
    return rag_service.health_check()
