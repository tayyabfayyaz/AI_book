import { BetterAuth } from "better-auth";
import { SQLiteAdapter } from "better-auth/adapters/sqlite";
import { EmailProvider } from "better-auth/providers/email";
import { GoogleProvider } from "better-auth/providers/google";
import { authMiddleware } from "better-auth/next-js"; // Correct import for Next.js middleware

const adapter = new SQLiteAdapter({
  database: "./better-auth.db",
});

const betterAuth = new BetterAuth(adapter, {
  secret: process.env.AUTH_SECRET || "YOUR_AUTH_SECRET", // IMPORTANT: Change this in production
  providers: [
    new EmailProvider(),
    new GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID", // IMPORTANT: Change this in production
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "YOUR_GOOGLE_CLIENT_SECRET", // IMPORTANT: Change this in production
      redirectUri: "http://localhost:3000/api/auth/callback/google", // Adjust for production
    }),
  ],
});

export const { auth } = authMiddleware(betterAuth); // Export the auth middleware
