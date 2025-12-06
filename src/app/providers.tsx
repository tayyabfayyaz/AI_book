"use client";

import React from "react";
import { SessionProvider } from "better-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
