"""Vector store service using Qdrant Cloud."""

import logging
from typing import Optional
from uuid import uuid4

from qdrant_client import QdrantClient
from qdrant_client.http import models as qdrant_models
from qdrant_client.http.exceptions import UnexpectedResponse

from config import get_settings
from models.document import DocumentChunk, DocumentMetadata

logger = logging.getLogger(__name__)


class VectorStoreService:
    """Service for managing document vectors in Qdrant."""

    def __init__(
        self,
        url: Optional[str] = None,
        api_key: Optional[str] = None,
        collection_name: Optional[str] = None,
    ):
        """Initialize the vector store service.

        Args:
            url: Qdrant server URL. If not provided, uses settings.
            api_key: Qdrant API key. If not provided, uses settings.
            collection_name: Name of the collection. If not provided, uses settings.
        """
        settings = get_settings()
        self.url = url or settings.qdrant_url
        self.api_key = api_key or settings.qdrant_api_key
        self.collection_name = collection_name or settings.qdrant_collection_name
        self.embedding_dimensions = settings.embedding_dimensions

        self.client = QdrantClient(
            url=self.url,
            api_key=self.api_key,
        )

        # Ensure collection exists
        self._ensure_collection()

    def _ensure_collection(self):
        """Ensure the collection exists, create if not."""
        try:
            self.client.get_collection(self.collection_name)
            logger.info(f"Collection '{self.collection_name}' exists")
        except (UnexpectedResponse, Exception) as e:
            logger.info(f"Creating collection '{self.collection_name}'")
            self.client.create_collection(
                collection_name=self.collection_name,
                vectors_config=qdrant_models.VectorParams(
                    size=self.embedding_dimensions,
                    distance=qdrant_models.Distance.COSINE,
                ),
            )

    def upsert_documents(self, chunks: list[DocumentChunk]) -> int:
        """Store document chunks with their embeddings in Qdrant.

        Args:
            chunks: List of document chunks with embeddings.

        Returns:
            Number of documents upserted.
        """
        if not chunks:
            return 0

        points = []
        for chunk in chunks:
            if chunk.embedding is None:
                logger.warning(f"Skipping chunk {chunk.id} - no embedding")
                continue

            point = qdrant_models.PointStruct(
                id=chunk.id,
                vector=chunk.embedding,
                payload={
                    "content": chunk.content,
                    "title": chunk.metadata.title,
                    "path": chunk.metadata.path,
                    "chunk_index": chunk.metadata.chunk_index,
                },
            )
            points.append(point)

        if points:
            self.client.upsert(
                collection_name=self.collection_name,
                points=points,
            )
            logger.info(f"Upserted {len(points)} documents")

        return len(points)

    def search(
        self, query_embedding: list[float], top_k: int = 5
    ) -> list[DocumentChunk]:
        """Search for similar documents.

        Args:
            query_embedding: The query vector.
            top_k: Number of results to return.

        Returns:
            List of similar document chunks.
        """
        results = self.client.search(
            collection_name=self.collection_name,
            query_vector=query_embedding,
            limit=top_k,
        )

        chunks = []
        for result in results:
            payload = result.payload
            chunk = DocumentChunk(
                id=str(result.id),
                content=payload.get("content", ""),
                metadata=DocumentMetadata(
                    title=payload.get("title", ""),
                    path=payload.get("path", ""),
                    chunk_index=payload.get("chunk_index", 0),
                ),
            )
            chunks.append(chunk)

        return chunks

    def get_collection_info(self) -> dict:
        """Get information about the collection.

        Returns:
            Dictionary with collection info.
        """
        try:
            info = self.client.get_collection(self.collection_name)
            return {
                "name": self.collection_name,
                "vectors_count": info.vectors_count,
                "points_count": info.points_count,
                "status": info.status.value,
            }
        except Exception as e:
            logger.error(f"Failed to get collection info: {e}")
            return {
                "name": self.collection_name,
                "error": str(e),
            }

    def delete_collection(self):
        """Delete the collection. Use with caution!"""
        self.client.delete_collection(self.collection_name)
        logger.info(f"Deleted collection '{self.collection_name}'")

    def clear_collection(self):
        """Clear all points from the collection."""
        self.client.delete(
            collection_name=self.collection_name,
            points_selector=qdrant_models.FilterSelector(
                filter=qdrant_models.Filter(must=[])
            ),
        )
        logger.info(f"Cleared collection '{self.collection_name}'")
