# Declarations Module — Migration Audit

> Comparison of `delivery_management_new/src/modules/declarations` against the old
> `delivery_management/src/@next/modules/declarations` (+ the old `archived-declarations`
> and `united-declarations` sibling modules).
>
> **Date:** 2026-06-02
> **Verdict:** ❌ **Not fully migrated.** Core flows are done; a significant set of
> secondary actions are missing or present only as non-wired (dead) stubs.

---

## Method

- Routes compared: old `router/declarations.router.tsx` + `router/declaration-modals.router.tsx`
  vs new `router/page.router.tsx` + `router/modal.router.tsx`.
- Services compared: old `repos/index.ts` (~50 repos) vs new `services/index.ts` (~25 methods).
- Actions compared: old `use-declaration-table-columns.tsx` + `declarations-action-bar.tsx`
  vs new equivalents and `containers/declaration-detail.tsx`.

---

## ✅ Migrated and wired

| Feature | Route |
|---|---|
| List | `/declarations` |
| Detail (edit, delete, linked orders, handover, return, cancel-dispatch, toggle-wanted, remove-from-container, remove-from-flight) | `/declarations/:id` |
| Create / Update declaration (modal) | `create`, `:id/update` |
| Pay (modal) — *new vs old* | `:id/pay` |
| Single handover (modal) | `:id/handover` |
| Bulk handover (modal) | `handover` |
| Return (modal) | `:id/return` |
| Deleted declarations | `deleted` |
| Post declarations | `post` |
| Unknown declarations (list + detail modal + accept/cancel) | `unknowns`, `unknowns/:id` |
| Partner declarations (+ Excel export) | `partners` |
| Archived declarations (folded in from old `archived-declarations` module) | `archived` |

Sibling modules split out cleanly as their own new modules: `united-declarations`,
`partner-box-acceptance`, `customs`.

---

## ❌ Missing / not migrated

| Feature | Old location | Status in new |
|---|---|---|
| ~~**Status change** (single: states 9/88/36/160 + **bulk** status update)~~ | row menu + action-bar dropdowns | ✅ **DONE** (2026-06-02) — see "Status change" below |
| ~~**Print: Waybill / Proforma / Handover doc**~~ | hbs templates + repos | ✅ **FIXED** — see "Resolved bugs" below |
| ~~**Declaration timeline**~~ | `:id/timeline` modal | ✅ **FIXED** — see "Resolved bugs" below |
| **Acceptance** (standard + box) | `/acceptance`, `/acceptance/box` action-bar | Absent from declarations action bar |
| **Import declarations (Excel)** | `import` modal | Absent |
| **Handover export** | `handover-export` | Absent |
| **Main-list Excel export** | `get-declarations-excel` | Absent (only *partner* list has `getExcel`) |
| **Create / Update unknown declaration** | create-unknown + `unknowns/:id/update` | Absent — new only **accepts/cancels** unknowns |
| **Stuck-at-customs** modal | `stuck-at-customs` | Absent (new `customs` module is a different feature: customs tasks/posts/DNS queues) |
| **Add commercial** | `add_commercial` | Absent (only an `isCommercial` form flag) |
| **Change pincode** (regular + Temu) | 2 repos | Absent |
| **Toggle / mark read** | `update-read` | Absent (`read` shown, not toggleable) |
| **Current-month declarations** | `users/:userId/current-month` | Absent |
| **Tiny declarations** | `get-tiny-declarations` | Absent |

---

## Resolved bugs ✅ (fixed 2026-06-02)

Both confirmed bugs are now fixed and the production build passes (`.hbs` templates
resolve via a webpack `asset/source` rule injected into CRA's `oneOf`).

### 1. Timeline button — was dead, now works
- **Was:** `declaration-detail.tsx` → `openTimeline` routed to `/declarations/:id/timeline`,
  which had no matching route → dead button.
- **Fix:**
  - `DeclarationsService.getStatusMap(id)` → `GET /api/client/get_status_map?model_id=2&object_id=:id`
  - `interfaces/status-map.interface.ts` (`IStatusMapItem` + persistence)
  - `hooks/declarationDetail/use-declaration-timeline.ts` (react-query fetch)
  - `containers/declaration-timeline.tsx` (antd `Modal` + vertical `Steps`, close via `navigate(-1)`,
    footer links to `/logs` and `/archive-status`)
  - Route `:id/timeline` added to `router/modal.router.tsx`

### 2. Print dropdown — was fully inert, now wired
- **Was:** "Çap et" dropdown's 4 items had zero `onClick` handlers.
- **Fix:**
  - Templates copied verbatim into `modules/declarations/templates/` (`waybill.hbs`,
    `proforma-invoice.hbs`, `handover.hbs`) + barrel
  - Build: `.hbs` imported as raw source (`config-overrides.js` → `asset/source` inside `oneOf`;
    `*.hbs` module decl in `react-app-env.d.ts`)
  - Service: `getWaybills(id)` → `/api/admin/declaration/manifesto`; `getProformaInvoice(ids)` →
    `/api/admin/declaration/proforma` (+ inline domain mappers, + `IWaybill`/`IProformaInvoice` interfaces)
  - `hooks/declarationDetail/use-print.ts` — `printWaybill`, `printProformaInvoice`, `printHandoverCheck`
    (handlebars compiled at runtime, `addOne`/`eq` helpers registered, opens print window). Warehouseman
    pulled from `MeContext`, date via `dayjs` + `Constants.DATE_TIME`.
  - Wired all 4 menu items: **Yol vərəqi** → waybill, **Proforma invoice** → proforma,
    **Təhvil sənədi** / **Təhvil sənədi (fərdi)** → handover check (single-declaration template fed the
    current declaration; the group item stays gated on `handoverTaskId`).

> **Note on handover check:** the old "Təhvil sənədi" pulled queue data from the warehouse
> handover-task; that warehouse print subsystem isn't migrated. Since `handover.hbs` renders a
> single declaration, both items now feed the current declaration — correct output, but the group
> variant does not yet aggregate the whole handover task. Revisit when the warehouse handover print
> is migrated.

---

## Status change ✅ (added 2026-06-02)

Both flavours of declaration status change are now implemented.

- **Service** (`services/index.ts`):
  - `getStatuses()` → `GET /api/admin/states/getlistbymodelid?model_id=2` (returns `{ id, name, freely }[]`)
  - `updateStatus(ids, statusId, descr?)` → `POST /api/admin/declaration/edit/state?declaration_id[]=…&state_id=…` (FormData `descr`) — explicit ids
  - `bulkUpdateStatus(query, statusId, descr?)` → `POST /api/admin/v2/declaration/edit/state?<filters>&new_state_id=…` — every declaration matching the current filters
- **Hook** `hooks/declarations/use-declaration-status-change.ts` — reads `DeclarationsTableContext`,
  exposes `freelyStatuses`, `updateStatus`, `updateSelectedStatus`, `bulkUpdateStatus` (each with an
  antd confirm + success/error toast + `handleFetch`/`handleResetSelection`).
- **Row menu** (`use-declarations-table-columns.tsx`): new **"Status dəyiş"** submenu with the 4
  quick states — 9 Yerli anbarda / 88 Gömrükdə saxlanılıb / 36 Gömrük rəsmiləşdirilməsi /
  160 Gömrük baxışı → `updateStatus([id], statusId)`.
- **Action bar** (`declarations-action-bar.tsx`): a status dropdown driven by `freelyStatuses` —
  **"Toplu status dəyiş"** (no selection → filter-based bulk) and **"Status dəyiş"** (with selection
  → selected ids).

> **Note:** the old app routed state `88` to a **stuck-at-customs** modal (collects a customs
> description). That modal isn't migrated, so `88` here performs a plain status change without the
> extra description prompt. Revisit when stuck-at-customs is migrated.

---

## Scale check

- Old module: **~50 repos**; new service: **~25 methods**.
- New list row menu = **Details / Edit / Delete only**. Old row menu also had handover,
  return, document, proforma, waybill, linked orders, timeline, read-toggle, status change.
  Most were consolidated into the detail page — but **status change, printing, read-toggle,
  and document-open exist nowhere** in the new module.

---

## Suggested priority for completing migration

1. ~~**Printing** (waybill / proforma / handover doc)~~ — ✅ done (2026-06-02)
2. ~~**Timeline**~~ — ✅ done (2026-06-02)
3. ~~**Status change** (single + bulk)~~ — ✅ done (2026-06-02)
4. **Acceptance** (standard + box), **Import** (Excel), **main-list Excel export**. **← next**
5. Create/update unknown, change pincode, add commercial, toggle-read, current-month, tiny.
6. Warehouse handover-check print (so the group "Təhvil sənədi" aggregates the full task).
7. Stuck-at-customs modal (so status `88` collects a customs description, as in the old app).
