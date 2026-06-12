"use client";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { registerUser } from "../lib/api/auth";
import { createSession } from "../lib/api/session";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const router = useRouter();

  const { mutate, isPending, isSuccess, error, isError, data } = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      createSession(data.token);
      router.push("/");
    },
  });

  const passwordsMatch = form.password === form.confirmPassword;

  const showPasswordError = form.confirmPassword.length > 0 && !passwordsMatch;

  const handleRegister = (event: SubmitEvent) => {
    event.preventDefault();

    if (!passwordsMatch) {
      console.error("Passwords do not match");
      return;
    }

    mutate({
      name: form.name,
      email: form.email,
      password: form.password,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-950 via-slate-900 to-black p-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
        <h1 className="text-3xl font-bold text-white">Create Account</h1>

        <p className="mt-2 text-slate-400">Join us today</p>

        <form
          className="mt-8 space-y-4"
          onSubmit={(e) => handleRegister(e.nativeEvent)}
        >
          <input
            type="text"
            id="name"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
            className="w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-3 text-white outline-none transition focus:border-indigo-500"
          />
          <input
            type="email"
            id="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                email: e.target.value,
              }))
            }
            className="w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-3 text-white outline-none transition focus:border-indigo-500"
          />
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                password: e.target.value,
              }))
            }
            className={`w-full rounded-xl border bg-slate-900/50 px-4 py-3 text-white outline-none transition ${
              showPasswordError
                ? "border-red-500 focus:border-red-500"
                : "border-slate-700 focus:border-indigo-500"
            }`}
          />
          <input
            type="password"
            id="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                confirmPassword: e.target.value,
              }))
            }
            className={`w-full rounded-xl border bg-slate-900/50 px-4 py-3 text-white outline-none transition ${
              showPasswordError
                ? "border-red-500 focus:border-red-500"
                : "border-slate-700 focus:border-indigo-500"
            }`}
          />
          {showPasswordError && (
            <p className="text-sm font-medium text-red-400">
              Passwords do not match
            </p>
          )}
          {isSuccess && (
            <p className="text-sm font-medium text-green-400">{data.message}</p>
          )}
          {isError && (
            <p className="text-sm font-medium text-red-400">{error.message}</p>
          )}
          <button
            type="submit"
            disabled={isPending || showPasswordError}
            className="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-slate-400">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-medium text-indigo-400 hover:text-indigo-300"
          >
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}
