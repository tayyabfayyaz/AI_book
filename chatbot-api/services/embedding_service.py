"""Embedding service using Google Gemini."""

import logging
import time
from typing import Optional

import google.generativeai as genai

from config import get_settings

logger = logging.getLogger(__name__)


class EmbeddingService:
    """Service for generating text embeddings using Gemini."""

    def __init__(self, api_key: Optional[str] = None):
        """Initialize the embedding service.

        Args:
            api_key: Gemini API key. If not provided, uses settings.
        """
        settings = get_settings()
        self.api_key = api_key or settings.gemini_api_key
        genai.configure(api_key=self.api_key)
        self.model_name = "models/text-embedding-004"
        self.dimensions = settings.embedding_dimensions

    def embed_text(self, text: str, max_retries: int = 3) -> list[float]:
        """Generate embedding for a single text.

        Args:
            text: The text to embed.
            max_retries: Maximum number of retry attempts.

        Returns:
            List of floats representing the embedding vector.

        Raises:
            Exception: If embedding fails after all retries.
        """
        for attempt in range(max_retries):
            try:
                result = genai.embed_content(
                    model=self.model_name,
                    content=text,
                    task_type="retrieval_document",
                )
                return result["embedding"]
            except Exception as e:
                logger.warning(f"Embedding attempt {attempt + 1} failed: {e}")
                if attempt < max_retries - 1:
                    time.sleep(2 ** attempt)  # Exponential backoff
                else:
                    raise

    def embed_query(self, query: str, max_retries: int = 3) -> list[float]:
        """Generate embedding for a query (uses different task type for better retrieval).

        Args:
            query: The query text to embed.
            max_retries: Maximum number of retry attempts.

        Returns:
            List of floats representing the embedding vector.
        """
        for attempt in range(max_retries):
            try:
                result = genai.embed_content(
                    model=self.model_name,
                    content=query,
                    task_type="retrieval_query",
                )
                return result["embedding"]
            except Exception as e:
                logger.warning(f"Query embedding attempt {attempt + 1} failed: {e}")
                if attempt < max_retries - 1:
                    time.sleep(2 ** attempt)
                else:
                    raise

    def embed_batch(
        self, texts: list[str], batch_size: int = 100, max_retries: int = 3
    ) -> list[list[float]]:
        """Generate embeddings for a batch of texts.

        Args:
            texts: List of texts to embed.
            batch_size: Number of texts to process in each batch.
            max_retries: Maximum number of retry attempts per batch.

        Returns:
            List of embedding vectors.
        """
        embeddings = []

        for i in range(0, len(texts), batch_size):
            batch = texts[i : i + batch_size]
            logger.info(f"Processing batch {i // batch_size + 1}, size: {len(batch)}")

            for attempt in range(max_retries):
                try:
                    # Process batch one by one (Gemini doesn't support true batch embedding)
                    batch_embeddings = []
                    for text in batch:
                        result = genai.embed_content(
                            model=self.model_name,
                            content=text,
                            task_type="retrieval_document",
                        )
                        batch_embeddings.append(result["embedding"])
                        time.sleep(0.1)  # Rate limiting

                    embeddings.extend(batch_embeddings)
                    break
                except Exception as e:
                    logger.warning(f"Batch embedding attempt {attempt + 1} failed: {e}")
                    if attempt < max_retries - 1:
                        time.sleep(2 ** attempt)
                    else:
                        raise

        return embeddings
