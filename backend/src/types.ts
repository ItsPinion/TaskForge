import { taskTable, usersTable } from "./schema";

export type User = typeof usersTable.$inferSelect;

export type Task = typeof taskTable.$inferSelect;
