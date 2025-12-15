"""Chat models for the RAG chatbot API."""

from typing import Optional
from pydantic import BaseModel, Field

from models.document import Source


class ConversationMessage(BaseModel):
    """A message in the conversation history."""

    role: str = Field(..., description="Either 'user' or 'assistant'")
    content: str


class ChatRequest(BaseModel):
    """Request model for the chat endpoint."""

    query: str = Field(..., min_length=1, max_length=2000, description="The user's question")
    selected_text: Optional[str] = Field(
        None, max_length=2000, description="Optional selected text for context"
    )
    conversation_history: list[ConversationMessage] = Field(
        default_factory=list, description="Previous conversation messages"
    )


class ChatResponse(BaseModel):
    """Response model for the chat endpoint."""

    response: str = Field(..., description="The chatbot's response")
    sources: list[Source] = Field(default_factory=list, description="Source references")
