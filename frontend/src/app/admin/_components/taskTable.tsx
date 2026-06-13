"use client";

import { getSession } from "@/app/lib/api/session";
import { getAllTasks } from "@/app/lib/api/task";
import { useQuery } from "@tanstack/react-query";

export default function TaskTable() {
  const { data: tasks } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => await getAllTasks(getSession()),
  });

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
      <div className="flex flex-col gap-4 border-b border-white/10 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-xl font-bold text-white">All Tasks</h2>
          <p className="text-sm text-white/60">Tasks across all users</p>
        </div>

        <div className="w-fit rounded-full bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-400">
          {tasks?.length ?? 0} Tasks
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] table-fixed">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.03]">
              <th className="w-[35%] px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white/70">
                Task
              </th>

              <th className="w-[30%] px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white/70">
                Assigned User
              </th>

              <th className="w-[15%] px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white/70">
                Status
              </th>

              <th className="w-[20%] px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white/70">
                Due Date
              </th>
            </tr>
          </thead>

          <tbody>
            {tasks?.map((task, index) => (
              <tr
                key={task.id}
                className={`border-b border-white/5 transition-colors duration-200 hover:bg-white/5 ${
                  index % 2 === 0 ? "bg-transparent" : "bg-white/[0.02]"
                }`}
              >
                <td className="px-6 py-5">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-white">
                      {task.title}
                    </p>

                    <p className="mt-1 text-xs text-white/50">
                      Task #{task.id}
                    </p>
                  </div>
                </td>

                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-sm font-semibold text-white shadow-lg">
                      {task.assignedTo?.charAt(0).toUpperCase()}
                    </div>

                    <span className="truncate text-white">
                      {task.assignedTo}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-5">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${
                      task.status === "completed"
                        ? "bg-green-500/15 text-green-400"
                        : task.status === "progressing"
                          ? "bg-blue-500/15 text-blue-400"
                          : "bg-yellow-500/15 text-yellow-400"
                    }`}
                  >
                    {task.status}
                  </span>
                </td>

                <td className="whitespace-nowrap px-6 py-5 text-white/80">
                  {new Date(task.dueDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
