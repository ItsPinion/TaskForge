<div align="center">
  <img src="https://img.shields.io/badge/Node.js-18+-43853d?style=flat-square&logo=node.js" alt="Node">
  <img src="https://img.shields.io/badge/TypeScript-5+-3178c6?style=flat-square&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License">
  <img src="https://img.shields.io/badge/Status-Active-brightgreen?style=flat-square" alt="Status">
</div>

# ⚡ TaskForge

> A modern, full-stack task management system built with **type-safe APIs**, **JWT authentication**, and **role-based access control**.

TaskForge demonstrates a complete full-stack architecture with a Hono REST API backend and Next.js frontend. It showcases JWT authentication, role-based authorization (admin/user), task assignment workflows, and **type-safe client-server communication** using shared RPC types.

<details open>
<summary><b>📋 Table of Contents</b></summary>

- [✨ Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [⚙️ Tech Stack](#️-tech-stack)
- [📁 Backend](#-backend)
- [🎨 Frontend](#-frontend)
- [🔗 Integration](#-integration)
- [🔐 Auth & Roles](#-auth--roles)
- [💼 Demo Accounts](#-demo-accounts)
- [🚀 Quick Start](#-quick-start)
- [📚 Documentation](#-documentation)

</details>

---

## ✨ Features

- **🔐 JWT Authentication** — Secure token-based auth with 7-day expiry
- **👥 Role-Based Access Control** — Separate permissions for admins and users
- **✅ Task Management** — Create, view, and track tasks with due dates
- **📝 Type-Safe APIs** — End-to-end TypeScript validation via RPC types
- **🔒 Password Hashing** — Bcrypt-based secure password storage
- **⚡ Full-Stack** — Integrated frontend + backend in a single repo

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│  Frontend (Next.js)                     │
│  ├─ React Components                    │
│  ├─ Hono Typed Client (hc)              │
│  └─ JWT in localStorage                 │
└────────────┬────────────────────────────┘
             │ HTTP + JWT Bearer
             ▼
┌─────────────────────────────────────────┐
│  Backend (Hono)                         │
│  ├─ API Routes                          │
│  ├─ JWT Verification                    │
│  ├─ RBAC Middleware                     │
│  └─ Database Logic                      │
└────────────┬────────────────────────────┘
             │ Drizzle ORM
             ▼
┌─────────────────────────────────────────┐
│  SQLite Database (Turso)                │
│  ├─ users_table                         │
│  └─ task_table                          │
└─────────────────────────────────────────┘
```

**Type Safety**: Shared RPC types in `rpc/appTypes.ts` provide compile-time validation for all API calls.

---

## ⚙️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 15, React, TailwindCSS | UI & Client |
| **Backend** | Hono, Node.js, TypeScript | REST API |
| **Database** | SQLite (Turso), Drizzle ORM | Data Layer |
| **Auth** | JWT, Bcrypt, zod | Security |
| **Runtime** | Bun | Task running |

---

## 📁 Backend

### Overview

- **Framework**: Hono (TypeScript)
- **Database**: SQLite via Drizzle ORM
- **Auth**: JWT tokens (7-day expiry) + bcrypt password hashing
- **Port**: `8000`

### Key Files

| File | Purpose |
|------|---------|
| `backend/src/index.ts` | API routes & middleware |
| `backend/src/user.ts` | User DB operations |
| `backend/src/task.ts` | Task DB operations |
| `backend/src/utils/auth.ts` | JWT generation & verification |
| `backend/src/utils/password.ts` | Bcrypt hashing & comparison |

### API Endpoints

#### Authentication
- **POST** `/register` — Create new user → `{ name, email, password }`
- **POST** `/login` — Authenticate user → `{ email, password }`
- **GET** `/me` — Get current user (requires JWT)

#### User Management (Admin Only)
- **GET** `/users` — List all users (admin-only)

#### Task Management
- **GET** `/tasks` — Get tasks for current user
- **GET** `/admin/tasks` — Get all tasks (admin-only)
- **POST** `/task` — Create task (admin-only) → `{ title, userId, dueDate }`

---

## 🎨 Frontend

### Overview

- **Framework**: Next.js (app router)
- **Client**: Hono typed client (`hc`) with RPC types
- **Session**: JWT stored in `localStorage`
- **Styling**: TailwindCSS

### Key Files

| File | Purpose |
|------|---------|
| `frontend/src/app/page.tsx` | Homepage with role-based UI |
| `frontend/src/app/login/page.tsx` | Login form |
| `frontend/src/app/register/page.tsx` | Registration form |
| `frontend/src/app/tasks/` | User tasks dashboard |
| `frontend/src/app/admin/` | Admin panel |
| `frontend/src/app/lib/api/` | Typed API client helpers |

### Pages & Routes

| Route | Purpose |
|-------|---------|
| `/` | Homepage (show login/register or dashboard) |
| `/register` | Registration form |
| `/login` | Login form |
| `/tasks` | User's assigned tasks |
| `/admin` | Admin dashboard (create tasks, manage users) |

---

## 🔗 Integration: Frontend ↔ Backend

### Client Functions → Backend Routes

| Frontend Function | Backend Endpoint | Auth |
|-------------------|------------------|------|
| `registerUser()` | `POST /register` | None |
| `loginUser()` | `POST /login` | None |
| `getMe()` | `GET /me` | JWT |
| `getAllUsers()` | `GET /users` | Admin |
| `getTasksById()` | `GET /tasks` | JWT |
| `getAllTasks()` | `GET /admin/tasks` | Admin |
| `createTask()` | `POST /task` | Admin |

### Type Safety

The `rpc/appTypes.ts` file exports shared TypeScript types that both frontend and backend use. This ensures:
- ✅ Request payloads are validated at compile time
- ✅ Response shapes are type-checked
- ✅ No runtime shape errors
- ✅ Full IDE autocomplete support

---

## 🔐 Auth & Roles

### Authentication Flow

1. User registers or logs in with email & password
2. Backend validates credentials and issues a **JWT token**
3. JWT contains: `{ id, name, email, role, expiresAt }`
4. Frontend stores token in `localStorage`
5. All protected requests include: `Authorization: Bearer <token>`
6. Backend verifies token and checks `role` for RBAC

### User Roles

#### 👤 User (Default)
- Register & login
- View tasks assigned to them
- Cannot create tasks or manage other users

#### 🛡️ Admin
- Do everything a user can do
- **List all users** (`GET /users`)
- **List all tasks** with assignees (`GET /admin/tasks`)
- **Create tasks** for any user (`POST /task`)
- **Promote users to admin** (by updating role in DB)

---

## 💼 Demo Accounts

### Quick Demo Credentials

```
┌──────────────────────────────────────────┐
│          🛡️  ADMIN ACCOUNT               │
├──────────────────────────────────────────┤
│  Email:    admin@example.com             │
│  Password: Password123!                  │
│  Role:     admin                         │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│          👤 USER ACCOUNT                 │
├──────────────────────────────────────────┤
│  Email:    user@example.com              │
│  Password: Password123!                  │
│  Role:     user                          │
└──────────────────────────────────────────┘
```


---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ or **Bun**
- **SQLite** or Turso database

### Backend Setup

```bash
cd backend
bun install
bun run dev
```

✅ API running at `http://localhost:8000`

### Frontend Setup

```bash
cd frontend
bun install
bun run dev
```

✅ UI running at `http://localhost:3000`

### Environment Variables (Backend)

```bash
# .env or .env.local
JWT_SECRET=your-super-secret-key-here
BACKEND=http://localhost:8000
```

---

## 📚 Documentation

- **[backend/README.md](backend/README.md)** — Detailed backend setup & routes
- **[frontend/README.md](frontend/README.md)** — Detailed frontend setup & components
- **[rpc/appTypes.ts](rpc/appTypes.ts)** — Shared RPC type definitions

---

## 🔒 Security Notes

- ⚠️ Tokens stored in `localStorage` are vulnerable to XSS; use HttpOnly cookies for production
- ✅ All authorization is enforced **server-side** — frontend UI is just for UX
- ✅ Passwords are hashed with **bcrypt** (12 rounds)
- ✅ JWTs expire after **7 days**

---

<div align="center">

**[↑ back to top](#-taskforge)**

Made with ❤️ by [ItPinion](https://github.com/ItPinion)

</div>
