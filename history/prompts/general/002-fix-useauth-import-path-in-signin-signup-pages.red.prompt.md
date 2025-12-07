---
id: 002
title: "Fix useAuth import path in signin/signup pages"
stage: red
date: 2025-12-07
surface: agent
model: claude-3-5-sonnet
feature: none
branch: main
user:
command: Fix the error
labels: ["bugfix", "authentication", "better-auth"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml:
  - src/app/auth/signin/page.tsx
  - src/app/auth/signup/page.tsx
tests_yaml: []
---

### Prompt Text
```
error: "

1 of 1 error
Next.js (14.2.33) is outdated (learn more)

Unhandled Runtime Error
TypeError: (0 , better_auth_react__WEBPACK_IMPORTED_MODULE_6__.useAuth) is not a function

Source
src\app\auth\signin\page.tsx (13:29) @ useAuth

  11 |   const [email, setEmail] = useState("");
  12 |   const [password, setPassword] = useState("");
> 13 |   const { signIn } = useAuth(); // Assuming useAuth provides signIn method
     |                             ^
  14 |
  15 |   const handleSubmit = async (e: React.FormEvent) => {
  16 |     e.preventDefault();
Call Stack
Show collapsed frames" code line: "import { useAuth } from "better-auth/client";" in the directory of auth/signinpage.tsx Now fix the error.
```

### Response Text
Identified that the `useAuth` hook from the `better-auth` library was being imported incorrectly from `better-auth/client`. The `package.json` for `better-auth` revealed that React-specific client-side hooks are exposed via `better-auth/react`. Corrected the import path in both `src/app/auth/signin/page.tsx` and `src/app/auth/signup/page.tsx` to `import { useAuth } from "better-auth/react";`.

### Outcome
The `TypeError: useAuth is not a function` should now be resolved, allowing the authentication pages to function correctly.
