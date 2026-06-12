import { hc } from "hono/client";
import { taskAppType } from "../../../../../rpc/appTypes";

const client = hc<taskAppType>("http://localhost:8000");

export async function getTasksById(token: string | null) {
  const res = await client.tasks.$get(
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

export async function getAllTasks(token: string | null) {
  const res = await client.admin. tasks.$get(
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
