# Feature Specification: RAG Chatbot for AI Book

**Feature Branch**: `2-rag-chatbot`
**Created**: 2025-12-10
**Status**: Draft
**Input**: User description: "Integrated RAG Chatbot Development: Build and embed a Retrieval-Augmented Generation (RAG) chatbot within the published book. This chatbot, utilizing the OpenAI Agents/ChatKit SDKs, FastAPI, Neon Serverless Postgres database, and Qdrant Cloud Free Tier, must be able to answer user questions about the book's content, including answering questions based only on text selected by the user. Note: use the gemini free model and configuration."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ask General Questions About Book Content (Priority: P1)

As a reader, I want to ask questions about the book's content so that I can get quick answers and clarifications without searching manually.

**Why this priority**: This is the core functionality of the chatbot - answering questions about book content is the primary use case.

**Independent Test**: User can open the chatbot, type a question like "What is the Robotic Nervous System?", and receive an accurate answer based on the book content.

**Acceptance Scenarios**:

1. **Given** I am on any page of the book, **When** I click the chatbot icon, **Then** a chat interface opens.
2. **Given** the chat interface is open, **When** I type a question about the book's content and press enter/send, **Then** I receive a relevant answer within 5 seconds.
3. **Given** I ask a question about content that exists in the book, **When** the chatbot responds, **Then** the response is accurate and based on the actual book content.
4. **Given** I ask a question about content NOT in the book, **When** the chatbot responds, **Then** it politely indicates the information is not available in the book.

---

### User Story 2 - Ask Questions About Selected Text (Priority: P1)

As a reader, I want to select text in the book and ask questions specifically about that selection so that I can get contextual explanations.

**Why this priority**: This differentiates the chatbot from a simple search - providing contextual, selection-based Q&A is a key feature.

**Independent Test**: User can select a paragraph of text, click the chatbot, and the chatbot offers to answer questions about the selected text.

**Acceptance Scenarios**:

1. **Given** I have selected text on a book page, **When** I open the chatbot, **Then** the chatbot shows the selected text and offers to answer questions about it.
2. **Given** I have selected text and opened the chatbot, **When** I ask "Explain this in simpler terms", **Then** the chatbot provides a simplified explanation of the selected text.
3. **Given** I have selected a technical term, **When** I ask "What does this mean?", **Then** the chatbot provides a definition based on the book's context.
4. **Given** I clear my text selection, **When** I open the chatbot, **Then** it returns to general Q&A mode without the selection context.

---

### User Story 3 - Maintain Conversation History (Priority: P2)

As a reader, I want the chatbot to remember our conversation within a session so that I can ask follow-up questions naturally.

**Why this priority**: Conversation context improves user experience but is not essential for basic functionality.

**Independent Test**: User can ask "What is Module 1 about?" then follow up with "Tell me more about that" and receive a contextual response.

**Acceptance Scenarios**:

1. **Given** I have asked a question and received an answer, **When** I ask a follow-up question like "Can you explain that further?", **Then** the chatbot understands the context and responds appropriately.
2. **Given** I have an ongoing conversation, **When** I close and reopen the chatbot within the same page session, **Then** my conversation history is preserved.
3. **Given** I refresh the page or navigate away, **When** I return, **Then** my conversation history is cleared (session-based, not persistent).

---

### User Story 4 - View Source References (Priority: P3)

As a reader, I want to see which parts of the book the chatbot used to generate its answer so that I can verify the information and read more.

**Why this priority**: Source attribution builds trust but is an enhancement over basic Q&A.

**Independent Test**: User asks a question and the response includes clickable links to the relevant book sections.

**Acceptance Scenarios**:

1. **Given** I ask a question, **When** I receive a response, **Then** the response includes references to the source document(s) used.
2. **Given** a response includes source references, **When** I click on a reference, **Then** I am navigated to that section of the book.

---

### Edge Cases

- What happens when the user asks questions in a language other than English? (Respond in the same language if possible, or indicate English-only support)
- How does the system handle very long text selections? (Limit to 2000 characters, truncate with notice)
- What happens when the backend service is unavailable? (Display friendly error message with retry option)
- How does the chatbot handle offensive or inappropriate questions? (Politely decline and suggest book-related questions)
- What happens when multiple rapid requests are sent? (Rate limiting with user-friendly message)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a chatbot toggle button on all book pages.
- **FR-002**: System MUST provide a chat interface that opens/closes when the toggle is clicked.
- **FR-003**: System MUST accept text input from users and send it to the backend for processing.
- **FR-004**: System MUST display responses from the AI model in the chat interface.
- **FR-005**: System MUST detect and capture user text selections on book pages.
- **FR-006**: System MUST pass selected text as context to the AI model when answering questions.
- **FR-007**: System MUST use Retrieval-Augmented Generation (RAG) to ground responses in book content.
- **FR-008**: System MUST store book content embeddings in Qdrant Cloud vector database.
- **FR-009**: System MUST use Gemini 2.0 Flash (free tier) as the language model.
- **FR-010**: System MUST provide a FastAPI backend to handle chat requests.
- **FR-011**: System MUST maintain conversation context within a single session.
- **FR-012**: System MUST display loading state while waiting for responses.
- **FR-013**: System MUST handle errors gracefully with user-friendly messages.
- **FR-014**: System MUST include source references in responses when applicable.

### Key Entities

- **Message**: Represents a single message in the conversation (sender: user/bot, content, timestamp, sources)
- **Conversation**: A session-based collection of messages between user and chatbot
- **Document Chunk**: A portion of book content stored as an embedding in the vector database
- **Selected Context**: User-selected text passed to the chatbot for contextual Q&A

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can receive a response to their question within 5 seconds (p95).
- **SC-002**: 90% of questions about book content receive accurate, relevant answers.
- **SC-003**: The chatbot correctly uses selected text context in 95% of selection-based queries.
- **SC-004**: Users can complete a 5-message conversation without errors.
- **SC-005**: The chatbot is accessible and usable on both desktop and mobile devices.
- **SC-006**: System gracefully handles backend unavailability with clear user messaging.

## Technical Stack (Implementation Guidance)

**Note**: This section provides implementation guidance based on user requirements. It is NOT part of the business specification.

- **Frontend**: React component integrated into Docusaurus
- **Backend**: FastAPI (Python)
- **LLM**: Google Gemini 2.0 Flash (free tier)
- **Vector Database**: Qdrant Cloud (free tier)
- **Embeddings**: Google Gemini Embedding API
- **Database**: Neon Serverless Postgres (for future conversation persistence if needed)

## Assumptions

- Users have a stable internet connection to communicate with the backend.
- The book content is in English (primary language support).
- Free tier API limits are sufficient for expected usage volume.
- Session-based conversation history is acceptable (no cross-session persistence required initially).
- The chatbot will be embedded directly in the Docusaurus site, not as a separate application.
