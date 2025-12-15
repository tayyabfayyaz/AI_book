"""LLM service using Google Gemini."""

import logging
from typing import Optional

import google.generativeai as genai

from config import get_settings
from models.chat import ConversationMessage
from models.document import DocumentChunk

logger = logging.getLogger(__name__)


class LLMService:
    """Service for generating responses using Gemini LLM."""

    def __init__(self, api_key: Optional[str] = None):
        """Initialize the LLM service.

        Args:
            api_key: Gemini API key. If not provided, uses settings.
        """
        settings = get_settings()
        self.api_key = api_key or settings.gemini_api_key
        genai.configure(api_key=self.api_key)

        # Initialize the model
        # Using gemini-2.5-flash - latest free model with separate quota
        self.model = genai.GenerativeModel(
            model_name="models/gemini-2.5-flash",
            generation_config={
                "temperature": 0.7,
                "top_p": 0.95,
                "top_k": 40,
                "max_output_tokens": 1024,
            },
            safety_settings={
                "HARM_CATEGORY_HARASSMENT": "BLOCK_MEDIUM_AND_ABOVE",
                "HARM_CATEGORY_HATE_SPEECH": "BLOCK_MEDIUM_AND_ABOVE",
                "HARM_CATEGORY_SEXUALLY_EXPLICIT": "BLOCK_MEDIUM_AND_ABOVE",
                "HARM_CATEGORY_DANGEROUS_CONTENT": "BLOCK_MEDIUM_AND_ABOVE",
            },
        )

    def build_rag_prompt(
        self,
        query: str,
        context_chunks: list[DocumentChunk],
        selected_text: Optional[str] = None,
        conversation_history: Optional[list[ConversationMessage]] = None,
    ) -> str:
        """Build a prompt for RAG response generation.

        Args:
            query: The user's question.
            context_chunks: Retrieved document chunks for context.
            selected_text: Optional user-selected text for additional context.
            conversation_history: Optional conversation history for context.

        Returns:
            The constructed prompt string.
        """
        # Build context from chunks
        context_parts = []
        for i, chunk in enumerate(context_chunks, 1):
            context_parts.append(
                f"[Source {i}: {chunk.metadata.title}]\n{chunk.content}"
            )
        context = "\n\n".join(context_parts)

        # Build conversation history
        history_text = ""
        if conversation_history and len(conversation_history) > 0:
            history_parts = []
            # Take only last 10 messages to keep context manageable
            recent_history = conversation_history[-10:]
            for msg in recent_history:
                role = "User" if msg.role == "user" else "Assistant"
                history_parts.append(f"{role}: {msg.content}")
            history_text = "\n".join(history_parts)

        # Build the prompt
        prompt_parts = [
            "You are a helpful assistant that answers questions about an AI robotics book.",
            "Answer questions based ONLY on the provided context from the book.",
            "If the information is not in the context, say so politely.",
            "Keep your answers concise and informative.",
            "When referencing information, mention which source it came from.",
        ]

        if selected_text:
            prompt_parts.append(
                f"\n--- USER SELECTED TEXT ---\n{selected_text}\n---"
            )
            prompt_parts.append(
                "The user has selected the above text. Consider this as primary context for their question."
            )

        prompt_parts.append(f"\n--- BOOK CONTEXT ---\n{context}\n---")

        if history_text:
            prompt_parts.append(f"\n--- CONVERSATION HISTORY ---\n{history_text}\n---")

        prompt_parts.append(f"\nUser Question: {query}")
        prompt_parts.append("\nAssistant:")

        return "\n".join(prompt_parts)

    def generate_response(self, prompt: str, max_retries: int = 3) -> str:
        """Generate a response using the Gemini model.

        Args:
            prompt: The prompt to generate a response for.
            max_retries: Maximum number of retry attempts.

        Returns:
            The generated response text.

        Raises:
            Exception: If generation fails after all retries.
        """
        for attempt in range(max_retries):
            try:
                response = self.model.generate_content(prompt)
                return response.text
            except Exception as e:
                logger.warning(f"Generation attempt {attempt + 1} failed: {e}")
                if attempt < max_retries - 1:
                    import time
                    time.sleep(2 ** attempt)
                else:
                    raise

    def generate_with_context(
        self,
        query: str,
        context_chunks: list[DocumentChunk],
        selected_text: Optional[str] = None,
        conversation_history: Optional[list[ConversationMessage]] = None,
    ) -> str:
        """Generate a response with RAG context.

        Args:
            query: The user's question.
            context_chunks: Retrieved document chunks.
            selected_text: Optional user-selected text.
            conversation_history: Optional conversation history.

        Returns:
            The generated response.
        """
        prompt = self.build_rag_prompt(
            query=query,
            context_chunks=context_chunks,
            selected_text=selected_text,
            conversation_history=conversation_history,
        )
        return self.generate_response(prompt)
