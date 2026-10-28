# Task Workboard

A Kanban-style task board. Next.js frontend, Express + Sequelize API, PostgreSQL database.

| Part | Stack |
| --- | --- |
| `frontend/` | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4 |
| `backend/` | Node.js 20+, Express 5, Sequelize 6, zod |
| Database | PostgreSQL 13+ |

## Prerequisites

- Node.js 20 or later
- PostgreSQL 13 or later, running locally (the migration uses the built-in `gen_random_uuid()`)

## Setup

```bash
# 1. Install dependencies in each app
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# 2. Configure environment variables
cp backend/.env.example backend/.env                 # then set DB_USER / DB_PASSWORD
cp frontend/.env.example frontend/.env.local

# 3. Create the database, run migrations, and seed demo data
cd backend
npm run db:create
npm run db:migrate
npm run db:seed

# 4. Start the API (from backend/)
npm run dev

# 5. In a second terminal, start the web app (from frontend/)
cd frontend
npm run dev
```

- Web app: http://localhost:3000
- API: http://localhost:4000/api/v1

## API

Base path: `/api/v1`

| Method | Path | Description |
| --- | --- | --- |
| GET | `/health` | Health check |
| GET | `/tasks?status=&priority=&search=` | List tasks |
| GET | `/tasks/:id` | Get one task |
| POST | `/tasks` | Create a task (`title` is required) |
| POST  | `/tasks/:id` | Partially update a task |
| DELETE | `/tasks/:id` | Soft-delete a task |

Successful responses return `{ "data": ... }`. Errors return `{ "error": { "message", "details?" } }`.

## Database scripts (run from `backend/`)

| Script | What it does |
| --- | --- |
| `npm run db:migrate` | Apply pending migrations |
| `npm run db:migrate:undo` | Revert the last migration |
| `npm run db:seed` | Insert demo tasks |
| `npm run db:reset` | Revert all migrations, re-run them, and re-seed |
