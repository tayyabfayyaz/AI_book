# Implementation Plan: RAG Chatbot for AI Book

**Branch**: `2-rag-chatbot` | **Date**: 2025-12-10 | **Spec**: [specs/2-rag-chatbot/spec.md](spec.md)
**Input**: Feature specification from `/specs/2-rag-chatbot/spec.md`

## Summary

Build and embed a Retrieval-Augmented Generation (RAG) chatbot within the AI Book Knowledge Docusaurus site. The chatbot will use Google Gemini 2.0 Flash (free tier) for language generation, Qdrant Cloud (free tier) for vector storage, and FastAPI for the backend. Key features include:
- General Q&A about book content
- Context-aware Q&A based on user-selected text
- Session-based conversation history
- Source references for answers

## Technical Context

**Language/Version**:
- Frontend: TypeScript/React (Docusaurus 3.9.2, React 19)
- Backend: Python 3.12

**Primary Dependencies**:
- Frontend: React, Docusaurus, CSS Modules
- Backend: FastAPI, google-generativeai, qdrant-client, python-dotenv

**Storage**:
- Vector Database: Qdrant Cloud (free tier) for document embeddings
- Future: Neon Serverless Postgres (for conversation persistence if needed)

**Testing**: Manual testing, Jest for frontend (optional)

**Target Platform**: Web (Docusaurus on GitHub Pages)

**Project Type**: Web application (frontend + backend)

**Performance Goals**:
- Response time < 5 seconds (p95)
- Support concurrent users within free tier limits

**Constraints**:
- Gemini API free tier rate limits
- Qdrant Cloud free tier (1GB storage, 1M vectors)
- Static frontend deployment on GitHub Pages
- Backend must be deployed separately (e.g., Railway, Render, or local)

**Scale/Scope**:
- ~12 markdown documents to index
- Single chatbot instance
- Session-based conversations (no persistence initially)

## Constitution Check

*GATE: Must pass before implementation. All items verified.*

- [x] **CORE PURPOSE**: Plan aligns with enhancing the Docusaurus Web Book with interactive Q&A capabilities.
- [x] **STYLE & FORMATTING**: Chatbot UI follows Docusaurus theming conventions.
- [x] **STRUCTURE**: Component structure follows Docusaurus patterns (src/components, src/theme).
- [x] **TECHNICAL**: Uses Docusaurus 3.9.2, Node.js 20+, compatible with GitHub Pages.
- [x] **GITHUB PAGES**: Frontend is static; backend deployed separately with CORS configured.
- [x] **QUALITY**: Implementation uses verified APIs and tested libraries.
- [x] **SAFETY**: API keys stored in environment variables, never committed. `.env` in `.gitignore`.

## Project Structure

### Documentation (this feature)

```text
specs/2-rag-chatbot/
├── plan.md              # This file
├── spec.md              # Feature specification
├── checklists/          # Validation checklists
│   └── requirements.md
└── tasks.md             # Implementation tasks (created by /sp.tasks)
```

### Source Code (repository root)

```text
# Frontend (Docusaurus)
src/
├── components/
│   └── Chatbot/
│       ├── index.tsx           # Main chatbot component
│       ├── ChatWindow.tsx      # Chat message display
│       ├── ChatInput.tsx       # User input field
│       ├── MessageBubble.tsx   # Individual message component
│       ├── SourceReference.tsx # Source link component
│       ├── SelectionContext.tsx # Selected text display
│       └── styles.module.css   # Component styles
├── hooks/
│   ├── useTextSelection.ts     # Hook to capture text selection
│   └── useChatbot.ts           # Hook for chatbot state management
├── contexts/
│   └── ChatbotContext.tsx      # React context for chatbot state
└── theme/
    └── Root.js                 # Docusaurus Root wrapper (inject chatbot)

# Backend (FastAPI)
chatbot-api/
├── main.py                     # FastAPI application entry point
├── config.py                   # Configuration and environment variables
├── requirements.txt            # Python dependencies
├── .env.example                # Environment variable template
├── routers/
│   └── chat.py                 # Chat endpoint router
├── services/
│   ├── embedding_service.py    # Document embedding service
│   ├── vector_store.py         # Qdrant vector store operations
│   ├── llm_service.py          # Gemini LLM interactions
│   └── rag_service.py          # RAG pipeline orchestration
├── models/
│   ├── chat.py                 # Pydantic models for chat
│   └── document.py             # Document chunk models
├── scripts/
│   └── ingest_docs.py          # Script to ingest book content
└── README.md                   # Backend setup instructions
```

**Structure Decision**: Web application pattern with:
- Frontend integrated into existing Docusaurus project
- Backend as a separate FastAPI service in `chatbot-api/` directory
- Clear separation allows independent deployment and scaling

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      Docusaurus Frontend                         │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────────┐ │
│  │  Chatbot    │  │   Text       │  │    Book Content         │ │
│  │  Component  │←→│  Selection   │  │    (Markdown Pages)     │ │
│  │             │  │   Hook       │  │                         │ │
│  └──────┬──────┘  └──────────────┘  └─────────────────────────┘ │
└─────────┼───────────────────────────────────────────────────────┘
          │ HTTP/REST
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                      FastAPI Backend                             │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────────┐ │
│  │  /chat      │→ │  RAG         │→ │   Gemini 2.0 Flash      │ │
│  │  endpoint   │  │  Service     │  │   (LLM Generation)      │ │
│  └─────────────┘  └──────┬───────┘  └─────────────────────────┘ │
│                          │                                       │
│                          ▼                                       │
│                   ┌──────────────┐                               │
│                   │   Qdrant     │                               │
│                   │   Cloud      │                               │
│                   │ (Embeddings) │                               │
│                   └──────────────┘                               │
└─────────────────────────────────────────────────────────────────┘
```

## Component Design

### Frontend Components

#### 1. Chatbot (Main Component)
- **Purpose**: Container component managing chatbot state and rendering
- **State**: isOpen, messages[], selectedText, isLoading
- **Children**: ChatWindow, ChatInput, SelectionContext

#### 2. ChatWindow
- **Purpose**: Display conversation history
- **Props**: messages[], isLoading
- **Features**: Auto-scroll, loading indicator

#### 3. ChatInput
- **Purpose**: User input handling
- **Props**: onSend, disabled
- **Features**: Enter to send, send button

#### 4. MessageBubble
- **Purpose**: Render individual messages
- **Props**: message (content, sender, sources, timestamp)
- **Features**: Different styling for user/bot, markdown rendering

#### 5. SourceReference
- **Purpose**: Display and link to source documents
- **Props**: sources[]
- **Features**: Clickable links to book sections

#### 6. SelectionContext
- **Purpose**: Show selected text context
- **Props**: selectedText, onClear
- **Features**: Display truncated selection, clear button

### Backend Services

#### 1. RAG Service (`rag_service.py`)
- **Purpose**: Orchestrate the RAG pipeline
- **Methods**:
  - `get_response(query, selected_text, conversation_history)` → response with sources
- **Flow**: Query → Embed → Search Qdrant → Build prompt → Call Gemini → Return response

#### 2. Embedding Service (`embedding_service.py`)
- **Purpose**: Generate embeddings using Gemini
- **Methods**:
  - `embed_text(text)` → embedding vector
  - `embed_documents(documents)` → list of embeddings

#### 3. Vector Store Service (`vector_store.py`)
- **Purpose**: Manage Qdrant operations
- **Methods**:
  - `upsert_documents(chunks)` → store document chunks
  - `search(query_embedding, top_k)` → similar documents

#### 4. LLM Service (`llm_service.py`)
- **Purpose**: Interact with Gemini API
- **Methods**:
  - `generate_response(prompt, context)` → generated text

## API Design

### Endpoints

#### POST `/chat`
**Request Body**:
```json
{
  "query": "What is the Robotic Nervous System?",
  "selected_text": null,
  "conversation_history": [
    {"role": "user", "content": "previous question"},
    {"role": "assistant", "content": "previous answer"}
  ]
}
```

**Response**:
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

#### GET `/health`
**Response**:
```json
{
  "status": "healthy",
  "model": "gemini-2.0-flash",
  "documents_indexed": 12
}
```

## Data Flow

### 1. Document Ingestion (One-time setup)
```
Markdown Files → Read Content → Split into Chunks → Generate Embeddings → Store in Qdrant
```

### 2. Query Processing
```
User Query + Selected Text → Generate Query Embedding → Search Qdrant for Similar Chunks
→ Build Context Prompt → Call Gemini → Parse Response → Return with Sources
```

### 3. Conversation Flow
```
User Opens Chatbot → Check for Selected Text → User Sends Message
→ Add to Conversation History → Call Backend → Display Response → Update History
```

## Environment Configuration

### Frontend (.env - for development)
```env
REACT_APP_CHATBOT_API_URL=http://localhost:8000
```

### Backend (.env)
```env
# Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# Qdrant Cloud
QDRANT_URL=https://your-cluster.qdrant.io
QDRANT_API_KEY=your_qdrant_api_key_here
QDRANT_COLLECTION_NAME=book_docs

# CORS
ALLOWED_ORIGINS=http://localhost:3000,https://your-github-pages-url.github.io

# Optional: Neon Postgres (for future)
# NEON_DATABASE_URL=postgresql://...
```

## Deployment Strategy

### Frontend
- Deployed with Docusaurus to GitHub Pages
- Chatbot API URL configured via environment variable
- Static assets, no server-side rendering needed

### Backend
- Deploy to Railway, Render, or similar PaaS
- Environment variables configured in deployment platform
- CORS configured to allow GitHub Pages origin
- Health endpoint for monitoring

## Error Handling

### Frontend
- Network errors: Display "Unable to connect. Please try again."
- Timeout (>10s): Display "Request timed out. Please try again."
- API errors: Display user-friendly message from response

### Backend
- Gemini API errors: Return 503 with retry suggestion
- Qdrant errors: Return 503 with service unavailable message
- Validation errors: Return 400 with specific field errors
- Rate limiting: Return 429 with wait time

## Security Considerations

1. **API Keys**: Never expose in frontend code; backend handles all API calls
2. **CORS**: Strictly configured to allow only the Docusaurus site origin
3. **Input Validation**: Sanitize and limit input length (2000 chars max)
4. **Rate Limiting**: Implement per-IP rate limiting on backend
5. **Content Filtering**: Use Gemini's built-in safety settings

## Complexity Tracking

| Decision | Why Needed | Alternative Rejected |
|----------|------------|----------------------|
| Separate backend service | GitHub Pages is static-only; need server for API calls | Serverless functions (too complex for RAG) |
| Qdrant Cloud | Purpose-built for vector search; free tier available | In-memory (not persistent), Pinecone (more expensive) |
| Session-based history | Simpler implementation; sufficient for MVP | Persistent history (requires auth, more complexity) |

## Risk Mitigation

1. **Risk**: Gemini API rate limits exceeded
   - **Mitigation**: Implement client-side debouncing; queue requests; cache common queries

2. **Risk**: Qdrant free tier storage exceeded
   - **Mitigation**: Monitor usage; optimize chunk size; prioritize core content

3. **Risk**: Backend deployment costs
   - **Mitigation**: Use free tier services (Railway, Render); optimize for cold starts

## Implementation Phases

### Phase 1: Foundation
- Set up backend project structure
- Configure Qdrant Cloud connection
- Implement document ingestion script
- Basic Gemini integration

### Phase 2: Core RAG Pipeline
- Implement embedding service
- Implement vector search
- Build RAG orchestration
- Create /chat endpoint

### Phase 3: Frontend Integration
- Create Chatbot component
- Implement text selection hook
- Integrate with backend API
- Add to Docusaurus Root

### Phase 4: Polish
- Add conversation history
- Implement source references
- Error handling and loading states
- Mobile responsiveness

### Phase 5: Deployment
- Deploy backend to PaaS
- Configure production environment
- Update frontend API URL
- End-to-end testing

## Next Steps

Run `/sp.tasks` to generate the detailed task list for implementation.
