import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

// Provide minimal process.env typing for TypeScript in this single-file project
declare const process: {
  env: {
    TURSO_DATABASE_URL?: string;
    TURSO_AUTH_TOKEN?: string;
    [key: string]: string | undefined;
  };
};

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});
export const db = drizzle({ client });
