# Tasks: RAG Chatbot for AI Book

**Input**: Design documents from `/specs/2-rag-chatbot/`
**Prerequisites**: plan.md (required), spec.md (required)

**Tests**: Not explicitly requested - test tasks omitted unless required.

**Organization**: Tasks are grouped by phase and user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Frontend (Docusaurus)**: `src/components/`, `src/hooks/`, `src/contexts/`, `src/theme/`
- **Backend (FastAPI)**: `chatbot-api/`

---

## Phase 1: Setup & Foundation

**Purpose**: Project initialization, environment setup, and core infrastructure

### 1.1 Backend Project Setup

- [ ] T001 Create backend directory structure at `chatbot-api/`
- [ ] T002 [P] Create `chatbot-api/requirements.txt` with dependencies (fastapi, uvicorn, google-generativeai, qdrant-client, python-dotenv)
- [ ] T003 [P] Create `chatbot-api/.env.example` with environment variable template
- [ ] T004 [P] Create `chatbot-api/config.py` for configuration management
- [ ] T005 Create `chatbot-api/main.py` FastAPI application entry point with CORS middleware
- [ ] T006 [P] Create `chatbot-api/README.md` with setup and run instructions

### 1.2 Qdrant Cloud Setup

- [ ] T007 Create Qdrant Cloud account and cluster (free tier)
- [ ] T008 Create collection `book_docs` in Qdrant Cloud with appropriate vector dimensions (768 for Gemini embeddings)
- [ ] T009 Document Qdrant credentials in `.env.example` (QDRANT_URL, QDRANT_API_KEY)

### 1.3 Gemini API Setup

- [ ] T010 Obtain Gemini API key from Google AI Studio
- [ ] T011 Document Gemini credentials in `.env.example` (GEMINI_API_KEY)
- [ ] T012 Verify Gemini 2.0 Flash model access with test API call

**Checkpoint**: Backend project structure ready, external services configured

---

## Phase 2: Core Backend Services (Reusable Components)

**Purpose**: Build reusable backend services that form the RAG pipeline

### 2.1 Pydantic Models (Reusable Data Structures)

- [ ] T013 [P] Create `chatbot-api/models/document.py` with DocumentChunk model
  - Fields: id, content, metadata (title, path, chunk_index), embedding
- [ ] T014 [P] Create `chatbot-api/models/chat.py` with request/response models
  - ChatRequest: query, selected_text (optional), conversation_history
  - ChatResponse: response, sources[]
  - Source: title, path, snippet

### 2.2 Embedding Service (Reusable)

- [ ] T015 Create `chatbot-api/services/embedding_service.py`
  - [ ] T015.1 Implement `__init__` with Gemini client initialization
  - [ ] T015.2 Implement `embed_text(text: str) -> List[float]` for single text embedding
  - [ ] T015.3 Implement `embed_batch(texts: List[str]) -> List[List[float]]` for batch embedding
  - [ ] T015.4 Add error handling and retry logic for API failures

### 2.3 Vector Store Service (Reusable)

- [ ] T016 Create `chatbot-api/services/vector_store.py`
  - [ ] T016.1 Implement `__init__` with Qdrant client initialization
  - [ ] T016.2 Implement `upsert_documents(chunks: List[DocumentChunk])` to store embeddings
  - [ ] T016.3 Implement `search(query_embedding: List[float], top_k: int = 5) -> List[DocumentChunk]`
  - [ ] T016.4 Implement `get_collection_info()` for health checks
  - [ ] T016.5 Add connection pooling and error handling

### 2.4 LLM Service (Reusable)

- [ ] T017 Create `chatbot-api/services/llm_service.py`
  - [ ] T017.1 Implement `__init__` with Gemini 2.0 Flash model initialization
  - [ ] T017.2 Implement `generate_response(prompt: str) -> str` for text generation
  - [ ] T017.3 Implement `build_rag_prompt(query, context_chunks, selected_text, history)` prompt builder
  - [ ] T017.4 Add safety settings and content filtering configuration
  - [ ] T017.5 Add error handling for API rate limits and failures

### 2.5 RAG Service (Orchestration)

- [ ] T018 Create `chatbot-api/services/rag_service.py`
  - [ ] T018.1 Implement `__init__` with dependency injection (embedding, vector_store, llm services)
  - [ ] T018.2 Implement `get_response(query, selected_text, conversation_history) -> ChatResponse`
  - [ ] T018.3 Implement context retrieval logic (embed query → search → rank results)
  - [ ] T018.4 Implement source extraction from retrieved chunks
  - [ ] T018.5 Add logging for debugging and monitoring

**Checkpoint**: All backend services implemented and individually testable

---

## Phase 3: Document Ingestion Pipeline

**Purpose**: Ingest and index book content into Qdrant

### 3.1 Document Ingestion Script

- [ ] T019 Create `chatbot-api/scripts/ingest_docs.py`
  - [ ] T019.1 Implement markdown file discovery in `docs/` directory
  - [ ] T019.2 Implement markdown parsing and metadata extraction (title, path)
  - [ ] T019.3 Implement text chunking with overlap (chunk_size=1000, overlap=200)
  - [ ] T019.4 Implement batch embedding generation using embedding_service
  - [ ] T019.5 Implement batch upsert to Qdrant using vector_store service
  - [ ] T019.6 Add progress logging and error handling
  - [ ] T019.7 Add CLI argument for dry-run mode

### 3.2 Run Initial Ingestion

- [ ] T020 Execute ingestion script to index all book documents
- [ ] T021 Verify document count and sample queries in Qdrant dashboard

**Checkpoint**: All book content indexed in Qdrant, searchable via API

---

## Phase 4: API Endpoints

**Purpose**: Create REST API endpoints for the chatbot

### 4.1 Chat Router

- [ ] T022 Create `chatbot-api/routers/chat.py`
  - [ ] T022.1 [US1] Implement `POST /chat` endpoint with ChatRequest/ChatResponse
  - [ ] T022.2 [US2] Add selected_text handling in /chat endpoint
  - [ ] T022.3 [US3] Add conversation_history handling in /chat endpoint
  - [ ] T022.4 Implement request validation (max query length 2000 chars)
  - [ ] T022.5 Implement error responses (400, 429, 500, 503)

### 4.2 Health & Utility Endpoints

- [ ] T023 [P] Implement `GET /health` endpoint in `chatbot-api/main.py`
- [ ] T024 [P] Implement `GET /` root endpoint with API info

### 4.3 Register Routers

- [ ] T025 Register chat router in `chatbot-api/main.py`
- [ ] T026 Configure CORS for localhost and GitHub Pages origins

**Checkpoint**: Backend API fully functional, testable via curl/Postman

---

## Phase 5: Frontend Components (User Story 1 - General Q&A)

**Purpose**: Build core chatbot UI components for general Q&A

### 5.1 Chatbot Context & State Management

- [ ] T027 [US1] Create `src/contexts/ChatbotContext.tsx`
  - [ ] T027.1 Define ChatbotState interface (isOpen, messages, isLoading, selectedText)
  - [ ] T027.2 Implement ChatbotProvider with useReducer
  - [ ] T027.3 Implement actions: TOGGLE, SEND_MESSAGE, RECEIVE_MESSAGE, SET_LOADING, SET_ERROR
  - [ ] T027.4 Export useChatbot hook for consuming context

### 5.2 API Service Hook

- [ ] T028 [US1] Create `src/hooks/useChatApi.ts`
  - [ ] T028.1 Implement `sendMessage(query, selectedText, history)` async function
  - [ ] T028.2 Configure API URL from environment or fallback
  - [ ] T028.3 Add request timeout handling (10 seconds)
  - [ ] T028.4 Add error parsing and user-friendly messages

### 5.3 Message Components

- [ ] T029 [P] [US1] Create `src/components/Chatbot/MessageBubble.tsx`
  - [ ] T029.1 Implement user message styling (right-aligned, primary color)
  - [ ] T029.2 Implement bot message styling (left-aligned, secondary color)
  - [ ] T029.3 Add markdown rendering for bot messages
  - [ ] T029.4 Add timestamp display

- [ ] T030 [P] [US1] Create `src/components/Chatbot/styles.module.css`
  - [ ] T030.1 Define chatbot container styles (fixed position, z-index)
  - [ ] T030.2 Define toggle button styles
  - [ ] T030.3 Define chat window styles (width, height, shadow)
  - [ ] T030.4 Define message bubble styles
  - [ ] T030.5 Define input area styles
  - [ ] T030.6 Add responsive styles for mobile

### 5.4 Chat Window Component

- [ ] T031 [US1] Create `src/components/Chatbot/ChatWindow.tsx`
  - [ ] T031.1 Implement message list rendering with auto-scroll
  - [ ] T031.2 Implement loading indicator (typing dots)
  - [ ] T031.3 Implement empty state with welcome message
  - [ ] T031.4 Add ref for scroll container

### 5.5 Chat Input Component

- [ ] T032 [US1] Create `src/components/Chatbot/ChatInput.tsx`
  - [ ] T032.1 Implement controlled input field
  - [ ] T032.2 Implement send button
  - [ ] T032.3 Handle Enter key to send
  - [ ] T032.4 Disable input while loading
  - [ ] T032.5 Clear input after send

### 5.6 Main Chatbot Component

- [ ] T033 [US1] Create `src/components/Chatbot/index.tsx`
  - [ ] T033.1 Implement toggle button (fixed position bottom-right)
  - [ ] T033.2 Implement chat window open/close animation
  - [ ] T033.3 Compose ChatWindow, ChatInput components
  - [ ] T033.4 Connect to ChatbotContext
  - [ ] T033.5 Handle send message flow (dispatch actions, call API)

### 5.7 Integrate into Docusaurus

- [ ] T034 [US1] Update `src/theme/Root.js` to include ChatbotProvider and Chatbot component

**Checkpoint**: User Story 1 complete - Users can ask general questions and receive answers

---

## Phase 6: Text Selection Feature (User Story 2)

**Purpose**: Enable context-aware Q&A based on selected text

### 6.1 Text Selection Hook

- [ ] T035 [US2] Create `src/hooks/useTextSelection.ts`
  - [ ] T035.1 Implement selection change event listener
  - [ ] T035.2 Extract selected text from window.getSelection()
  - [ ] T035.3 Limit selection to 2000 characters with truncation notice
  - [ ] T035.4 Clear selection state when selection is empty
  - [ ] T035.5 Add debouncing for performance

### 6.2 Selection Context Component

- [ ] T036 [US2] Create `src/components/Chatbot/SelectionContext.tsx`
  - [ ] T036.1 Display selected text in a highlighted box
  - [ ] T036.2 Show truncation indicator if text was limited
  - [ ] T036.3 Add "Clear selection" button
  - [ ] T036.4 Add "Ask about this" prompt text

### 6.3 Integrate Selection into Chatbot

- [ ] T037 [US2] Update `src/contexts/ChatbotContext.tsx` to include selectedText state
- [ ] T038 [US2] Update `src/components/Chatbot/index.tsx` to use useTextSelection hook
- [ ] T039 [US2] Update `src/components/Chatbot/index.tsx` to display SelectionContext when text selected
- [ ] T040 [US2] Update `src/hooks/useChatApi.ts` to pass selectedText to API

**Checkpoint**: User Story 2 complete - Users can ask questions about selected text

---

## Phase 7: Conversation History (User Story 3)

**Purpose**: Maintain conversation context within session

### 7.1 Conversation State Management

- [ ] T041 [US3] Update `src/contexts/ChatbotContext.tsx` to maintain message history
- [ ] T042 [US3] Implement history formatting for API (last 10 messages max)
- [ ] T043 [US3] Update `src/hooks/useChatApi.ts` to send conversation_history
- [ ] T044 [US3] Preserve history when chatbot is closed/reopened (same session)

### 7.2 Backend History Handling

- [ ] T045 [US3] Update `chatbot-api/services/llm_service.py` to include history in prompt
- [ ] T046 [US3] Update prompt template to support multi-turn conversations

**Checkpoint**: User Story 3 complete - Users can have contextual follow-up conversations

---

## Phase 8: Source References (User Story 4)

**Purpose**: Display source documents used for answers

### 8.1 Source Reference Component

- [ ] T047 [P] [US4] Create `src/components/Chatbot/SourceReference.tsx`
  - [ ] T047.1 Display source title and snippet
  - [ ] T047.2 Implement clickable link to document path
  - [ ] T047.3 Style as collapsible/expandable section

### 8.2 Integrate Sources into Messages

- [ ] T048 [US4] Update `src/components/Chatbot/MessageBubble.tsx` to display sources
- [ ] T049 [US4] Update ChatbotContext to store sources with messages

**Checkpoint**: User Story 4 complete - Users can see and navigate to source references

---

## Phase 9: Error Handling & Polish

**Purpose**: Robust error handling, loading states, and UX polish

### 9.1 Error Handling

- [ ] T050 [P] Implement error boundary in `src/components/Chatbot/index.tsx`
- [ ] T051 [P] Create error message component with retry button
- [ ] T052 [P] Handle network errors with user-friendly messages
- [ ] T053 [P] Handle API timeout with retry suggestion

### 9.2 Loading States

- [ ] T054 [P] Implement typing indicator animation in CSS
- [ ] T055 [P] Disable send button while loading
- [ ] T056 [P] Show loading state in chat window

### 9.3 Mobile Responsiveness

- [ ] T057 Update styles for mobile viewport (full-width chat window)
- [ ] T058 Ensure touch-friendly button sizes
- [ ] T059 Test on mobile devices/emulators

### 9.4 Accessibility

- [ ] T060 [P] Add ARIA labels to chatbot toggle button
- [ ] T061 [P] Add keyboard navigation support (Escape to close)
- [ ] T062 [P] Ensure focus management when opening/closing

**Checkpoint**: Production-ready UI with robust error handling

---

## Phase 10: Deployment & Production

**Purpose**: Deploy backend and configure production environment

### 10.1 Backend Deployment

- [ ] T063 Create `chatbot-api/Procfile` for Railway/Render deployment
- [ ] T064 Create `chatbot-api/runtime.txt` specifying Python version
- [ ] T065 Deploy backend to Railway/Render (free tier)
- [ ] T066 Configure environment variables in deployment platform
- [ ] T067 Verify health endpoint responds correctly

### 10.2 Frontend Configuration

- [ ] T068 Update API URL for production in frontend code
- [ ] T069 Update CORS allowed origins to include GitHub Pages URL
- [ ] T070 Build and deploy Docusaurus site to GitHub Pages

### 10.3 End-to-End Testing

- [ ] T071 Test general Q&A flow in production
- [ ] T072 Test text selection Q&A in production
- [ ] T073 Test conversation history in production
- [ ] T074 Test source references navigation in production
- [ ] T075 Test error handling (disconnect backend temporarily)

**Checkpoint**: Fully deployed and tested in production

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup)
    ↓
Phase 2 (Backend Services) → Phase 3 (Ingestion) → Phase 4 (API Endpoints)
    ↓
Phase 5 (Frontend US1) → Phase 6 (US2) → Phase 7 (US3) → Phase 8 (US4)
    ↓
Phase 9 (Polish)
    ↓
Phase 10 (Deployment)
```

### Parallel Opportunities

**Within Phase 2**:
- T013, T014 (models) can run in parallel
- T015, T016, T017 (services) can start after models

**Within Phase 5**:
- T029, T030 (MessageBubble, styles) can run in parallel
- T031, T032 (ChatWindow, ChatInput) can run after styles

**Within Phase 9**:
- T050-T053 (error handling) can run in parallel
- T054-T056 (loading states) can run in parallel
- T060-T062 (accessibility) can run in parallel

---

## Reusable Components Summary

| Component | Location | Reusability |
|-----------|----------|-------------|
| EmbeddingService | `chatbot-api/services/embedding_service.py` | Any text embedding task |
| VectorStoreService | `chatbot-api/services/vector_store.py` | Any Qdrant-based search |
| LLMService | `chatbot-api/services/llm_service.py` | Any Gemini generation task |
| RAGService | `chatbot-api/services/rag_service.py` | Any RAG pipeline |
| ChatbotContext | `src/contexts/ChatbotContext.tsx` | Any chat-based UI |
| useTextSelection | `src/hooks/useTextSelection.ts` | Any text selection feature |
| MessageBubble | `src/components/Chatbot/MessageBubble.tsx` | Any chat interface |

---

## Implementation Strategy

### MVP First (Phase 1-5)

1. Complete Phase 1: Setup & Foundation
2. Complete Phase 2: Backend Services
3. Complete Phase 3: Document Ingestion
4. Complete Phase 4: API Endpoints
5. Complete Phase 5: Frontend (User Story 1)
6. **STOP and VALIDATE**: Test basic Q&A flow
7. Demo/Deploy MVP

### Incremental Delivery

- Phase 5 → User Story 1 (General Q&A) - **MVP**
- Phase 6 → User Story 2 (Selected Text Q&A)
- Phase 7 → User Story 3 (Conversation History)
- Phase 8 → User Story 4 (Source References)
- Phase 9-10 → Polish & Deploy

---

## Summary

| Phase | Task Count | Parallel Tasks | Description |
|-------|------------|----------------|-------------|
| 1 - Setup | 12 | 5 | Project structure, credentials |
| 2 - Backend Services | 6 (22 sub) | 2 | Reusable service components |
| 3 - Ingestion | 3 (8 sub) | 0 | Document indexing |
| 4 - API Endpoints | 5 (7 sub) | 2 | REST API |
| 5 - Frontend US1 | 8 (20 sub) | 2 | General Q&A UI |
| 6 - Frontend US2 | 6 (6 sub) | 0 | Text selection |
| 7 - Frontend US3 | 6 | 0 | Conversation history |
| 8 - Frontend US4 | 3 (3 sub) | 1 | Source references |
| 9 - Polish | 13 | 9 | Error handling, UX |
| 10 - Deployment | 13 | 0 | Production setup |
| **Total** | **75 tasks** | **21** | |

**MVP Scope**: Phases 1-5 (34 tasks + sub-tasks)
**Full Scope**: All phases (75 tasks + sub-tasks)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Sub-tasks (T0XX.X) provide granular implementation steps
- Each phase has a checkpoint for validation
- Services in Phase 2 are designed for reusability across projects
- Commit after each task or logical group
