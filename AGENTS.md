# Development Guide for AI Agents

This repository is a monorepo containing Cloudflare Workers backend services and a frontend web application. When working on the project, follow the guidance in this file.

## Project structure
The project is a Yarn monorepo structured as follows:
```text
packages/                 # monorepo packages
  backend/                # backend packages
    libs/                 # reusable libraries
      base/               # essential utilities
    workers/              # Cloudflare Workers services
      main/               # API layer
      reset-db/           # scheduled weekly database reset
  frontend/               # frontend package
```

## Technologies

### Backend
- TypeScript
- Cloudflare Workers (HTTP API and scheduled reset worker), with Wrangler for local development and deployment
- PostgreSQL
- Drizzle ORM
- tRPC
- Zod
- Jest for integration tests

### Frontend
- TypeScript
- React
- Vite
- TanStack Query and TanStack Router
- tRPC client and Zod
- SCSS modules
- Radix UI, Formik, i18next, and SortableJS
- Vitest and Storybook

## Package manager
The project uses Yarn as its package manager. Follow these rules:
- NEVER use other package managers (e.g., npm or pnpm).
- NEVER install dependencies autonomously. Tell the user what you need and the command to install it, then wait.

## Development pace
- When executing an approved SDD plan, work on one task from `TASKS.md` at a time.
- Stick to the agreed plan and the requested scope. Do not start additional tasks or change unrelated code. If a change outside the plan is needed, explain why and get approval before making it.
- Follow user instructions. After completing a selected `TASKS.md` task, wait for user approval before starting another.
- Prefer small, reviewable diffs over huge changes.

## Coding conventions
- Prioritize type safety and prefer TypeScript (.tsx/.ts) over plain JavaScript (.js/.jsx).

## Commands

### Dev servers
```bash
yarn workspace @kanban/main-worker dev    # start dev backend worker
yarn workspace @kanban/frontend dev       # start dev frontend server
```

## Validation
```bash
yarn workspace @kanban/main-worker check:ts              # TypeScript check - backend
yarn workspace @kanban/main-worker check:lint            # Lint check - backend
yarn workspace @kanban/main-worker check:prettier:fix    # Format - backend
yarn workspace @kanban/main-worker test:integration      # Run backend tests
yarn workspace @kanban/frontend check:ts                 # TypeScript check - frontend
yarn workspace @kanban/frontend check:lint               # Lint check - frontend
yarn workspace @kanban/frontend check:prettier:fix       # Format - frontend
yarn workspace @kanban/frontend test                     # Run frontend tests
```

## Rules
Read all rules in `.claude/rules/` before working on a task. These are the shared rules for Codex and Claude.
