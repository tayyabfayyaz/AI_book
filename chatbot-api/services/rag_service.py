"""RAG service orchestrating the retrieval-augmented generation pipeline."""

import logging
from typing import Optional

from config import get_settings
from models.chat import ChatResponse, ConversationMessage
from models.document import DocumentChunk, Source
from services.embedding_service import EmbeddingService
from services.llm_service import LLMService
from services.vector_store import VectorStoreService

logger = logging.getLogger(__name__)


class RAGService:
    """Service orchestrating the RAG pipeline."""

    def __init__(
        self,
        embedding_service: Optional[EmbeddingService] = None,
        vector_store: Optional[VectorStoreService] = None,
        llm_service: Optional[LLMService] = None,
    ):
        """Initialize the RAG service.

        Args:
            embedding_service: Optional embedding service instance.
            vector_store: Optional vector store service instance.
            llm_service: Optional LLM service instance.
        """
        self.embedding_service = embedding_service or EmbeddingService()
        self.vector_store = vector_store or VectorStoreService()
        self.llm_service = llm_service or LLMService()
        self.settings = get_settings()

    def get_response(
        self,
        query: str,
        selected_text: Optional[str] = None,
        conversation_history: Optional[list[ConversationMessage]] = None,
    ) -> ChatResponse:
        """Get a response for a user query using RAG.

        Args:
            query: The user's question.
            selected_text: Optional user-selected text for context.
            conversation_history: Optional conversation history.

        Returns:
            ChatResponse with the generated response and sources.
        """
        logger.info(f"Processing query: {query[:100]}...")

        # Step 1: Generate query embedding
        logger.debug("Generating query embedding...")
        query_embedding = self.embedding_service.embed_query(query)

        # Step 2: Retrieve relevant documents
        logger.debug("Searching for relevant documents...")
        context_chunks = self.vector_store.search(
            query_embedding=query_embedding,
            top_k=self.settings.top_k_results,
        )
        logger.info(f"Retrieved {len(context_chunks)} relevant chunks")

        # Step 3: Generate response with context
        logger.debug("Generating response...")
        response_text = self.llm_service.generate_with_context(
            query=query,
            context_chunks=context_chunks,
            selected_text=selected_text,
            conversation_history=conversation_history,
        )

        # Step 4: Extract sources from context chunks
        sources = self._extract_sources(context_chunks)

        logger.info("Response generated successfully")
        return ChatResponse(
            response=response_text,
            sources=sources,
        )

    def _extract_sources(self, chunks: list[DocumentChunk]) -> list[Source]:
        """Extract unique sources from document chunks.

        Args:
            chunks: List of document chunks.

        Returns:
            List of unique sources with snippets.
        """
        seen_paths = set()
        sources = []

        for chunk in chunks:
            path = chunk.metadata.path
            if path not in seen_paths:
                seen_paths.add(path)
                # Create snippet (first 150 chars)
                snippet = chunk.content[:150] + "..." if len(chunk.content) > 150 else chunk.content
                sources.append(
                    Source(
                        title=chunk.metadata.title,
                        path=path,
                        snippet=snippet,
                    )
                )

        return sources

    def health_check(self) -> dict:
        """Check the health of all services.

        Returns:
            Dictionary with health status.
        """
        status = {
            "rag_service": "healthy",
            "embedding_service": "unknown",
            "vector_store": "unknown",
            "llm_service": "unknown",
        }

        # Check vector store
        try:
            info = self.vector_store.get_collection_info()
            status["vector_store"] = "healthy"
            status["documents_indexed"] = info.get("vectors_count", 0)
        except Exception as e:
            status["vector_store"] = f"unhealthy: {str(e)}"

        # We don't check embedding and LLM services proactively
        # as they would consume API quota
        status["embedding_service"] = "not_checked"
        status["llm_service"] = "not_checked"

        return status
