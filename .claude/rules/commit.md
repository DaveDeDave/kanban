# Commit Rules

Never create a commit. When a commit is needed, provide the user with the `git commit -m "<message>"` command so they can run it.

The commit message must follow these rules:
- Use a Conventional Commit type: `feat`, `fix`, `refactor`, or `chore`.
- When working on a feature, include its name or code as a scope (e.g., `feat(new-landing-page):` or `feat(FEAT-CODE-123):`).
- Keep commit messages to a maximum of 20 words.
