import { Hono } from "hono";
import { cors } from "hono/cors";
import { timing } from "hono/timing";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { secureHeaders } from "hono/secure-headers";
import { compress } from "hono/compress";
import {
  createUser,
  getUserByEmail,
  getUsers,
  promoteUserToAdmin,
  userExists,
} from "./user";
import z from "zod";
import { zValidator } from "@hono/zod-validator";
import { comparePassword, hashPassword } from "./utils/password";
import { generateToken, verifyToken } from "./utils/auth";
import { createTask, getAllTasksWithUsers, geTasksByIdWithUser } from "./task";

const app = new Hono()
  .use("*", compress())
  .use("*", cors())
  .use("*", timing())
  .use("*", logger())
  .use("*", prettyJSON())
  .use("*", secureHeaders());

export const userRoute = app
  .get("/users", async (c) => {
    const authHeader = c.req.header("Authorization");
    if (!authHeader) {
      return c.json({ message: "Unauthorized" }, 401);
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return c.json({ message: "Unauthorized" }, 401);
    }

    try {
      const user = verifyToken(token);
      console.log("USER:", user);
      if (user.role !== "admin") {
        console.log("NOT ADMIN");
        return c.json({ message: "Unauthorized" }, 401);
      }
    } catch {
      return c.json({ message: "Unauthorized" }, 401);
    }

    try {
      console.log("GETTING USERS");
      const users = await getUsers();
      console.log("USERS:", users);
      console.log(users);
      return c.json(users);
    } catch (error) {
      return c.json(
        { success: false, message: "Failed to access the database" },
        500,
      );
    }
  })
  .post(
    "/register",
    zValidator(
      "json",
      z.object({
        name: z.string().min(1, "Name is required"),
        email: z.email(),
        password: z.string().min(6, "Password must be at least 6 characters"),
      }),
    ),
    async (c) => {
      const user = c.req.valid("json");

      if (await userExists(user.email)) {
        return c.json(
          {
            success: false,
            message: "User with this email already exists",
          },
          400,
        );
      }

      try {
        const hashedPassword = await hashPassword(user.password);

        const ID = await createUser({
          ...user,
          password: hashedPassword,
        });

        const token = generateToken(ID, user.name, user.email, "user");

        return c.json({
          success: true,
          message: "User registered successfully",
          token,
        });
      } catch {
        return c.json(
          {
            success: false,
            message: "Failed to register user",
          },
          500,
        );
      }
    },
  )
  .post(
    "/login",
    zValidator(
      "json",
      z.object({
        email: z.email(),
        password: z.string(),
      }),
    ),
    async (c) => {
      const req = c.req.valid("json");

      try {
        const userAlreadyExists = await userExists(req.email);

        if (!userAlreadyExists) {
          return c.json(
            {
              success: false,
              message: "User with this email does not exist",
            },
            400,
          );
        }

        const user = await getUserByEmail(req.email);

        if (!(await comparePassword(req.password, user.password))) {
          return c.json(
            {
              success: false,
              message: "Incorrect password",
            },
            400,
          );
        }

        const token = generateToken(user.id, user.name, user.email, user.role);

        return c.json({
          success: true,
          message: "Login successful",
          token,
        });
      } catch {
        return c.json(
          {
            success: false,
            message: "Failed to access the database",
          },
          500,
        );
      }
    },
  )
  .get("/me", async (c) => {
    const authHeader = c.req.header("Authorization");

    if (!authHeader) {
      return c.json({ message: "Unauthorized" }, 401);
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return c.json({ message: "Unauthorized" }, 401);
    }

    try {
      const user = verifyToken(token);

      return c.json(user);
    } catch {
      return c.json({ message: "Unauthorized" }, 401);
    }
  })
  .post(
    "/promote",
    zValidator(
      "json",
      z.object({
        userId: z.number().int(),
      }),
    ),
    async (c) => {
      const req = c.req.valid("json");
      if (req.userId === 4) {
        return c.json({ message: "Cannot promote this user to admin" }, 400);
      }

      const authHeader = c.req.header("Authorization");

      if (!authHeader) {
        return c.json({ message: "Unauthorized" }, 401);
      }

      const token = authHeader.split(" ")[1];

      if (!token) {
        return c.json({ message: "Unauthorized" }, 401);
      }

      try {
        const user = verifyToken(token);

        if (user.role !== "admin") {
          return c.json({ message: "Unauthorized" }, 401);
        }

        try {
          const user = await promoteUserToAdmin(req.userId);

          return c.json(user);
        } catch (error) {
          return c.json(
            {
              success: false,
              message: "Failed to promote user",
            },
            500,
          );
        }
      } catch {
        return c.json({ message: "Unauthorized" }, 401);
      }
    },
  );

export const taskRoute = app
  .get(
    "/tasks",

    async (c) => {
      const authHeader = c.req.header("Authorization");

      if (!authHeader) {
        return c.json({ message: "Unauthorized" }, 401);
      }

      const token = authHeader.split(" ")[1];

      if (!token) {
        return c.json({ message: "Unauthorized" }, 401);
      }

      try {
        const user = verifyToken(token);
        try {
          const tasks = await geTasksByIdWithUser(user.id);
          console.log(tasks);
          return c.json(tasks);
        } catch (error) {
          return c.json({ message: "Unauthorized" }, 401);
        }
      } catch {
        return c.json({ message: "Unauthorized" }, 401);
      }
    },
  )
  .get(
    "/admin/tasks",

    async (c) => {
      console.log("GETTING TASKS");
      const authHeader = c.req.header("Authorization");

      if (!authHeader) {
        return c.json({ message: "Unauthorized" }, 401);
      }

      const token = authHeader.split(" ")[1];

      if (!token) {
        return c.json({ message: "Unauthorized" }, 401);
      }

      try {
        const user = verifyToken(token);
        if (user.role !== "admin") {
          return c.json({ message: "Unauthorized" }, 401);
        }
        try {
          const tasks = await getAllTasksWithUsers();
          console.log("tasks:", tasks);
          return c.json(tasks);
        } catch (error) {
          return c.json({ message: "Failed to access the database" }, 500);
        }
      } catch {
        return c.json({ message: "Unauthorized" }, 401);
      }
    },
  )
  .post(
    "/task",
    zValidator(
      "json",
      z.object({
        title: z.string().min(1),
        userId: z.number().int(),
        dueDate: z.string(),
      }),
    ),
    async (c) => {
      const req = c.req.valid("json");

      const authHeader = c.req.header("Authorization");

      if (!authHeader) {
        return c.json({ message: "Unauthorized" }, 401);
      }

      const token = authHeader.split(" ")[1];

      if (!token) {
        return c.json({ message: "Unauthorized" }, 401);
      }

      try {
        const user = verifyToken(token);

        if (user.role !== "admin") {
          return c.json({ message: "Unauthorized" }, 401);
        }

        const task = await createTask({
          title: req.title,
          dueDate: req.dueDate,
          userId: req.userId,
        });

        return c.json(task);
      } catch {
        return c.json(
          {
            success: false,
            message: "Failed to create task",
          },
          500,
        );
      }
    },
  );
export default {
  port: 8000,
  fetch: app.fetch,
};
