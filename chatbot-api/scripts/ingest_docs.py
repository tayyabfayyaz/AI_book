#!/usr/bin/env python3
"""Script to ingest book documents into the Qdrant vector store."""

import argparse
import logging
import os
import re
import sys
from pathlib import Path
from uuid import uuid4

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from dotenv import load_dotenv

from config import get_settings
from models.document import DocumentChunk, DocumentMetadata
from services.embedding_service import EmbeddingService
from services.vector_store import VectorStoreService

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


def discover_markdown_files(docs_dir: Path) -> list[Path]:
    """Discover all markdown files in the docs directory.

    Args:
        docs_dir: Path to the docs directory.

    Returns:
        List of paths to markdown files.
    """
    md_files = list(docs_dir.rglob("*.md"))
    logger.info(f"Found {len(md_files)} markdown files")
    return md_files


def extract_title_from_markdown(content: str, file_path: Path) -> str:
    """Extract title from markdown content.

    Args:
        content: The markdown content.
        file_path: Path to the file (for fallback title).

    Returns:
        The extracted title.
    """
    # Try to find frontmatter title
    frontmatter_match = re.search(r'^---\s*\n.*?title:\s*["\']?([^"\'\n]+)["\']?\s*\n.*?---', content, re.DOTALL)
    if frontmatter_match:
        return frontmatter_match.group(1).strip()

    # Try to find first H1 heading
    h1_match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
    if h1_match:
        return h1_match.group(1).strip()

    # Fallback to filename
    return file_path.stem.replace("-", " ").title()


def parse_markdown(file_path: Path) -> tuple[str, str, str]:
    """Parse a markdown file and extract content.

    Args:
        file_path: Path to the markdown file.

    Returns:
        Tuple of (title, content, path).
    """
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    title = extract_title_from_markdown(content, file_path)

    # Remove frontmatter
    content = re.sub(r'^---\s*\n.*?---\s*\n', '', content, flags=re.DOTALL)

    # Clean up content (remove extra whitespace, but keep structure)
    content = content.strip()

    # Convert file path to URL path
    # e.g., docs/module-1/the-robotic-nervous-system.md -> /docs/module-1/the-robotic-nervous-system
    # Find the docs directory in the path and get relative path from there
    parts = file_path.parts
    try:
        docs_index = parts.index("docs")
        relative_parts = parts[docs_index:]
        url_path = "/" + "/".join(relative_parts)
        # Remove .md extension
        if url_path.endswith(".md"):
            url_path = url_path[:-3]
    except ValueError:
        # Fallback: use just the filename
        url_path = "/docs/" + file_path.stem

    return title, content, url_path


def chunk_text(
    text: str, chunk_size: int = 1000, overlap: int = 200
) -> list[str]:
    """Split text into overlapping chunks.

    Args:
        text: The text to chunk.
        chunk_size: Maximum size of each chunk.
        overlap: Number of characters to overlap between chunks.

    Returns:
        List of text chunks.
    """
    if len(text) <= chunk_size:
        return [text]

    chunks = []
    start = 0

    while start < len(text):
        end = start + chunk_size

        # Try to break at paragraph or sentence boundary
        if end < len(text):
            # Look for paragraph break
            para_break = text.rfind("\n\n", start, end)
            if para_break > start + chunk_size // 2:
                end = para_break

            # If no paragraph break, look for sentence break
            elif (sent_break := text.rfind(". ", start, end)) > start + chunk_size // 2:
                end = sent_break + 1

        chunk = text[start:end].strip()
        if chunk:
            chunks.append(chunk)

        start = end - overlap

    return chunks


def create_document_chunks(
    title: str, content: str, path: str, chunk_size: int = 1000, overlap: int = 200
) -> list[DocumentChunk]:
    """Create document chunks from content.

    Args:
        title: Document title.
        content: Document content.
        path: URL path to document.
        chunk_size: Maximum chunk size.
        overlap: Overlap between chunks.

    Returns:
        List of DocumentChunk objects.
    """
    text_chunks = chunk_text(content, chunk_size, overlap)
    chunks = []

    for i, text in enumerate(text_chunks):
        chunk = DocumentChunk(
            id=str(uuid4()),
            content=text,
            metadata=DocumentMetadata(
                title=title,
                path=path,
                chunk_index=i,
            ),
        )
        chunks.append(chunk)

    return chunks


def ingest_documents(
    docs_dir: Path,
    embedding_service: EmbeddingService,
    vector_store: VectorStoreService,
    dry_run: bool = False,
) -> int:
    """Ingest all documents into the vector store.

    Args:
        docs_dir: Path to the docs directory.
        embedding_service: Embedding service instance.
        vector_store: Vector store service instance.
        dry_run: If True, don't actually store documents.

    Returns:
        Number of chunks ingested.
    """
    settings = get_settings()
    md_files = discover_markdown_files(docs_dir)

    all_chunks = []

    for file_path in md_files:
        logger.info(f"Processing: {file_path}")

        try:
            title, content, url_path = parse_markdown(file_path)
            logger.info(f"  Title: {title}")
            logger.info(f"  Path: {url_path}")
            logger.info(f"  Content length: {len(content)} chars")

            chunks = create_document_chunks(
                title=title,
                content=content,
                path=url_path,
                chunk_size=settings.chunk_size,
                overlap=settings.chunk_overlap,
            )
            logger.info(f"  Created {len(chunks)} chunks")

            all_chunks.extend(chunks)
        except Exception as e:
            logger.error(f"  Error processing {file_path}: {e}")

    logger.info(f"\nTotal chunks to process: {len(all_chunks)}")

    if dry_run:
        logger.info("DRY RUN - not storing documents")
        return len(all_chunks)

    # Generate embeddings
    logger.info("Generating embeddings...")
    texts = [chunk.content for chunk in all_chunks]
    embeddings = embedding_service.embed_batch(texts)

    # Assign embeddings to chunks
    for chunk, embedding in zip(all_chunks, embeddings):
        chunk.embedding = embedding

    # Store in vector store
    logger.info("Storing in Qdrant...")
    count = vector_store.upsert_documents(all_chunks)

    return count


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description="Ingest book documents into Qdrant vector store"
    )
    parser.add_argument(
        "--docs-dir",
        type=str,
        default="../docs",
        help="Path to the docs directory (default: ../docs)",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Don't store documents, just show what would be processed",
    )
    parser.add_argument(
        "--clear",
        action="store_true",
        help="Clear existing documents before ingesting",
    )
    args = parser.parse_args()

    # Load environment variables
    load_dotenv()

    # Resolve docs directory path
    script_dir = Path(__file__).parent
    docs_dir = (script_dir / args.docs_dir).resolve()

    if not docs_dir.exists():
        logger.error(f"Docs directory not found: {docs_dir}")
        sys.exit(1)

    logger.info(f"Docs directory: {docs_dir}")

    # Initialize services
    embedding_service = EmbeddingService()
    vector_store = VectorStoreService()

    # Clear if requested
    if args.clear and not args.dry_run:
        logger.info("Clearing existing documents...")
        try:
            vector_store.delete_collection()
            vector_store = VectorStoreService()  # Recreate
        except Exception as e:
            logger.warning(f"Could not clear collection: {e}")

    # Show collection info
    info = vector_store.get_collection_info()
    logger.info(f"Collection info: {info}")

    # Ingest documents
    count = ingest_documents(
        docs_dir=docs_dir,
        embedding_service=embedding_service,
        vector_store=vector_store,
        dry_run=args.dry_run,
    )

    logger.info(f"\nIngestion complete! Processed {count} chunks.")

    # Show final collection info
    if not args.dry_run:
        info = vector_store.get_collection_info()
        logger.info(f"Final collection info: {info}")


if __name__ == "__main__":
    main()
