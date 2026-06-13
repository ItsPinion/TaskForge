# TaskForge — Frontend

This is the Next.js frontend for TaskForge. It uses the Hono client to call the backend API, persists the JWT in `localStorage`, and conditionally shows admin UI based on the decoded `role` from `/me`.

## Quick start

- Install and run (from `frontend/`):

```bash
bun install
bun run dev
```

- Configure backend URL (optional): set `BACKEND` env variable to your backend base URL (defaults to `http://localhost:8000`). See [frontend/src/app/lib/api/auth.ts](frontend/src/app/lib/api/auth.ts#L1-L200).

## Frontend routes (pages)

- `/` — Home page: `frontend/src/app/page.tsx`.
- `/login` — Login page: `frontend/src/app/login/page.tsx`.
- `/register` — Register page: `frontend/src/app/register/page.tsx`.
- `/tasks` — User tasks dashboard: `frontend/src/app/tasks/page.tsx` and `frontend/src/app/tasks/_component/taskTable.tsx`.
- `/admin` — Admin dashboard: `frontend/src/app/admin/page.tsx` and components in `frontend/src/app/admin/_components/`.

## API client and mappings

Client helpers live in `frontend/src/app/lib/api/` and call the backend endpoints via the Hono client:

- `registerUser` — calls `POST /register` (backend `/register`) [frontend/src/app/lib/api/auth.ts](frontend/src/app/lib/api/auth.ts#L1-L200).
- `loginUser` — calls `POST /login` (backend `/login`) [frontend/src/app/lib/api/auth.ts](frontend/src/app/lib/api/auth.ts#L1-L200).
- `getMe` — calls `GET /me` (backend `/me`) and is used to determine the current user and role.
- `getAllUsers` — calls `GET /users` (backend `/users`) — used by admin UI ([frontend/src/app/admin/_components/promote.tsx](frontend/src/app/admin/_components/promote.tsx#L1-L200)).

- `getTasksById` — calls `GET /tasks` (backend `/tasks`) to fetch tasks assigned to the logged-in user.
- `getAllTasks` — calls `GET /admin/tasks` (backend `/admin/tasks`) to fetch all tasks (admin-only).
- `createTask` — calls `POST /task` (backend `/task`) to create a task (admin-only).

## Authentication flow

- On successful login or register the backend returns a JWT. The frontend stores it in `localStorage` under key `token` via `createSession()` ([frontend/src/app/lib/api/session.ts](frontend/src/app/lib/api/session.ts#L1-L50)).
- The frontend uses `getMe()` to fetch the current user and check `role` to show/hide admin UI.

## Admin UI and promotion

- The admin dashboard shows `TaskForm`, `Promote`, and an admin `TaskTable`. The `Promote` component lists users and renders a promote form, but there is no implemented endpoint in the backend to change a user's role. Promotion must be done directly in the DB until a backend endpoint is added.

## Demo accounts

- Suggested demo credentials (create using the backend register endpoint or by inserting into DB and updating role):
  - Admin: `admin@example.com` / `Password123!`
  - User: `user@example.com` / `Password123!`

To test admin flows: register a user, then set their role to `admin` in the database (see backend README for SQL example).

## Security notes

- Tokens are stored in `localStorage` for simplicity in this demo — consider HttpOnly cookies for production to mitigate XSS risk.
- All role checks are enforced server-side; the frontend only hides or shows UI.

## Where to look in code

- API helpers: [frontend/src/app/lib/api/auth.ts](frontend/src/app/lib/api/auth.ts#L1-L200), [frontend/src/app/lib/api/task.ts](frontend/src/app/lib/api/task.ts#L1-L200), [frontend/src/app/lib/api/session.ts](frontend/src/app/lib/api/session.ts#L1-L50).
- Admin panel and components: [frontend/src/app/admin/page.tsx](frontend/src/app/admin/page.tsx#L1-L200) and `frontend/src/app/admin/_components/`.

If you'd like, I can implement a secure `POST /users/:id/promote` backend route and wire the Promote form to it so admins can promote users from the UI.
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
