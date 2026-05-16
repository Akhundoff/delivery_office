# CLAUDE.md — delivery_management_new

## Purpose

This project is a **rewrite of `delivery_management`** using the **architecture of `delivery_warehouse`**.

- **Business logic, API endpoints, field names, and constants** → same as `delivery_management`  
  (reference `../delivery_management/src` for domain knowledge)
- **Project structure, routing, HTTP, state patterns** → same as `delivery_warehouse`  
  (reference `../delivery_warehouse/src` for architecture patterns)

Never copy architectural patterns from `delivery_management`. Never copy business logic / API URLs / field mappings from a place other than `delivery_management`.

---

## Commands

```bash
npm start          # Dev server on localhost:3000
npm run build      # Production build
```

Prettier config (via `delivery_warehouse` style): `singleQuote: true`, `trailingComma: all`, `printWidth: 200`.

---

## Architecture

React 18 + TypeScript. No Redux. No Inversify. Context-first, hooks-first.

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

Every module under `src/modules/{name}/` follows this layout (mirror of `delivery_warehouse`):

```
components/   → pure presentational components
containers/   → context-connected smart components
context/      → React context + reducer (types.ts, context.ts, reducer.ts)
hooks/        → custom hooks (data fetching, UI logic)
pages/        → top-level page components (compose containers)
router/       → lazy-loaded route definitions
services/     → static-method service classes (API calls)
index.ts      → barrel export
```

### HTTP & Service Pattern

API calls go through `src/shared/utils/caller.ts` (fetch wrapper, reads `accessToken` cookie, sets `Authorization` header and `lang` from localStorage). **Never use `fetch()` directly.**

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

Use `urlMaker(path, queryParams?)` for all URLs. Use `objectToSearch(params)` to build query strings.

### State Management

Context + useReducer per module. No Redux, no react-query.

Pattern from `delivery_warehouse`:
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

### Auth

`MeContext` provides `state.user.data` (the logged-in user) and `state.user.loading`.  
Auth tokens stored in cookies via `js-cookie` (`accessToken`, `refreshToken`, `tokenType`).  
`caller.ts` reads `accessToken` automatically on every request.

### Path Aliases

```
@shared/*  → src/shared/*
@modules/* → src/modules/*
```

---

## Key Differences from delivery_management

| Concern | delivery_management (old) | delivery_management_new |
|---|---|---|
| HTTP | `HttpClient` via Inversify DI | `caller()` utility function |
| State | Redux + react-query | Context + useReducer |
| DI | Inversify (`@bind`, `useInjection`) | None |
| Routing | React Router v5 (`<Switch>`) | React Router v6 (`<Routes>`) |
| dates | moment.js | dayjs |
| UI | Ant Design 4 | (same or warehouse equivalent) |
| Module pattern | repos/mappers/hooks/containers | services/context/hooks/containers |

---

## API / Business Logic Reference

When implementing a feature, look up the existing implementation in `delivery_management` for:
- API endpoint URLs (`/api/admin/...`)
- Request/response field names
- Business rules, status codes, permission names
- Constants and enums

Then re-implement using the patterns above (warehouse architecture, not the DI/Redux approach).

---

## Hook Subfolder Naming Convention

Hook subfolders use **camelCase** (not kebab-case). Reference: `delivery_management/src/hooks/`.

Multi-word examples: `notificationTemplates`, `smsNotifications`, `smsNotificationsQueue`, `emailNotifications`, `emailNotificationsQueue`, `whatsappNotifications`, `whatsappNotificationsQueue`, `ticketTemplates`, `declarationDetail`, `archiveStatus`, `azerpostQueues`, `bbsQueues`, `branchPartners`, `deliveryProofs`, `productTypes`, `returnTypes`, `shopNames`, `unitedQueues`.

### Import depth rule

Hook files inside `hooks/<subfolder>/use-*.ts` are **two levels below** the module root — always use `../../`:

```ts
import { XyzService } from '../../services';   // ✓
import { IXyz } from '../../interfaces';        // ✓
import { XyzService } from '../services';       // ✗ wrong depth
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
export { useBranches } from './hooks';   // ✓
export { useBranches } from './hooks/use-branches';  // ✗ breaks when hook moves to subfolder
```

---

## Sidebar Styling Notes

File: `src/modules/layout/styled/sidebar.tsx`

- Selected **leaf items** → `menuActiveItemBg` (#1da57a) with `border-radius: 0`
- Open/selected **folder (submenu) titles** → `border-radius: 0`, no background (only the active child item is highlighted)
- Ant Design v5 adds border-radius to all menu items by default — always override with `border-radius: 0`
- Ant Design v5 default for dark selected items is `hsla(0,0%,100%,.05)` — overridden by our `!important` rule
- Theme colors: `menuActiveItemBg: '#1da57a'`, `menuHoverItemBg: '#1da57a'`, `menuBg: '#22313a'`, `menuSubBg: '#233139'`, `sidebarBg: '#1e2a31'`
