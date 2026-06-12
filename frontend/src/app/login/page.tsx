"use client";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { LoginPayload, loginUser } from "../lib/api/auth";
import { createSession } from "../lib/api/session";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const [password, setPassword] = useState("");

  const { mutate, isPending, isSuccess, error, isError } = useMutation({
    mutationFn: (data: LoginPayload) => loginUser(data),
    onSuccess: (data) => {
      createSession(data.token);
      router.push("/");
    },
  });

  const handleLogin = (event: SubmitEvent) => {
    event.preventDefault();

    mutate({
      email,
      password,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
        <h1 className="text-3xl font-bold text-white">Welcome Back</h1>

        <p className="mt-2 text-slate-400">Sign in to continue</p>

        <form
          className="mt-8 space-y-4"
          onSubmit={(e) => handleLogin(e.nativeEvent)}
        >
          <input
            type="email"
            placeholder="Email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-3 text-white outline-none focus:border-blue-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-3 text-white outline-none focus:border-blue-500"
          />

          {isSuccess && (
            <p className="text-sm text-green-400">Login successful</p>
          )}
          {isError && <p className="text-sm text-red-400">{error.message}</p>}

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "Signing In..." : "Sign In"}
          </button>
        </form>
        <p className="mt-6 text-center text-slate-400">
          Don{"'"}t have an account?{" "}
          <a
            href="/register"
            className="font-medium text-indigo-400 hover:text-indigo-300"
          >
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
