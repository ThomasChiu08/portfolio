# Repository Guidelines

## Project Structure & Module Organization
This repository is currently a clean Git workspace with no application code committed yet. Keep the top level small and predictable as the project grows:

- `src/` for application code
- `tests/` for automated tests
- `public/` or `assets/` for static files
- `docs/` for design notes, specs, or architecture records

Group code by feature or domain once `src/` exists, and keep tests close to the behavior they verify. Example: `src/auth/login.ts` with `tests/auth/login.test.ts`.

## Build, Test, and Development Commands
No build system or package manifest is present yet, so there are no project commands to standardize today. When tooling is added, document the canonical workflow here and in the project README.

Expected examples once configured:

- `npm install` to install dependencies
- `npm run dev` to start local development
- `npm test` to run the automated test suite
- `npm run lint` to enforce formatting and style rules

Do not add duplicate scripts for the same task.

## Coding Style & Naming Conventions
Use 2-space indentation for Markdown, JSON, YAML, and JavaScript or TypeScript unless a formatter enforces otherwise. Prefer descriptive names:

- `PascalCase` for classes and components
- `camelCase` for functions and variables
- `kebab-case` for file and directory names

Adopt an automated formatter and linter early, and commit their config with the first production code.

## Testing Guidelines
Add tests with each feature or bug fix. Mirror source paths under `tests/` or colocate tests when the toolchain supports it. Name tests after the unit under test, such as `login.test.ts` or `login.spec.ts`. Treat missing tests for changed behavior as a review issue.

## Commit & Pull Request Guidelines
This repository has no commit history yet, so no existing convention can be inferred. Use short, imperative commit subjects like `Add auth route scaffold` and keep each commit focused.

For pull requests, include:

- a short summary of the change
- linked issue or task ID, if available
- test evidence
- screenshots for UI changes

## Configuration & Security
Never commit secrets, API keys, or local `.env` files. Add a `.env.example` when configuration is introduced, and document required variables alongside the related feature.
