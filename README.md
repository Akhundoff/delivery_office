# delivery_office

Admin / back-office web app for the delivery & logistics platform — orders, declarations, couriers, warehouses, cashflow, partners, notifications, and more. Built with React 18 + TypeScript and Ant Design v5.

## Requirements

- Node **>= 22** (see `.nvmrc`)
- **Yarn 4 (Berry)** via Corepack (`corepack enable`)

## Setup

```bash
corepack enable
yarn install
```

Create a `.env` with the API host:

```bash
REACT_APP_API_HOST=https://your-api-host
```

## Scripts

```bash
yarn start         # Dev server on http://localhost:3000
yarn build         # Production build
yarn test          # Jest test runner (watch mode)
yarn lint          # ESLint over src
yarn lint:fix      # ESLint with --fix
yarn format        # Prettier write over src
yarn format:check  # Prettier check (CI)
```

The build runs through `react-app-rewired` (config in `config-overrides.js`), which adds the `@modules` / `@shared` / `@assets` webpack aliases and a raw loader for `.hbs` templates.

## Architecture

- **Feature modules** under `src/modules/*`, each with its own `services / context / hooks / containers / pages / router`.
- **Shared infrastructure** under `src/shared/*` — the `caller()` HTTP wrapper, the `next-table` table framework, Formik-based `form` fields, reusable cells, hooks, and theme.
- State is **Context + useReducer** per module (no Redux). Routing is **React Router v6** with lazy-loaded module routers.

See [`CLAUDE.md`](./CLAUDE.md) for detailed architecture and conventions.

## Git Hooks

Husky + commitlint + lint-staged enforce branch naming, lint/format staged files, and validate commit messages (**Conventional Commits**, e.g. `feat:`, `fix:`, `chore:`).

> Yarn 4 does not run the `prepare` script automatically on `yarn install`. To work around this, `start`, `build`, and `test` run `husky` (silently, idempotently) before delegating to `react-app-rewired`, so git hooks are activated the first time you run any of those.
