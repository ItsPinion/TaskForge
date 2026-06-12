"use client";

export function createSession(token: string) {
  localStorage.setItem("token", token);
}
export function getSession() {
  return localStorage.getItem("token");
}
export function destroySession() {
  localStorage.removeItem("token");
}
