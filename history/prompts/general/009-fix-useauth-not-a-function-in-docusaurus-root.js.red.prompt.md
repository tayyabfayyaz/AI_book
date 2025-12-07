---
id: 009
title: Fix useAuth/useSession not found in Docusaurus Root.js
stage: red
date: 2025-12-07
surface: agent
model: claude-3-opus
feature: Docusaurus Integration
branch: main
user: user
command: "Fix the Docusaurus better-auth error"
labels: ["bugfix", "docusaurus", "authentication"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml:
  - book/src/theme/Root.js
tests_yaml: []
prompt_text: |
  This message shows on the main page of docusaurus web "(0 , better_auth_client__WEBPACK_IMPORTED_MODULE_2__.useAuth) is not a function". Now you fix this error. procces step by step and write the reuseable Intelligence components if needed.
response_text: |
  Identified initial error stemmed from `book/src/theme/Root.js` attempting to import `useAuth` from `better-auth/client`.
  First attempted fix: Modified `book/src/theme/Root.js` to use `useSession` based on assumption, but this resulted in `export 'useSession' not found` warning.
  Second (current) fix:
  1. Replaced `import { useSession } from 'better-auth/client';` with `import { useAuthQuery } from 'better-auth/client';`.
  2. Adjusted the authentication logic from `const { data: session, status } = useSession();` to use `const { data, isLoading } = useAuthQuery();` and derive `isAuthenticated` as `!!data && !isLoading;`.
  Verification by running the Docusaurus server (`npm start` in `book` directory) is pending user confirmation.
---