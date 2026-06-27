# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> delivery_office

## Overview

`delivery_office` is the admin/back-office web app for a logistics & parcel-delivery platform (orders, declarations, couriers, warehouses, cashflow, partners, notifications, etc.). It is a React 18 + TypeScript single-page app talking to a REST admin API.

The codebase is organized as **feature modules** (`src/modules/*`) sitting on top of **shared infrastructure** (`src/shared/*`). The conventions below are what keep the ~60 modules consistent — follow them when adding or changing features.

---

## Commands

Package manager is **Yarn 4 (Berry)** via Corepack; Node **>= 22**. The build is **CRA + `react-app-rewired`** (config in `config-overrides.js`), not plain `react-scripts`.

```bash
yarn start          # Dev server on localhost:3000
yarn build          # Production build
yarn test           # Jest (react-app-rewired) in watch mode
yarn test --watchAll=false src/path/to/file.test.tsx   # Run a single test file once
yarn lint           # eslint src --ext .ts,.tsx
yarn lint:fix       # eslint --fix
yarn format         # prettier --write over src
yarn format:check   # prettier --check (CI-style)
```

- The API host comes from the `REACT_APP_API_HOST` env var (consumed by `urlMaker`); set it in `.env`.
- **Husky + lint-staged** run `eslint --fix` + `prettier` on staged files pre-commit.
- **Commit messages must be Conventional Commits** (`@commitlint/config-conventional`), e.g. `feat:`, `fix:`, `chore:`.

Prettier config: `singleQuote: true`, `trailingComma: all`, `printWidth: 200`.

---

## Architecture

React 18 + TypeScript, Ant Design v5, styled-components. State is **Context + useReducer per module** — no Redux, no dependency injection. Context-first, hooks-first.

### Directory Layout

```
src/
├── modules/       # Feature modules (see Module Structure below)
├── router/        # Root router (main.tsx)
├── shared/
│   ├── components/
│   ├── constants/
│   ├── hooks/
│   ├── modules/
│   ├── styled/
│   └── utils/     # caller.ts, urlMaker(), ApiResult, objectToSearch
└── assets/
```

### Module Structure

Every module under `src/modules/{name}/` follows this layout:

```
components/   → pure presentational components
containers/   → context-connected smart components
context/      → React context + reducer (types.ts, context.ts, reducer.ts)
hooks/        → custom hooks (data fetching, UI logic) — camelCase subfolders, see below
pages/        → top-level page components (compose containers)
router/       → lazy-loaded route definitions
services/     → static-method service classes (API calls)
interfaces/   → domain types/DTOs for the module (optional)
constants/    → enums, status maps, column defs (optional)
use-cases/    → composed table/data-fetch logic, e.g. table-fetch.ts (optional)
index.ts      → barrel export
```

Not every module has all folders; `interfaces/`, `constants/`, and `use-cases/` appear where the feature needs them (e.g. `modules/orders`).

### HTTP & Service Pattern

API calls go through `src/shared/utils/caller.ts` (fetch wrapper). It reads the `accessToken` cookie → `Authorization: Bearer …`, sets `Accept: application/json`, and — when present — adds a `country-id` header from `localStorage['warehouse.country_id']`. **Never use `fetch()` directly.**

Services are **static-method classes** returning `ApiResult<Status, Data, Meta>`:

```typescript
import { ApiResult, caller, urlMaker } from '@shared/utils';

export class OrdersService {
  public static async getOrders(): Promise<ApiResult<200, IOrder[]> | ApiResult<400 | 500, string>> {
    const url = urlMaker('/api/admin/orders');
    try {
      const response = await caller(url);
      if (response.ok) {
        const data = await response.json();
        return new ApiResult(200, data, null);
      }
      return new ApiResult(400, 'Operation failed', null);
    } catch {
      return new ApiResult(500, 'Network request failed', null);
    }
  }
}
```

Use `urlMaker(path, queryParams?)` for all URLs — it prepends `REACT_APP_API_HOST` and appends the query string. Related helpers in `url-maker.ts`: `localURLMaker(path, pathParams, query)` for `:param` route interpolation and `staticFileUrl(fileName)`. Use `object2Search(params)` (from `object-to-search.ts`) to build query strings.

### State Management

Context + useReducer per module. Each module's `context/` folder holds:

- `context/types.ts` — interfaces for state and actions
- `context/context.ts` — createContext + Provider wrapping useReducer
- `context/reducer.ts` — pure reducer

Components read context via `useContext(XyzContext)`. Data fetching lives in hooks or containers (`useEffect` + service call + dispatch).

### Routing

React Router v6. Routes are lazy-loaded via `React.lazy()` + `<Suspense>`.

Root router (`src/router/main.tsx`) checks auth state from `MeContext`:

- No user → render only `MeRouter` (login/register)
- User present → render all feature routers with layout

Each module defines its own router file. Routes use `<Routes>` + `<Route>` (not the legacy v5 `<Switch>`).

### Shared Infrastructure (`src/shared/modules`)

Most list pages and forms are built on shared, reusable systems — prefer these over hand-rolling:

- **`next-table`** — the table framework (own `context/`, `containers/`, `hooks/`, `use-cases/table-fetch.ts`). Provides server-side pagination/sorting/filtering and column rendering. Module list pages compose a `*-table` container on top of it.
- **`form`** — Formik-based field components (`TextField`, `SelectField`, `DateField`, `CheckboxField`, `RadioField`, `TextAreaField`, `UploadField`, `MultiUploadField`, `RichTextField` (CKEditor), `SwitchField`). Build forms from these rather than raw Ant Design inputs.
- **`antd`**, **`progress`**, **`rating`** — additional shared wrappers/helpers.
- Reusable table cells live in `src/shared/components/cells` (`country-cell`, `price-cell`, `tag-cell`, `switch-cell`, etc.).

### Auth

`MeContext` provides `state.user.data` (the logged-in user) and `state.user.loading`.  
Auth tokens stored in cookies via `js-cookie` (`accessToken`, `refreshToken`, `tokenType`).  
`caller.ts` reads `accessToken` automatically on every request.

### Path Aliases

```
@shared/*  → src/shared/*
@modules/* → src/modules/*
@assets/*  → src/assets/*
```

Aliases are defined in **both** `tsconfig.paths.json` (typecheck) and `config-overrides.js` (webpack) — keep them in sync. `config-overrides.js` also registers a raw loader so `.hbs` templates import as source strings (compiled at runtime with `handlebars`, used for notification/ticket templates).

---

## Conventions at a Glance

| Concern | Approach                                                        |
| ------- | --------------------------------------------------------------- |
| HTTP    | `caller()` wrapper + `urlMaker()`; services return `ApiResult`  |
| State   | Context + `useReducer` per module                               |
| Routing | React Router v6 (`<Routes>`/`<Route>`), lazy-loaded per module  |
| Dates   | `dayjs`                                                         |
| UI      | Ant Design v5 + styled-components; shared `form` / `next-table` |
| i18n    | `i18next` / `react-i18next` (language stored in localStorage)   |
| Module  | `services` → `context` → `hooks` → `containers` → `pages`       |

Admin API endpoints live under `/api/admin/...`. Field names, status codes, permission names, and enums are owned by the backend contract — match them exactly in `interfaces/` and `constants/`.

---

## Hook Subfolder Naming Convention

Hook subfolders use **camelCase** (not kebab-case).

Multi-word examples: `notificationTemplates`, `smsNotifications`, `smsNotificationsQueue`, `emailNotifications`, `emailNotificationsQueue`, `whatsappNotifications`, `whatsappNotificationsQueue`, `ticketTemplates`, `declarationDetail`, `archiveStatus`, `azerpostQueues`, `bbsQueues`, `branchPartners`, `deliveryProofs`, `productTypes`, `returnTypes`, `shopNames`, `unitedQueues`.

### Import depth rule

Hook files inside `hooks/<subfolder>/use-*.ts` are **two levels below** the module root — always use `../../`:

```ts
import { XyzService } from '../../services'; // ✓
import { IXyz } from '../../interfaces'; // ✓
import { XyzService } from '../services'; // ✗ wrong depth
```

**Verify no single-level imports remain inside hook subfolders:**

```bash
grep -rP 'from "\.\./(?!\.\.)' src/modules --include="*.ts" --include="*.tsx" | grep "/hooks/"
```

### Barrel exports

`hooks/index.ts` re-exports from camelCase subfolders:

```ts
export * from './notificationTemplates';
export * from './smsNotifications';
// ...
```

Containers and pages import from the barrel `'../hooks'`, never direct file paths like `'../hooks/use-foo'`.

### Module public API (`index.ts`)

Module root `index.ts` re-exports from `'./hooks'` barrel, not direct hook file paths:

```ts
export { useBranches } from './hooks'; // ✓
export { useBranches } from './hooks/use-branches'; // ✗ breaks when hook moves to subfolder
```

---

## Sidebar Styling Notes

File: `src/modules/layout/styled/sidebar.tsx`

- Selected **leaf items** → `menuActiveItemBg` (#1da57a) with `border-radius: 0`
- Open/selected **folder (submenu) titles** → `border-radius: 0`, no background (only the active child item is highlighted)
- Ant Design v5 adds border-radius to all menu items by default — always override with `border-radius: 0`
- Ant Design v5 default for dark selected items is `hsla(0,0%,100%,.05)` — overridden by our `!important` rule
- Theme colors: `menuActiveItemBg: '#1da57a'`, `menuHoverItemBg: '#1da57a'`, `menuBg: '#22313a'`, `menuSubBg: '#233139'`, `sidebarBg: '#1e2a31'`
