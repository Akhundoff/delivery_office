# Group 1: Missing Flows in Existing Modules — Design Spec

## Overview

Six missing flows across three existing modules: customs, declarations, and flights/users. Each is a direct port of the corresponding `delivery_management` feature using `delivery_warehouse` architecture.

---

## 1. Customs — Tasks Page

### Route
- `/customs/tasks` — list page
- `/customs/tasks/:id` — detail modal (overlays list)

### Service Methods
```
GET  /api/admin/customs_tasks              → paginated list
GET  /api/admin/customs_tasks/info?customs_task_id={id}  → single task detail
```

### Interface
```ts
ICustomsTask {
  id: number
  status: { id: number; name: string }
  declarationCount: number
  createdAt: string
}

ICustomsTaskDetail {
  id: number
  status: { id: number; name: string }
  declarations: { id: number; trackingCode: string; status: string }[]
  createdAt: string
}
```

### Containers / Pages
- `CustomsTasksTable` + `CustomsTasksActionBar` — list with filter/search
- `CustomsTaskDetail` — read-only modal showing task info + declarations list
- `CustomsTasksPage` — composes table + action bar
- Add routes in `customs/router/page.router.tsx` (`tasks`, `tasks/:id`)
- Add `tasks/:id` to `customs/router/modal.router.tsx`

---

## 2. Declarations — Unknown Declarations Page

### Route
- `/declarations/unknowns` — list page
- `/declarations/unknowns/:id` — detail/edit modal

### Service Methods
```
GET   /api/admin/v2/conflicted_declaration/list            → paginated list
GET   /api/admin/conflicted_declaration/info?conflicted_declaration_id={id}  → detail
POST  /api/admin/conflicted_declaration/cancel             → body: conflicted_declaration_id[]
POST  /api/admin/conflicted_declaration/accept             → body: conflicted_declaration_id
POST  /api/admin/conflicted_declaration/create             → create new
POST  /api/admin/conflicted_declaration/edit               → update existing
```

### Interface
```ts
IUnknownDeclaration {
  id: number
  trackingCode: string
  status: { id: number; name: string }
  createdAt: string
}
```

### Containers / Pages
- `UnknownDeclarationsTable` + `UnknownDeclarationsActionBar` (bulk cancel from selected rows)
- `UnknownDeclarationDetail` modal — shows info, accept/cancel single
- `UnknownDeclarationsPage` — composes table + action bar
- Add `unknowns` and `unknowns/:id` to `declarations/router/page.router.tsx`

---

## 3. Declarations — Partner Declarations Page

### Route
- `/declarations/partners` — list page (read-only)

### Service Method
```
GET /api/admin/declaration/partner_declarations  → paginated list
```

### Interface
```ts
IPartnerDeclaration {
  id: number
  trackingCode: string
  user: { id: number; name: string }
  status: { id: number; name: string }
  createdAt: string
}
```

### Containers / Pages
- `PartnerDeclarationsTable` + `PartnerDeclarationsActionBar`
- `PartnerDeclarationsPage`
- Add `partners` route to `declarations/router/page.router.tsx`

---

## 4. Declarations — Handover Modals

Two separate modal routes accessible from the main declarations page action bar.

### 4a. Pay Modal (`/declarations/:id/pay`)

```
POST /api/admin/declaration/pay
Body: declaration_id[], amount, payment_type_id, cashbox_id
```

- Fetches declaration info first (`GET /api/admin/declaration/pay?declaration_id[]=…`)
- Form: amount (₼), payment type (select), cashbox (select)
- Supports single and comma-separated multi-id from URL params

### 4b. Bulk Handover Modal (`/declarations/handover`)

```
POST /api/admin/declaration/handover
Body: state_id, tariff_category_id
```

- Form fields: state (static select: 5/7/8/9/10), tariff category (from `/api/admin/tariff/category_list`)
- Triggered from action bar when ≥1 rows are selected

### Containers / Pages
- `PayDeclarationModal` — container + modal route at `declarations/:id/pay`
- `BulkHandoverModal` — container + modal route at `declarations/handover`
- Add both to `declarations/router/modal.router.tsx`
- Add action bar buttons to trigger them

---

## 5. Flights — Close Flight Modal

### Route
- `/flights/:id/close/:type` — modal overlaying flight detail
- `type`: `with-dispatch` | `without-dispatch` | `all`

### Service Method
```
POST /api/admin/flights/close?close=true
Body (FormData): flight_id, airWaybill, depesh (0=without, 1=with, 2=all), limit
```

### Changes to `flight-details.tsx`
Add "Uçuşu bağla" Dropdown (visible when `data.status.id === 29`):
```
Menu items:
  Depeşli     → navigate to /flights/:id/close/with-dispatch
  Depeşsiz    → navigate to /flights/:id/close/without-dispatch
  Hamısı      → navigate to /flights/:id/close/all
```

### Close Flight Modal Container
- `CloseFlightModal` — reads `:id` and `:type` from URL params
- Form: airWaybill (text input), packagingLimit (integer input, default `100`)
- On success: navigate back to `/flights/:id`, show message

### Files
- `flights/containers/close-flight-modal.tsx` (new)
- `flights/services/index.ts` — add `closeFlight` method
- `flights/router/modal.router.tsx` — add `close/:type` route
- `flights/containers/flight-details.tsx` — add dropdown button

---

## 6. Users — Permissions Modal

### Route
- `/users/:id/permissions` — modal overlaying the user list or user detail

### Service Methods
```
GET  /api/admin/operations                                  → all operations grouped by model
GET  /api/admin/permissions?user_id={id}                   → user's current permission IDs + company_id
POST /api/admin/permissions/edit                            → save
Body (FormData flat): user_id, operation_id[], cashbox_id?, admin_branch_id?
```

### Interface
```ts
IOperation { id: number; name: string; codeName: string }
IOperationGroup { id: number; name: string; operations: IOperation[] }

IUserPermissions {
  permissionIds: number[]
  companyId: number
}
```

### Container: `UpdateUserPermissionsModal`
- Fetches operations + current user permissions in parallel
- Shows groups as Cards in a masonry-style grid
- Each operation: label + Switch
- Cashbox Select (from `/api/admin/cashboxes?per_page=1000`)
- Branch Select (from `/api/admin/admin_branches?per_page=1000`)
- On submit: POST to `/api/admin/permissions/edit`

### Files
- `users/services/index.ts` — add `getOperations`, `getUserPermissions`, `updateUserPermissions`
- `users/hooks/userPermissions/` subfolder — `use-user-permissions.ts`
- `users/containers/update-user-permissions-modal.tsx`
- `users/router/modal.router.tsx` — add `permissions` route
- `users/containers/users-table.tsx` or action bar — add "İcazələr" button per row

---

## Architecture Notes

- All new hooks follow camelCase subfolder naming: `customsTasks/`, `unknownDeclarations/`, `partnerDeclarations/`, `userPermissions/`
- All hooks inside subfolders use `../../` import depth to reach module root
- All new pages lazy-loaded via `React.lazy()` in routers
- Services return `ApiResult<200, T> | ApiResult<400|422, string>`
- Modal routes registered in each module's `modal.router.tsx`
