"use client";

import { getAllUsers } from "@/app/lib/api/auth";
import { getSession } from "@/app/lib/api/session";
import { useQuery } from "@tanstack/react-query";

export default function Promote() {
  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: async () => await getAllUsers(getSession()),
  });
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <h2 className="mb-6 text-xl font-semibold">User Management</h2>

      <form className="space-y-4">
        <select className="w-full rounded-xl border border-white/10 bg-transparent p-3 outline-none">
          <option className="bg-black">Select User</option>
          {users &&
            users?.map((user) => (
              <option key={user.id} value={user.id} className="bg-black">
                {user.name}
              </option>
            ))}
        </select>

        <button
          type="submit"
          className="w-full rounded-xl bg-purple-600 py-3 font-medium  transition hover:bg-purple-700"
        >
          Promote To Admin
        </button>
      </form>
    </div>
  );
}
