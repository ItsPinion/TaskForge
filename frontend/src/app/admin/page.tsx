"use client";

import { useQuery } from "@tanstack/react-query";
import { getMe } from "../lib/api/auth";
import { getSession } from "../lib/api/session";
import TaskForm from "./_components/taskForm";
import Promote from "./_components/promote";
import TaskTable from "./_components/taskTable";

export default function AdminDashboard() {
  const { data: sessionData } = useQuery({
    queryKey: ["session"],
    queryFn: async () => await getMe(getSession()),
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

      <div className="grid gap-6 lg:grid-cols-2">
        <TaskForm />
        <Promote />
      </div>

      {/* Tasks Table */}
      <TaskTable />
    </div>
  );
}
