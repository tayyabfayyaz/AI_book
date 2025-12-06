"use client";

import React from "react";
import { SessionProvider } from "better-auth/react";

console.log(BetterAuthReact); // Log the entire module to the console

export function Providers({ children }: { children: React.ReactNode }) {
  // For now, just return children to avoid the error and inspect the log.
  return <>{children}</>;
}
