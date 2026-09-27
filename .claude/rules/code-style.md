# Code Style Rules

- Use `import type { X }` for TypeScript type-only imports.
- Use descriptive names for variables, functions, and classes.

  - Avoid: `const user = 1; const getUser = (id: number) => {...}; class Service {};`
  - Prefer: `const userId = 1; const getUserById = (id: number) => {...}; class AuthenticationService {};`
