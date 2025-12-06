"use client";

import React from "react";
import { SessionProvider } from "better-auth/dist/client/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
