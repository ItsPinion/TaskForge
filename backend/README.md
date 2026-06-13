# TaskForge — Backend

This is the Hono REST API backend for TaskForge. It provides JWT authentication, user management, and task CRUD operations with role-based access control (RBAC).

## Quick start

- Install dependencies and run (from `backend/`):

```bash
bun install
bun run dev
```

- Defaults: server listens on port `8000` (see [backend/src/index.ts](backend/src/index.ts#L1-L400)).

## Environment

- `JWT_SECRET` — secret used to sign JWT tokens (defaults to `super-secret-key` in development).

## Main files
- [backend/src/index.ts](backend/src/index.ts#L1-L400): API routes and RBAC checks.
- [backend/src/user.ts](backend/src/user.ts#L1-L200): user DB helpers.
- [backend/src/task.ts](backend/src/task.ts#L1-L200): task DB helpers.
- [backend/src/utils/auth.ts](backend/src/utils/auth.ts#L1-L200): JWT helpers.

## API Endpoints (backend)

- POST `/register` — Register a new user.
  - Payload: `{ name, email, password }`
  - Returns: `{ success, message, token }` on success (token contains role `user`).

- POST `/login` — Login existing user.
  - Payload: `{ email, password }`
  - Returns: `{ success, message, token }` on success.

- GET `/me` — Get current logged-in user info.
  - Requires header: `Authorization: Bearer <token>`

- GET `/users` — List all users (admin-only).
  - Requires admin JWT.

- GET `/tasks` — Get tasks for the authenticated user.
  - Requires JWT.

- GET `/admin/tasks` — Get all tasks and assigned users (admin-only).
  - Requires admin JWT.

- POST `/task` — Create a task (admin-only).
  - Payload: `{ title, userId, dueDate }` (ISO string)
  - Requires admin JWT.

Notes: All protected routes validate JWT tokens via `verifyToken()` in [backend/src/utils/auth.ts](backend/src/utils/auth.ts#L1-L200).

## Authentication & Roles

- Authentication: JWT tokens signed by `JWT_SECRET`. Token payload: `{ id, name, email, role }`.
- Passwords are hashed using bcrypt (`backend/src/utils/password.ts`).
- Role separation: `role` is `user` by default (DB default). Routes check `user.role === 'admin'` for admin-only actions.

## Admin vs User capabilities

- Admin can:
  - View all users (`GET /users`).
  - View all tasks and their assignees (`GET /admin/tasks`).
  - Create tasks for any user (`POST /task`).

- Normal user can:
  - Register and login.
  - View their own tasks (`GET /tasks`).

## Creating demo accounts

There are no seeded users in the migrations. To create demo accounts:

- Create normal user (via frontend register) using the Register page.

- To create an admin manually, run a SQL update against your database (Turso/SQLite) after registering a user, for example:

```sql
UPDATE users_table SET role = 'admin' WHERE email = 'admin@example.com';
```

Or insert directly with a hashed password. Example (sqlite3):

```sql
INSERT INTO users_table (name, email, role, password) VALUES ('Admin','admin@example.com','admin','<bcrypt-hash>');
```

Suggested demo credentials (create them as described above):

- Admin: `admin@example.com` / `Password123!`
- User: `user@example.com` / `Password123!`

When you create them via the register endpoint, the returned token will be a regular user token; update role via the DB step above to make the account an admin.

## Notes / Limitations

- The backend enforces role checks server-side (recommended). The frontend contains UI for promoting users, but there is no dedicated `promote` endpoint implemented in `backend/src/index.ts` — promoting must be done directly in the database or by adding an endpoint.

If you want, I can add a secure `POST /users/:id/promote` admin-only endpoint for in-app promotion.
To install dependencies:
```sh
bun install
```

To run:
```sh
bun run dev
```

open http://localhost:3000
