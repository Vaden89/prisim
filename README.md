# Prisim

Prisim is a task and ticket management platform that helps teams turn requests into clear, actionable work and track it from start to finish. It combines the structure of Jira with the visual simplicity of a Trello-style Kanban board, so work stays easy to understand and easy to move.

## What Makes Prisim Different

Prisim is designed to bridge the gap between non-technical requests and the real impact those requests can have on a codebase.

In many teams, tasks are created by people who care about the outcome, but not necessarily the architectural consequences of the change. Prisim addresses that gap with an agent that reviews each task, reasons about how it may affect the codebase, identifies related systems or dependencies, and creates sub-tasks for any downstream work that may be required.

This gives developers a more complete view of the change before implementation starts.

## How Prisim Works

### Product Side

1. A task is created in the app.
2. The task is stored in the database.
3. A processing job is queued for the agent.
4. The agent reads the task content, including text and images where available.
5. It searches the vector database for relevant code and dependencies.
6. It reasons about how the requested change may affect the codebase.
7. It creates sub-tasks that describe the related changes a developer may need to make.

The result is a task view that shows not only the original request, but also the surrounding work needed to ship it safely.

### Code Side

1. On each merge into the main branch, the application pulls the updated codebase.
2. A code ingestion script runs using tree-sitter.
3. The script extracts function definitions, method definitions, and dependency information.
4. That output is passed to a code embedding model such as `voyage-3-code`.
5. The generated vectors are stored in a RAG-backed database for fast retrieval.

This makes it easier for the agent to reason over the current codebase and surface the most relevant context for a task.

## Repository

This repository is a Turborepo-based monorepo with separate apps and shared packages.

### Apps and Packages

- `apps/web`: the main web application
- `packages/ui`: shared UI components
- `packages/eslint-config`: shared ESLint configuration
- `packages/typescript-config`: shared TypeScript configuration

### Development

Use your package manager or Turbo to run the apps locally.

```sh
pnpm dev
```

To build everything:

```sh
pnpm build
```
