# Couriers Module — Migration Audit

> Comparison of `delivery_management_new/src/modules/couriers` against the old
> `delivery_management/src/@next/modules/couriers`.
>
> **Date:** 2026-06-20
> **Verdict:** ✅ **Fully migrated** — 100% parity with `delivery_management/src/@next/modules/couriers`.
> All 36 previously identified gaps are closed.

---

## Method

Files compared:

- **Routes**: old `router/couriers.router.tsx` + `router/couriers-modal.router.tsx`
  vs new `router/page.router.tsx` + `router/modal.router.tsx`
- **Services**: old `repos/index.ts` (22 repo re-exports) vs new `services/index.ts`
  (`CouriersService` with 22 async methods)
- **Table columns**: old `hooks/use-couriers-table/use-couriers-table-columns.tsx`
  vs new `hooks/couriers/use-couriers-table-columns.tsx`
- **Action bars**: old `containers/couriers-action-bar.tsx` + `containers/deliverer-assignments-action-bar.tsx`
  vs new equivalents
- **Detail page**: old `containers/courier-details.tsx` vs new `containers/courier-detail.tsx`
- **Create/Edit form**: old `containers/create-courier.tsx` vs new equivalent

---

## ✅ Migrated and wired

| Feature                                                                              | Location                                       |
| ------------------------------------------------------------------------------------ | ---------------------------------------------- |
| Couriers list (table, filters, pagination)                                           | `/couriers`                                    |
| Courier detail page (general info, payments, declarations list, azerpost section)    | `/couriers/:id`                                |
| Create courier (modal form)                                                          | `couriers/create`                              |
| Edit courier (modal form, pre-filled from `getById`)                                 | `couriers/:id/update`                          |
| Handover courier (payment details + amount form)                                     | `couriers/:id/handover`                        |
| Assign deliverer (select from warehouseman users)                                    | `couriers/:id/assign-deliverer`                |
| Cancel deliverer assignment (select reason)                                          | `couriers/deliverer-assignments/cancel`        |
| Courier timeline / status map (modal)                                                | `couriers/:id/timeline`                        |
| Deliverer assignments sub-page (table, filters, export)                              | `couriers/deliverer-assignments`               |
| Row menu: Ətraflı bax, Düzəliş et                                                    | navigates to detail / edit                     |
| Row menu: Təhvil ver                                                                 | `/couriers/:id/handover`                       |
| Row menu: Təhvil sənədi (print)                                                      | `window.open` handing URL with auth token      |
| Row menu: Status xəritəsi                                                            | `/couriers/:id/timeline`                       |
| Row menu: Oxunmuş et / Oxunmamış et                                                  | `CouriersService.updateRead`                   |
| Row menu: Status dəyiş submenu                                                       | `CouriersService.changeStatus`                 |
| Row menu: Sil (gated by `deletecourier` permission)                                  | `CouriersService.cancel`                       |
| Action bar (no selection): Toplu status dəyiş (filter-based)                         | `CouriersService.bulkChangeStatus`             |
| Action bar (no selection): Təhvil sənədi print                                       | `window.open` handing URL                      |
| Action bar (no selection): Azərpoçt sənədi print                                     | `window.open` azerpost handing URL             |
| Action bar (no selection): Excel export                                              | `CouriersService.getExcel`                     |
| Action bar (selection): Təhkim et (assign deliverer)                                 | `/couriers/:ids/assign-deliverer`              |
| Action bar (selection): Statusu dəyiş (filtered: no 13/14)                           | `CouriersService.changeStatus`                 |
| Action bar (selection): Azərpoçt dropdown                                            | create / delete / paid / unpaid                |
| Action bar (selection): Təhvil ver                                                   | `/couriers/:ids/handover`                      |
| Action bar (selection): Sil                                                          | `CouriersService.cancel`                       |
| Detail: Statusu dəyiş dropdown                                                       | `CouriersService.changeStatus` + refetch       |
| Detail: Full declaration item cards                                                  | `IDetailedCourier.declarations.items[]`        |
| Detail: Azerpost info + history section                                              | `IDetailedCourier.azerpost?`                   |
| Create form: Azerpost branch + documentNumber (when shipping=1)                      | `CouriersService.getAzerpostBranches`          |
| Create form: Courier cost display                                                    | `CouriersService.getCourierCost`               |
| Deliverer assignments action bar: Təhvil sənədi print                                | `window.open` handing URL                      |
| Deliverer assignments action bar: Excel export, selection, remove                    | `CouriersService.getDelivererAssignmentsExcel` |
| Status tag: colored by status ID (11=red, 12=orange, 13=blue, 14=green)              | `CourierStateTag` component                    |
| Table columns: status filter, Azerpost checkbox, Azərpoçt Filial, Filial, courier ID | all wired                                      |

---

## ✅ All 36 gaps closed (2026-06-20)

| Was missing                                                      | Now                                                                                  |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `updateRead` service method                                      | `CouriersService.updateRead` → `POST /api/admin/isnew`                               |
| `bulkChangeStatus` service method                                | `CouriersService.bulkChangeStatus` → `POST /api/admin/v2/couriers/edit/state`        |
| `azerpostChangeStatus`                                           | `CouriersService.azerpostChangeStatus` → `POST /api/admin/azerpost/status`           |
| `azerpostCreate`                                                 | `CouriersService.azerpostCreate` → `POST /api/admin/azerpost/create`                 |
| `azerpostDelete`                                                 | `CouriersService.azerpostDelete` → `POST /api/admin/azerpost/delete`                 |
| `getAzerpostBranches`                                            | `CouriersService.getAzerpostBranches` → `GET /api/client/azerpost/branches`          |
| `getCourierCost`                                                 | `CouriersService.getCourierCost` → `GET /api/admin/couriers/get_courier_cost`        |
| `getPriceExcel`                                                  | `CouriersService.getPriceExcel` → `GET /api/admin/couriers/courier_price`            |
| `IDetailedCourier`, `IAzerpostBranch`, `ICourierCost` interfaces | Added to `interfaces/index.ts`                                                       |
| `getById` returning list type                                    | Now maps to `IDetailedCourier` with declarations.items + azerpost                    |
| `':id/update'` modal route missing                               | Added to `router/modal.router.tsx`                                                   |
| `CourierStateTag` component                                      | Created `components/courier-state-tag.tsx`                                           |
| Row menu: 6 missing items                                        | Düzəliş et, Təhvil ver, Təhvil sənədi, Status xəritəsi, toggle read, permission gate |
| Table: status dropdown filter                                    | Added to state_id column                                                             |
| Table: Kuryer kodu column                                        | `id: 'id'` column added                                                              |
| Table: Azerpost checkbox column                                  | `id: 'is_azerpost'` + `NextTableCheckboxFilter`                                      |
| Table: Azərpoçt Filial column                                    | `id: 'branch_index'` + branches filter                                               |
| Table: Filial column                                             | `id: 'branch_id'` + branches filter                                                  |
| Action bar: 8 missing buttons                                    | Toplu status, handing prints, assign, azerpost, handover, delete selection           |
| Detail page: Statusu dəyiş dropdown                              | `useCourierDetail` now exposes `statuses` + `updateStatus`                           |
| Detail page: declaration items                                   | Full `IDetailedCourier.declarations.items[]` cards                                   |
| Detail page: azerpost section                                    | Rendered when `data.azerpost` is present                                             |
| Create form: edit mode                                           | Reads `id` from URL params, pre-fills from `getById`                                 |
| Create form: azerpost branch + documentNumber                    | Shown when `selectedRegion.shipping === 1`                                           |
| Create form: courier cost display                                | `getCourierCost` result shown below form                                             |
| Deliverer assignments action bar: Təhvil sənədi                  | `window.open` handing URL with token                                                 |

---

## Scale check

| Metric               | Old (`couriers`)                                          | New (`couriers`)                                       |
| -------------------- | --------------------------------------------------------- | ------------------------------------------------------ |
| Repo/service methods | 22 repo re-exports                                        | 22 async methods on `CouriersService`                  |
| Modal routes         | 5                                                         | 6 (+ `:id/update`)                                     |
| Page routes          | 3                                                         | 3                                                      |
| Containers           | 10                                                        | 10                                                     |
| Table columns        | 13 (main), 6 (assignments)                                | 14 (main), 6 (assignments)                             |
| Hooks (subfolders)   | `use-couriers-table/`, `use-deliverer-assignments-table/` | `couriers/`, `courierDetail/`, `delivererAssignments/` |
