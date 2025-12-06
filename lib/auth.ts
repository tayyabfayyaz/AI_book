// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma"; // if using Prisma

export const auth = betterAuth({
  // Your configuration
  secret: process.env.AUTH_SECRET!,
  // ... other options
});