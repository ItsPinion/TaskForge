"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllUsers, getMe } from "../lib/api/auth";
import { getSession } from "../lib/api/session";
import { getAllTasks } from "../lib/api/task";

export default function AdminDashboard() {
  const { data: sessionData } = useQuery({
    queryKey: ["session"],
    queryFn: async () => await getMe(getSession()),
  });

  const { data: tasks } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => await getAllTasks(getSession()),
  });

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: async () => await getAllUsers(getSession()),
  });

  if (sessionData?.role !== "admin") {
    return <div>Unauthorized</div>;
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage users, create tasks, and monitor progress.
        </p>
      </div>

      {/* Top Cards */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Create Task */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <h2 className="mb-6 text-xl font-semibold">Create Task</h2>

          <form className="space-y-4">
            <input
              type="text"
              placeholder="Task Title"
              className="w-full rounded-xl border border-white/10 bg-transparent p-3 outline-none"
            />

            <select className="w-full rounded-xl border border-white/10 bg-transparent p-3 outline-none">
              <option className="bg-black">Select User</option>
              {users &&
                users?.map((user) => (
                  <option key={user.id} value={user.id} className="bg-black">
                    {user.name}
                  </option>
                ))}
            </select>

            <input
              type="date"
              className="w-full rounded-xl border border-white/10 bg-transparent p-3 outline-none"
            />

            <button
              type="submit"
              className="w-full rounded-xl bg-blue-600 py-3 font-medium  transition hover:bg-blue-700"
            >
              Create Task
            </button>
          </form>
        </div>

        {/* Promote User */}
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
      </div>

      {/* Tasks Table */}
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div>
            <h2 className="text-xl font-bold">All Tasks</h2>
            <p className="text-sm text-muted-foreground">
              Tasks across all users
            </p>
          </div>

          <div className="rounded-full bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-500">
            {tasks?.length ?? 0} Tasks
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                  Task
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                  Assigned User
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                  Due Date
                </th>
              </tr>
            </thead>

            <tbody>
              {tasks?.map((task) => (
                <tr
                  key={task.id}
                  className="border-b border-white/5 transition hover:bg-white/5"
                >
                  <td className="px-6 py-5">
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Task #{task.id}
                      </p>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 font-semibold ">
                        {task.assignedTo}
                      </div>

                      <span>{task.assignedTo}</span>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        task.status === "completed"
                          ? "bg-green-500/10 text-green-500"
                          : task.status === "progressing"
                            ? "bg-blue-500/10 text-blue-500"
                            : "bg-yellow-500/10 text-yellow-500"
                      }`}
                    >
                      {task.status}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
