import { BetterAuth } from "better-auth";
import { SQLiteAdapter } from "better-auth/adapters/sqlite";
import { NextRequest } from "next/server";

const adapter = new SQLiteAdapter({
  database: "./better-auth.db",
});

const betterAuth = new BetterAuth(adapter);

export async function GET(req: NextRequest) {
  return betterAuth.handleRequest(req);
}

export async function POST(req: NextRequest) {
  return betterAuth.handleRequest(req);
}
