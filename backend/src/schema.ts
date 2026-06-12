import { sql } from "drizzle-orm";
import { int, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users_table", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  email: text().notNull().unique(),
  role: text({ enum: ["admin", "user"] })
    .notNull()
    .default("user"),
  password: text().notNull(),
  createdAt: text("timestamp")
    .notNull()
    .default(sql`(current_timestamp)`),
  updatedAt: text("timestamp")
    .notNull()
    .default(sql`(current_timestamp)`),
});

export const taskTable = sqliteTable("task_table", {
  id: int().primaryKey({ autoIncrement: true }),
  title: text().notNull(),
  userId: integer().references(() => usersTable.id),
  status: text({ enum: ["progressing", "pending", "completed"] })
    .notNull()
    .default("pending"),
  createdAt: text("timestamp")
    .notNull()
    .default(sql`(current_timestamp)`),
  updatedAt: text("timestamp")
    .notNull()
    .default(sql`(current_timestamp)`),
  dueDate: text("timestamp").notNull(),
});
