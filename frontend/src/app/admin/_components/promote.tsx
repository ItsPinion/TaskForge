"use client";

import { getAllUsers, promoteUserToAdmin } from "@/app/lib/api/auth";
import { getSession } from "@/app/lib/api/session";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function Promote() {
  const queryClient = useQueryClient();

  const [selectedUserId, setSelectedUserId] = useState(0);

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: async () => await getAllUsers(getSession()),
  });

  const { mutate, isPending, isSuccess, isError, error, data } = useMutation({
    mutationFn: async (userId: number) => {
      return await promoteUserToAdmin(userId, getSession());
    },

    onSuccess: () => {
      setSelectedUserId(0);

      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!selectedUserId) return;

    mutate(selectedUserId);
  }

  const promotableUsers = users?.filter((user) => user.role === "user") ?? [];

  return (
    <div className="rounded-3xl border border-white/10 bg-linear-to-br from-white/10 to-white/5 p-6 backdrop-blur-xl">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Promote User</h2>
        <p className="mt-1 text-sm text-white/60">
          Upgrade a user account to administrator privileges.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(Number(e.target.value))}
          className="w-full rounded-xl border border-white/10 bg-black/20 p-3 outline-none transition focus:border-purple-500"
        >
          <option value={0} className="bg-black">
            Select User
          </option>

          {promotableUsers.map((user) => (
            <option key={user.id} value={user.id} className="bg-black">
              {user.name} ({user.email})
            </option>
          ))}
        </select>

        {promotableUsers.length === 0 && (
          <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-3 text-sm text-yellow-400">
            No users available for promotion.
          </div>
        )}

        {isSuccess && (
          <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-3 text-green-400">
            User promoted successfully.
          </div>
        )}

        {isError && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-red-400">
            {error instanceof Error ? error.message : "Failed to promote user."}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending || selectedUserId === 0}
          className="w-full rounded-xl bg-purple-600 py-3 font-medium transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Promoting..." : "Promote To Admin"}
        </button>
      </form>

      {data && (
        <pre className="mt-4 overflow-auto rounded-xl bg-black/20 p-3 text-sm">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}
