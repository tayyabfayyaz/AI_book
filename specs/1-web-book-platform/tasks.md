# Tasks: Web Book Platform

**Input**: Design documents from `/specs/1-web-book-platform/`
**Prerequisites**: plan.md (required), spec.md (required for user stories)

**Tests**: Not explicitly requested - test tasks omitted unless required.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Docusaurus project**: `docs/`, `src/components/`, `docusaurus.config.ts`
- **Chatbot backend**: `chatbot/backend/`
- **Chatbot frontend**: `src/components/Chatbot/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and verification of existing structure

- [ ] T001 Verify Docusaurus project builds successfully with `npm run build`
- [ ] T002 [P] Configure environment variables template in `.env.example`
- [ ] T003 [P] Verify TailwindCSS is properly configured in `tailwind.config.js`
- [ ] T004 [P] Verify ShadCN components are properly installed in project

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T005 Configure Algolia search with proper credentials in `docusaurus.config.ts:146-152`
- [ ] T006 [P] Update GitHub repository links in `docusaurus.config.ts:95-98` and footer
- [ ] T007 [P] Add proper logo and favicon assets in `static/img/`
- [ ] T008 Setup CORS configuration in `chatbot/backend/main.py` for production deployment
- [ ] T009 Configure GitHub Actions workflow for deployment in `.github/workflows/deploy.yml`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View Landing Page (Priority: P1) 🎯 MVP

**Goal**: Professional landing page with hero section, navbar, and footer for first impressions

**Independent Test**: Visit the root URL and see the landing page with hero section, navbar with logo/search/auth buttons/theme toggle, and footer with logo/social links/quick links/copyright.

### Implementation for User Story 1

- [ ] T010 [P] [US1] Update navbar in `docusaurus.config.ts:81-99` to add search bar with icon styling
- [ ] T011 [P] [US1] Add Sign Up and Sign In button placeholders in navbar items in `docusaurus.config.ts:87-99`
- [ ] T012 [P] [US1] Add theme toggle button to navbar (verify colorMode config in `docusaurus.config.ts:78-80`)
- [ ] T013 [US1] Create custom Hero section component in `src/components/HeroSection/index.tsx`
- [ ] T014 [US1] Style Hero section with left-side image and right-side headings/text/"Read Book" button in `src/components/HeroSection/styles.module.css`
- [ ] T015 [US1] Integrate Hero section into landing page in `src/pages/index.tsx`
- [ ] T016 [P] [US1] Update footer with proper logo in `docusaurus.config.ts:101-141`
- [ ] T017 [P] [US1] Add social media links (Twitter, Discord, GitHub) to footer in `docusaurus.config.ts:114-128`
- [ ] T018 [US1] Update HomepageFeatures component to showcase book features in `src/components/HomepageFeatures/index.tsx`

**Checkpoint**: At this point, User Story 1 should be fully functional - landing page displays with all components

---

## Phase 4: User Story 2 - Read the Book (Priority: P1) 🎯 MVP

**Goal**: Users can navigate and read book content with proper sidebar structure

**Independent Test**: Click "Read Book" button, navigate to book content, see left sidebar with modules/chapters/topics, click on topic to view content, see right sidebar with table of contents.

### Implementation for User Story 2

- [ ] T019 [US2] Create proper module structure in sidebar config in `sidebars.ts`
- [ ] T020 [P] [US2] Add chapter sub-items under each module category in `sidebars.ts`
- [ ] T021 [P] [US2] Create additional topic pages under `docs/module-1/` as needed
- [ ] T022 [P] [US2] Create additional topic pages under `docs/module-2/` as needed
- [ ] T023 [P] [US2] Create additional topic pages under `docs/module-3/` as needed
- [ ] T024 [P] [US2] Create additional topic pages under `docs/module-4/` as needed
- [ ] T025 [US2] Configure table of contents (TOC) for right sidebar in `docusaurus.config.ts` (verify docs preset settings)
- [ ] T026 [US2] Link "Read Book" button in Hero section to `/docs/intro` or first module in `src/components/HeroSection/index.tsx`
- [ ] T027 [US2] Style sidebar navigation for better UX in `src/css/custom.css`

**Checkpoint**: At this point, User Story 2 should be fully functional - users can navigate and read book content

---

## Phase 5: User Story 3 - User Authentication (Priority: P2)

**Goal**: Users can sign up and sign in for personalized experience using better-auth

**Independent Test**: Click Sign Up button, see sign-up form; click Sign In button, see sign-in form; after signing in, see user avatar/name in navbar.

### Implementation for User Story 3

- [ ] T028 [US3] Install and configure better-auth package in `package.json`
- [ ] T029 [US3] Create auth configuration file in `src/lib/auth.ts`
- [ ] T030 [P] [US3] Create SignUp component in `src/components/Auth/SignUp.tsx`
- [ ] T031 [P] [US3] Create SignIn component in `src/components/Auth/SignIn.tsx`
- [ ] T032 [US3] Create auth modal wrapper component in `src/components/Auth/AuthModal.tsx`
- [ ] T033 [US3] Create UserAvatar component for navbar in `src/components/Auth/UserAvatar.tsx`
- [ ] T034 [US3] Integrate auth buttons and user state into navbar via custom theme component in `src/theme/Navbar/`
- [ ] T035 [US3] Create auth context/provider for managing user state in `src/contexts/AuthContext.tsx`
- [ ] T036 [US3] Add auth routes/pages if needed for OAuth callbacks in `src/pages/auth/`

**Checkpoint**: At this point, User Story 3 should be fully functional - users can authenticate

---

## Phase 6: User Story 4 - Chat with the Book (Priority: P1) 🎯 MVP

**Goal**: RAG chatbot to answer questions about book content

**Independent Test**: Click chatbot icon on any page, chat interface opens, type a question about book content, receive relevant answer.

### Implementation for User Story 4

- [ ] T037 [US4] Complete chatbot backend with proper error handling in `chatbot/backend/main.py`
- [ ] T038 [P] [US4] Add CORS middleware for frontend integration in `chatbot/backend/main.py`
- [ ] T039 [P] [US4] Create startup script for backend in `chatbot/backend/start.sh`
- [ ] T040 [US4] Enhance Chatbot component UI with better styling in `src/components/Chatbot/index.tsx`
- [ ] T041 [US4] Add loading states and error messages to Chatbot in `src/components/Chatbot/index.tsx`
- [ ] T042 [US4] Update Chatbot styles for better visual integration in `src/components/Chatbot/styles.module.css`
- [ ] T043 [US4] Add selected text context feature - detect text selection in `src/client-modules/chatbot.ts`
- [ ] T044 [US4] Pass selected text context to chatbot when opening in `src/components/Chatbot/index.tsx`
- [ ] T045 [P] [US4] Add chatbot backend requirements documentation in `chatbot/backend/README.md`
- [ ] T046 [US4] Configure environment variables for Qdrant and API keys in `.env.example`

**Checkpoint**: At this point, User Story 4 should be fully functional - chatbot answers questions about book content

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T047 [P] Ensure responsive design for mobile devices in `src/css/custom.css`
- [ ] T048 [P] Optimize images and assets in `static/img/` for page load performance
- [ ] T049 [P] Add meta tags for SEO in `docusaurus.config.ts`
- [ ] T050 Verify GitHub Pages deployment works end-to-end
- [ ] T051 [P] Create project README with setup instructions in `README.md`
- [ ] T052 Run Lighthouse audit and address any performance issues
- [ ] T053 Verify all links are working (no broken links)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - US1 (Landing Page), US2 (Read Book), US4 (Chatbot) are P1 - prioritize for MVP
  - US3 (Authentication) is P2 - can be added after MVP
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational - Links from US1 hero section but independently testable
- **User Story 3 (P2)**: Can start after Foundational - Independent of other stories
- **User Story 4 (P1)**: Can start after Foundational - Uses docs content but independently testable

### Within Each User Story

- Models/configs before services
- Services before UI components
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- Tasks within same story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch parallel navbar/footer tasks:
Task: "T010 [P] [US1] Update navbar in docusaurus.config.ts"
Task: "T011 [P] [US1] Add Sign Up and Sign In button placeholders"
Task: "T012 [P] [US1] Add theme toggle button to navbar"
Task: "T016 [P] [US1] Update footer with proper logo"
Task: "T017 [P] [US1] Add social media links to footer"
```

## Parallel Example: User Story 4

```bash
# Launch parallel backend tasks:
Task: "T038 [P] [US4] Add CORS middleware"
Task: "T039 [P] [US4] Create startup script for backend"
Task: "T045 [P] [US4] Add chatbot backend requirements documentation"
```

---

## Implementation Strategy

### MVP First (User Stories 1, 2, 4)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Landing Page)
4. Complete Phase 4: User Story 2 (Read Book)
5. Complete Phase 6: User Story 4 (Chatbot)
6. **STOP and VALIDATE**: Test all P1 stories independently
7. Deploy to GitHub Pages

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy (Landing page visible)
3. Add User Story 2 → Test independently → Deploy (Book readable)
4. Add User Story 4 → Test independently → Deploy (Chatbot functional - MVP Complete!)
5. Add User Story 3 → Test independently → Deploy (Auth enabled)
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Landing Page)
   - Developer B: User Story 2 (Book Navigation)
   - Developer C: User Story 4 (Chatbot)
3. Stories complete and integrate independently
4. Developer D: User Story 3 (Auth) in parallel or after MVP

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- **Existing work**: Project already has Docusaurus setup, basic chatbot component, and some module pages

---

## Summary

| Phase | Task Count | Parallel Tasks |
|-------|------------|----------------|
| Setup | 4 | 3 |
| Foundational | 5 | 2 |
| US1 - Landing Page | 9 | 5 |
| US2 - Read Book | 9 | 4 |
| US3 - Authentication | 9 | 2 |
| US4 - Chatbot | 10 | 4 |
| Polish | 7 | 4 |
| **Total** | **53** | **24** |

**MVP Scope**: Phases 1-2 + User Stories 1, 2, 4 (32 tasks)
**Full Scope**: All phases (53 tasks)
