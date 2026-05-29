# Migration Progress & Handoff — delivery_management → delivery_management_new

**Date:** 2026-05-29
**Scope:** Completing the modules that were missing pages/actions vs. the old `@next` architecture.

---

## Architecture recap (how each module is built)

Mirror of existing complete modules (e.g. `cargoes`). Per module under `src/modules/<name>/`:

- `services/index.ts` — static object with methods returning `ApiResult` via `caller`/`urlMaker`. Business logic/endpoints/field names come from `../delivery_management/src/@next/modules/<name>` (repos + mappers).
- `interfaces/index.ts` — domain types.
- `context/index.ts` — `createNextTableContext()` per table.
- `use-cases/*-table-fetch.ts` — `(params) => async (dispatch) => {...}` for `NextTableProvider onFetch`. Factory form `(args) => (params) => async dispatch` when the fetch needs params (id/view/type); remount the provider with `key=`.
- `hooks/<camelCaseSubfolder>/` — table columns, table hook (handles `reFetch<X>Table` search param), detail/form hooks. Barrel at `hooks/index.ts`.
- `containers/` — table, action-bar (uses `HeadPortal` + `StyledActionBar` + `StyledHeaderButton`), modals/forms.
- `pages/index.tsx` (or named files) — compose `NextTableProvider` + `PageContent $contain`.
- `router/page.router.tsx` (default export) — wired in `src/modules/home/router/index.tsx`.
- `router/modal.router.tsx` (default export) — wired in `src/router/main.tsx` (background-route overlay).

**Shared helpers:** `useBackgroundNavigate`, `useCloseModal`, `useSearchParams` (`@shared/hooks`); `localURLMaker` (`@shared/utils`); `Constants.DATE_TIME` (`@shared/constants`); form fields `@shared/modules/form/fields/{text,select,textarea,date,multi-upload}`; `BarcodeScan` (`@shared/components/barcode-scan` — created this session); `MeContext.can(permission)` for permission gating.

**Verify after each module:** `npx tsc --noEmit --skipLibCheck -p tsconfig.json` → expect 0 `^src/` errors. (Plain tsc without skipLibCheck shows unrelated `@ant-design/pro-form` lib noise — ignore.)

---

## ✅ Completed this session (compile clean, 0 src TS errors)

| Module | What was added |
|---|---|
| **united-returns** | service (`getById`, `create`+label, `changeStatus`, `finish`); create/edit modal; execution page (barcode scan, transfer toggle, finish); table edit action; action-bar Yeni + Göndəriş icrası; modal router → `main.tsx` |
| **branch-inspections** | service (`getById`, `create`, `changeStatus`, `getScans`, `scanTrackingCode`, `getReport`, `exportReport`); create modal; details modal; report modal (stats/progress/excel); scan page `:id/scan` (queue+retry+finish); table actions; modal router → `main.tsx` |
| **supports** | service (`getById`, `create`, `createMessage`, `deleteMessage`, `toggleRead`, `getCategories`, `createCategory`, `getMessageTemplates`, `getSelectUsers`); chat/inbox details page `:id`; categories modal; create modal; table Bax action; modal router → `main.tsx`. **Note:** user-select maps `name`/`surname` (not firstname/lastname); emoji-mart + status-history omitted (not available) |
| **sorting** | built from scratch — list + flight filter; details `:id` (transfer info + flights + declarations sub-table with total/another/missing views + remove); non-sorted `:flightId/non-sorted-declarations`; acceptance `/acceptance` (branch+flights create, barcode add/remove/truncate); wired into home router |
| **box-transfers** | reworked as `:id/:type` history (endpoint varies by type: branch→`containers-transfers`, declaration→`/by-declaration`, container→`/by-container`; filter key `branch_id`/`declaration_id`/`container_id`); page reads params; route added |
| **warehouse** | added `getHandoverQueue` (`/handover/info`), `removeHandoverQueueItem` (`/handover/cancelitem`); detail hook `use-handover-queue`; history page (`handover/history`, fetch forces `state_id=43`); queue-details page (`handover/queues/:queueId`, boxes+items, cancel/handover/remove-item); nav menu Təhvil/Tarixçə in action bar; table Ətraflı action; router updated |

---

## 🟡 In progress — orders (NOT finished)

Orders is still **list-only**. Missing pages: **`:id` detail** and **`:id/timeline`**.

Source already read; here's everything needed to finish:

**Endpoints (old `@next/modules/orders/repos`):**
- detail: `GET /api/admin/orders/info?order_id=<id>` → `IDetailedOrder` (persistence adds `debts[]`)
- status timeline/execution: `GET /api/admin/orders/getstates?order_id=<id>` → `IStatusExecution[]` (fields: `id`, `ref.name`, `executor?.name`, `createdAt`, `isCurrent`)
- change status: already in new service `changeStatus` (`/api/admin/orders/edit/state`)
- cancel/delete: already in new service `cancel`
- read toggle: `POST /api/admin/isnew { model_id:1, object_id:ids, is_new }`

**`IOrder` already exists** in new `interfaces/index.ts`. Need to add `IDetailedOrder` (adds `detailedDebts[]`: `{id,param,amount:{current,difference},status:{id,name},description,createdAt}`).

**To do:**
1. service: add `getById(id)` (`/orders/info`, map persistence → `IDetailedOrder`, including `debts[]`→`detailedDebts`), `getStates(id)` (`/orders/getstates`).
2. hook: `use-order(id)` (react-query) + `use-order-timeline(id)`.
3. containers/pages: `order-details.tsx` (`:id`) — header (#trackCode, user, country/state tags, edit/timeline/delete), status-change dropdown (statuses model_id=1), general/payment/product cards, debts table, description/rejection. `order-timeline.tsx` (`:id/timeline`) — antd `Steps` vertical from getStates.
4. router page.router: add `:id` and `:id/timeline`.
5. (optional) create-order + reject-order modals exist in old as modal routes — were **not** flagged by the route audit as missing pages; treat as separate follow-up.

Old detail uses `@core/ui Details.*`, `getCurrencySymbolByCountryId`, `CountryTag`, `OrderStateTag`, `CouponTags` — replace with plain antd `Card`/`Descriptions`/`Tag` (as done for branch-inspections details/report). Currency symbol: small local helper by `countryId` or just omit symbol.

---

## ⛔ Not started

### couriers — missing pages
Current: list, `create`, `deliverer-assignments`. Missing:
- `:id` detail, `:id/assign-deliverer`, `:id/handover`, `:id/timeline`, `deliverer-assignments/cancel`
- Source: `../delivery_management/src/@next/modules/couriers` (repos for endpoints, containers/pages for UI). Not yet read.

### statistics — largest remaining
Current: only `declarations/by-status`, `orders/by-status`, `transactions/by-user` (3 of ~30).
Missing ~25 dashboards (couriers counts/by-regions, users counts/general, plans, qizil-onluq, cashflow-transactions, transactions balances/payment-types/payment-counts, status declaration/order counts, orders by-admin, etc.).
- Source: `../delivery_management/src/@next/modules/statistics`. Each dashboard = a page + chart/table + a stats endpoint under `/api/admin/statistics/...`. Not yet read. Recommend doing in batches by area (orders, declarations, couriers, users, transactions, cashflow).

---

## Wiring reference
- **Page routers:** `src/modules/home/router/index.tsx` (`lazy(() => import('../../<m>/router/page.router'))` + `<Route path='/<m>/*' .../>`). All five target modules already had/have their route entries.
- **Modal routers:** `src/router/main.tsx` (second `<Routes>` block). united-returns, branch-inspections, supports added there this session.

## Open verification caveats (inferred field names — confirm vs API when testing)
- `/api/admin/flights/select` (sorting flight filter/select) shape `{id, flight_name}` assumed.
- sorting in/out detail split simplified to a single "missing" view (`/sorting/missing_declarations`).
- warehouse history = `state_id=43` filter assumption.
- box-transfers `meta.total` vs `total` handled with fallback.
