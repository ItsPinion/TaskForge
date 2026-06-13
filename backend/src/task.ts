import { eq } from "drizzle-orm";
import { db } from "./db";
import { taskTable, usersTable } from "./schema";
import { Task } from "./types";

export async function createTask(
  task: Omit<Task, "id" | "createdAt" | "updatedAt" | "status">,
) {
  console.log("Creating task:", task);
  await db.insert(taskTable).values(task);
  const [createdTask] = await db
    .select()
    .from(taskTable)
    .where(eq(taskTable.title, task.title));
  return createdTask;
}

export async function getTasks() {
  return await db.select().from(taskTable);
}

export async function getTaskById(id: number) {
  const tasks = await db.select().from(taskTable).where(eq(taskTable.id, id));
  return tasks[0];
}

export async function updateTaskById(id: number, task: Partial<Task>) {
  await db.update(taskTable).set(task).where(eq(taskTable.id, id));
}

export async function deleteTaskById(id: number) {
  await db.delete(taskTable).where(eq(taskTable.id, id));
}

export async function deleteAllTasks() {
  await db.delete(taskTable);
}

export async function getTasksByStatus(
  status: "progressing" | "pending" | "completed",
) {
  const tasks = await db
    .select()
    .from(taskTable)
    .where(eq(taskTable.status, status));
  return tasks;
}

export async function getTasksByDueDate(dueDate: string) {
  const tasks = await db
    .select()
    .from(taskTable)
    .where(eq(taskTable.dueDate, dueDate));
  return tasks;
}

export async function getTasksByUserId(userId: number) {
  const tasks = await db
    .select()
    .from(taskTable)
    .where(eq(taskTable.userId, userId));
  return tasks;
}

export async function geTasksByIdWithUser(id: number) {
  return await db
    .select({
      id: taskTable.id,
      title: taskTable.title,
      status: taskTable.status,
      dueDate: taskTable.dueDate,
      assignedTo: usersTable.name,
      userId: usersTable.id,
    })
    .from(taskTable)
    .leftJoin(usersTable, eq(taskTable.userId, usersTable.id))
    .where(eq(taskTable.userId, id));
}

export async function getAllTasksWithUsers() {
  return await db
    .select({
      id: taskTable.id,
      title: taskTable.title,
      status: taskTable.status,
      dueDate: taskTable.dueDate,
      assignedTo: usersTable.name,
      userId: usersTable.id,
    })
    .from(taskTable)
    .leftJoin(usersTable, eq(taskTable.userId, usersTable.id));
}
