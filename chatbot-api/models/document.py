"""Document models for the RAG chatbot."""

from typing import Optional
from pydantic import BaseModel


class DocumentMetadata(BaseModel):
    """Metadata for a document chunk."""

    title: str
    path: str
    chunk_index: int


class DocumentChunk(BaseModel):
    """A chunk of document content with embedding."""

    id: str
    content: str
    metadata: DocumentMetadata
    embedding: Optional[list[float]] = None


class Source(BaseModel):
    """Source reference for a response."""

    title: str
    path: str
    snippet: str
