"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "better-auth/react"; // Assuming useAuth from better-auth/react

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signUp } = useAuth(); // Assuming useAuth provides signUp method

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signUp("email", { email, password });
      // Redirect or show success message
      console.log("Signed up successfully!");
    } catch (error) {
      console.error("Sign-up error:", error);
      // Show error message
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="mx-auto w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Sign Up</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Enter your email below to create your account
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full">
            Sign Up
          </Button>
          <Button variant="outline" className="w-full">
            Sign Up with Google
          </Button>
        </form>
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{" "}
          <Link href="/auth/signin" className="underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
