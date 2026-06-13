"use server";
import { hc } from "hono/client";
import type { userAppType } from "@/../../rpc/appTypes";

const client = hc<userAppType>(process.env.BACKEND || "http://localhost:8000");

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export async function registerUser(data: RegisterPayload) {
  const res = await client.register.$post({
    json: data,
  });

  if (res.ok) {
    const result = await res.json();

    return {
      success: true,
      message: "Account created successfully",
      token: result.token,
    };
  }

  const result = await res.json();
  const errorMessage =
    typeof result === "object" && result !== null && "message" in result
      ? result.message
      : "Registration failed";
  throw new Error(errorMessage);
}

export async function loginUser(data: LoginPayload) {
  const res = await client.login.$post({
    json: data,
  });

  if (res.ok) {
    const result = await res.json();

    return {
      success: true,
      message: "Login successful",
      token: result.token,
    };
  }

  const result = await res.json();
  const errorMessage =
    typeof result === "object" && result !== null && "message" in result
      ? result.message
      : "Registration failed";
  throw new Error(errorMessage);
}

export async function getMe(token: string | null) {
  console.log("TOKEN:", token);

  if (!token) {
    console.log("NO TOKEN");
    return null;
  }

  console.log("SENDING REQUEST");

  const res = await client.me.$get(
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (res.ok) {
    const result = await res.json();

    return result;
  }
  return null;
}

export async function getAllUsers(token: string | null) {
  const res = await client.users.$get(
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (res.ok) {
    const result = await res.json();

    return result;
  }
  return null;
}

export async function promoteUserToAdmin(userId: number, token: string | null) {
  if (userId === 4) {
    throw new Error("Cannot promote this user to admin");
  }
  const res = await client.promote.$post(
    {
      json: {
        userId: userId,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (res.ok) {
    console.log("RESPONSE:", res);
    const result = await res.json();
    console.log("RESULT:", result);
    return result;
  }
}
