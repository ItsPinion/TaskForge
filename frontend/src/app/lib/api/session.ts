"use client";
export function createSession(token: string) {
  sessionStorage.setItem("token", token);
}

export function getSession() {
  return sessionStorage.getItem("token");
}

export function destroySession() {
  sessionStorage.removeItem("token");
}
