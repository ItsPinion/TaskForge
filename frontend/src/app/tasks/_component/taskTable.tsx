"use client";

import { getSession } from "@/app/lib/api/session";
import { getTasksById } from "@/app/lib/api/task";
import { useQuery } from "@tanstack/react-query";

export default function TaskTable() {
  const { data: tasks, isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => await getTasksById(getSession()),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.1)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
        <div>
          <h2 className="text-xl font-bold">Tasks</h2>
          <p className="text-sm text-muted-foreground">
            Manage and track assigned tasks
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
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Task
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Assigned To
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Due Date
              </th>
            </tr>
          </thead>

          <tbody>
            {tasks?.map((task) => (
              <tr
                key={task.id}
                className="group border-b border-white/5 transition-all duration-200 hover:bg-white/5"
              >
                <td className="px-6 py-5">
                  <div>
                    <p className="font-medium group-hover:text-blue-500 transition-colors">
                      {task.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Task #{task.id}
                    </p>
                  </div>
                </td>

                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-sm font-bold text-white">
                      {task.assignedTo?.charAt(0).toUpperCase()}
                    </div>

                    <span className="font-medium">{task.assignedTo}</span>
                  </div>
                </td>

                <td className="px-6 py-5">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                      task.status === "completed"
                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                        : task.status === "progressing"
                          ? "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                          : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                    }`}
                  >
                    <span className="h-2 w-2 rounded-full bg-current" />
                    {task.status}
                  </span>
                </td>

                <td className="px-6 py-5">
                  <span className="rounded-lg bg-white/5 px-3 py-2 text-sm">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                </td>
              </tr>
            ))}

            {!tasks?.length && (
              <tr>
                <td colSpan={4} className="py-20 text-center">
                  <div className="space-y-2">
                    <div className="text-5xl">📋</div>
                    <h3 className="font-semibold">No Tasks Found</h3>
                    <p className="text-sm text-muted-foreground">
                      Tasks will appear here once they are assigned.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
