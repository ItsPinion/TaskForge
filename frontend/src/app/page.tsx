"use client";

import { useQuery } from "@tanstack/react-query";
import { getMe } from "./lib/api/auth";
import { destroySession, getSession } from "./lib/api/session";

export default function HomePage() {
  const { data: sessionData, refetch } = useQuery({
    queryKey: ["session"],
    queryFn: async () => await getMe(getSession()),
  });
  console.log("Session Data:", sessionData);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="sticky top-0 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold">TaskForge</h1>

          <div className="flex gap-4 items-center ">
            {sessionData ? (
              <>
                <span>{`Welcome, ${sessionData.name}!`}</span>
                <button
                  className="rounded-lg bg-blue-600 px-4 py-2"
                  onClick={async () => {
                    await destroySession();
                    await refetch();
                  }}
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <a href="/login">Login</a>
                <a
                  href="/register"
                  className="rounded-lg bg-blue-600 px-4 py-2"
                >
                  Get Started
                </a>
              </>
            )}
          </div>
        </div>
      </nav>
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 py-24 text-center">
        <div className="inline-block rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-400">
          Backend Developer Internship Assignment
        </div>

        <h1 className="mt-8 text-5xl font-extrabold">Task Management System</h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
          A secure task management platform built with Hono, Next.js, Drizzle
          ORM, Turso, JWT Authentication, and Role-Based Access Control.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          {sessionData ? (
            <>
              {sessionData.role === "admin" && (
                <a
                  href="/admin"
                  className="rounded-xl bg-red-600 px-8 py-4 font-semibold"
                >
                  Admin Panel
                </a>
              )}

              <a
                href="/tasks"
                className="rounded-xl bg-blue-600 px-8 py-4 font-semibold"
              >
                My Tasks
              </a>
            </>
          ) : (
            <>
              <a
                href="/login"
                className="rounded-xl bg-blue-600 px-8 py-4 font-semibold"
              >
                Login
              </a>

              <a
                href="/register"
                className="rounded-xl border border-slate-700 px-8 py-4"
              >
                Register
              </a>
            </>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="mb-12 text-center text-4xl font-bold">Core Features</h2>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
            <h3 className="text-xl font-semibold">🔐 JWT Authentication</h3>
            <p className="mt-3 text-slate-400">
              Secure registration and login with password hashing and JWT-based
              authentication.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
            <h3 className="text-xl font-semibold">👥 Role Based Access</h3>
            <p className="mt-3 text-slate-400">
              Separate permissions for administrators and standard users.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
            <h3 className="text-xl font-semibold">✅ Task Management</h3>
            <p className="mt-3 text-slate-400">
              Create, view, update, and delete tasks through protected APIs.
            </p>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="mb-12 text-center text-4xl font-bold">
          Technology Stack
        </h2>

        <div className="grid gap-8 text-center md:grid-cols-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="text-2xl font-bold text-blue-400">Hono</h3>
            <p className="text-slate-400">REST API Backend</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="text-2xl font-bold text-blue-400">Next.js</h3>
            <p className="text-slate-400">Frontend</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="text-2xl font-bold text-blue-400">Drizzle ORM</h3>
            <p className="text-slate-400">Database ORM</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="text-2xl font-bold text-blue-400">Turso</h3>
            <p className="text-slate-400">SQLite Database</p>
          </div>
        </div>
      </section>

      {/* Dashboard CTA */}
      <section className="mx-auto max-w-4xl px-6 py-24">
        <div className="rounded-3xl border border-blue-500/20 bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-12 text-center">
          {sessionData ? (
            <>
              <h2 className="text-4xl font-bold">
                Welcome Back, {sessionData.name}
              </h2>

              <p className="mt-4 text-slate-300">
                Logged in as {sessionData.role}.
              </p>

              <div className="mt-8 flex justify-center gap-4">
                <a
                  href="/tasks"
                  className="rounded-xl bg-blue-600 px-8 py-4 font-semibold"
                >
                  Open Tasks
                </a>

                {sessionData.role === "admin" && (
                  <a
                    href="/admin"
                    className="rounded-xl bg-red-600 px-8 py-4 font-semibold"
                  >
                    Admin Panel
                  </a>
                )}
              </div>
            </>
          ) : (
            <>
              <h2 className="text-4xl font-bold">Ready to Get Started?</h2>

              <p className="mt-4 text-slate-300">
                Register or login to access your task dashboard.
              </p>

              <a
                href="/register"
                className="mt-8 inline-block rounded-xl bg-blue-600 px-8 py-4 font-semibold"
              >
                Create Account
              </a>
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 text-center text-slate-500">
        © 2026 NoteFlow. All rights reserved.
      </footer>
    </main>
  );
}
