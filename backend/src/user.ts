import { eq } from "drizzle-orm";
import { db } from "./db";
import { usersTable } from "./schema";
import { User } from "./types";

export async function createUser(
  user: Omit<User, "role" | "id" | "createdAt" | "updatedAt">,
) {
  console.log("Creating user:", user);
  await db.insert(usersTable).values(user);
  const [createdUser] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, user.email));
  return createdUser.id;
}

export async function getUsers() {
  return await db.select().from(usersTable);
}

export async function getUserByEmail(email: string) {
  const users = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));
  return users[0];
}

export async function getUserById(id: number) {
  const users = await db.select().from(usersTable).where(eq(usersTable.id, id));
  return users[0];
}

export async function updateUserById(id: number, user: Partial<User>) {
  await db.update(usersTable).set(user).where(eq(usersTable.id, id));
}

export async function deleteUserByEmail(email: string) {
  await db.delete(usersTable).where(eq(usersTable.email, email));
}

export async function deleteUserById(id: number) {
  await db.delete(usersTable).where(eq(usersTable.id, id));
}

export async function deleteAllUsers() {
  await db.delete(usersTable);
}

export async function userExists(email: string) {
  const user = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));
  return user.length > 0;
}
