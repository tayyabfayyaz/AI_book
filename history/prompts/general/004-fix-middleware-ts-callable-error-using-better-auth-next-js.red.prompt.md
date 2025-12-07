---
id: 004
title: "Fix middleware.ts callable error using better-auth/next-js"
stage: red
date: 2025-12-07
surface: agent
model: claude-3-5-sonnet
feature: none
branch: main
user:
command: you fix error inthe middleware file error: "This expression is not callable. Type 'Auth<{ secret: string; }>' has no call signatures.ts(2349)
(alias) const auth: Auth<{
    secret: string;
}>
import auth"
labels: ["bugfix", "middleware", "better-auth", "typescript"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml:
  - src/middleware.ts
tests_yaml: []
---

### Prompt Text
```
you fix error inthe middleware file error: "This expression is not callable.
  Type 'Auth<{ secret: string; }>' has no call signatures.ts(2349)
(alias) const auth: Auth<{
    secret: string;
}>
import auth"
```

### Response Text
Fixed the `TypeError: Type 'Auth<...>' has no call signatures` in `src/middleware.ts`. The `auth` object imported from `@/lib/auth` is an instance of `Auth`, not a callable middleware function. Consulted `better-auth`'s `package.json` to find `better-auth/next-js` export, which provides `withAuthMiddleware`. Modified `middleware.ts` to use `withAuthMiddleware(auth, { ... })(req)` to correctly create and invoke the Next.js middleware.

### Outcome
The `middleware.ts` file should now correctly utilize the `better-auth` instance to create and run the authentication middleware, resolving the TypeScript error.
