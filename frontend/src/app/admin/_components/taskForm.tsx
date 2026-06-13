"use client";

import { getAllUsers } from "@/app/lib/api/auth";
import { getSession } from "@/app/lib/api/session";
import { createTask } from "@/app/lib/api/task";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";

export default function TaskForm() {
  const dateRef = useRef<HTMLInputElement>(null);

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: async () => await getAllUsers(getSession()),
  });

  const [taskForm, setTaskForm] = useState({
    title: "",
    userId: 0,
    dueDate: new Date(),
  });

  const {
    mutate,
    data: task,
    isPending,
    isSuccess,
    isError,
    error,
  } = useMutation({
    mutationFn: async (task: typeof taskForm) => {
      return await createTask(task, getSession());
    },
    onSuccess: () => {
      setTaskForm({
        title: "",
        userId: 0,
        dueDate: new Date(),
      });
    },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    mutate(taskForm);
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <h2 className="mb-6 text-xl font-semibold">Create Task</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Task Title"
          value={taskForm.title}
          onChange={(e) =>
            setTaskForm((prev) => ({
              ...prev,
              title: e.target.value,
            }))
          }
          className="w-full rounded-xl border border-white/10 bg-transparent p-3 outline-none"
        />

        <select
          value={taskForm.userId}
          onChange={(e) =>
            setTaskForm((prev) => ({
              ...prev,
              userId: Number(e.target.value),
            }))
          }
          className="w-full rounded-xl border border-white/10 bg-transparent p-3 outline-none"
        >
          <option value={0} className="bg-black">
            Select User
          </option>

          {users?.map((user) => (
            <option key={user.id} value={user.id} className="bg-black">
              {user.name}
            </option>
          ))}
        </select>

        {/* Date Picker */}
        <div
          onClick={() => dateRef.current?.showPicker?.()}
          className="cursor-pointer"
        >
          <input
            ref={dateRef}
            type="date"
            value={taskForm.dueDate.toISOString().split("T")[0]}
            onFocus={() => dateRef.current?.showPicker?.()}
            onChange={(e) =>
              setTaskForm((prev) => ({
                ...prev,
                dueDate: new Date(e.target.value),
              }))
            }
            className="w-full rounded-xl border border-white/10 bg-transparent p-3 outline-none"
          />
        </div>

        {isSuccess && (
          <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-3 text-green-400">
            Task created successfully.
          </div>
        )}

        {isError && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-red-400">
            {error instanceof Error ? error.message : "Failed to create task."}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-blue-600 py-3 font-medium transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Creating..." : "Create Task"}
        </button>
      </form>

      {task && (
        <pre className="mt-4 overflow-auto rounded-xl bg-black/20 p-3 text-sm">
          {JSON.stringify(task, null, 2)}
        </pre>
      )}
    </div>
  );
}
