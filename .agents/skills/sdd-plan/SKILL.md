---
name: sdd-plan
description: Plan features with Spec-Driven Development and implement selected tasks from approved plans using ADR, tasks, and impact documents.
---

# SDD Plan

Use this workflow when the user requests a Spec-Driven Development (SDD) plan or asks to implement a task from an approved SDD plan.

## Planning flow

1. Read the information the user provides and inspect relevant repository context.
2. **Interview the user before writing the specs.** If ANY of the following is unclear, ask; do not assume:
   - **Scope:** What exactly is being built, and what is explicitly out of scope?
   - **System impact:** Which systems will change? Are database migrations needed, or is there a risk of data loss?
   - **Breaking changes:** Will existing APIs or behavior change?
   - **Acceptance criteria:** How will the feature be verified? Which edge cases matter?
   - **Constraints:** Are there security, performance, or compatibility requirements?
   Present the gaps clearly, for example: "I need clarification on X and Y before proceeding."
3. Create a feature folder under `specs/` named after the feature, such as `specs/my-feature/`. Use relevant files from `specs/_templates/` when available.
4. Populate three files:
   - **`TASKS.md`:** Describe the feature and list small, atomic, independently verifiable tasks. Use `[ ]` for To Do, `[~]` for In Progress, and `[x]` for Completed.
   - **`ADR.md`:** Record the context, proposed decision, rationale, alternatives, and consequences.
   - **`IMPACT.md`:** Describe affected systems, database changes, breaking changes, and risks.
5. Present all three files to the user. Do not enter the execution flow until all necessary information is resolved and the user explicitly approves the plan.

## Execution flow

1. Work on one task explicitly selected by the user. Change its marker from `[ ]` to `[~]` in `TASKS.md` before changing implementation code.
2. For new behavior or bug fixes, write and run a failing test before implementation, following the repository's testing rules.
3. Implement the selected task and run its relevant tests.
4. Run the applicable TypeScript and lint checks, and format changed files with the repository's Prettier configuration. Resolve failures caused by the task; report checks that cannot run or fail for unrelated reasons.
5. When the Definition of Done is met, change its marker from `[~]` to `[x]` in `TASKS.md`, summarize the changes and checks, and wait for the user's confirmation before starting another task.

## Definition of Done (per task)

Before marking a task **Completed**, verify that:
- The selected task is implemented.
- Tests for new behavior or bug fixes were written before implementation, and the relevant tests pass.
- The applicable TypeScript and lint checks pass.
- Prettier formatting is applied to changed files.
- `TASKS.md` accurately reflects the task's status.
