# Sorting Module — Migration Audit

> Comparison of `delivery_management_new/src/modules/sorting` against the old
> `delivery_management/src/@next/modules/sorting`.
>
> **Date:** 2026-06-21
> **Verdict:** ✅ **Fully migrated** — 100% parity with `delivery_management/src/@next/modules/sorting`.
> All 12 previously identified gaps are closed.

---

## Method

Files compared:

- **Routes**: old `router/sorting.router.tsx` + `router/sorting-modal.router.tsx`
  vs new `router/page.router.tsx` + `router/modal.router.tsx`
- **Services**: old repos (`get-sortings`, `get-sorting-by-id`, `create-sorting`, `add-to-transfer`, `remove-from-transfer`, `truncate-transfer`, `get-transfer-info`, `send-transfer`, `get-non-sorted-declarations`, `get-sorting-declarations`, `get-another-declarations`, `get-missing-declarations`, `get-select-flights`)
  vs new `services/index.ts` (`SortingService` with matching static methods)
- **Table columns**: old `hooks/use-sorting-table/use-sorting-table-columns.tsx` + `use-non-sorted-declarations-table-columns.tsx` + `use-sorting-declarations-table-columns.tsx`
  vs new `hooks/sorting/use-sortings-table-columns.tsx` + `use-non-sorted-declarations-table-columns.tsx` + `use-sorting-declarations-table-columns.tsx`
- **Action bar**: old `containers/sorting-action-bar.tsx` vs new `containers/sortings-action-bar.tsx`
- **Containers**: old `containers/sorting-table.tsx` + `containers/sorting-details.tsx` + `containers/branch-transfer-acceptance.tsx` + `containers/non-sorted-declarations-table.tsx` + `containers/sorting-info-modal.tsx`
  vs new equivalents in `containers/`
- **Hooks**: old hooks for branch-transfer-acceptance, select-flights, table columns
  vs new `hooks/sorting/` with matching hooks
- **Templates**: old print check template vs new `templates/check.hbs`

---

## ✅ Migrated and wired

| #   | Feature                                                                                                                                                                                             | Route / Location                                                             |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| 1   | Sortings list page                                                                                                                                                                                  | `/sorting` → `pages/index.tsx`                                               |
| 2   | Sorting details page                                                                                                                                                                                | `/sorting/:id` → `pages/sorting-details.tsx`                                 |
| 3   | Branch transfer acceptance page                                                                                                                                                                     | `/sorting/acceptance` → `pages/branch-transfer-acceptance.tsx`               |
| 4   | SortingInfo modal (transfer summary + send)                                                                                                                                                         | `/sorting/:id/info` → `containers/sorting-info-modal.tsx`                    |
| 5   | Sortings table with double-click navigation                                                                                                                                                         | `containers/sortings-table.tsx`                                              |
| 6   | Sortings action bar (create, select all, refresh, reset, flight filter)                                                                                                                             | `containers/sortings-action-bar.tsx`                                         |
| 7   | Non-sorted declarations table with selection + total                                                                                                                                                | `containers/non-sorted-declarations-table.tsx`                               |
| 8   | Sorting declarations table with remove action                                                                                                                                                       | `containers/sorting-declarations-table.tsx`                                  |
| 9   | Branch filter on sortings table                                                                                                                                                                     | `hooks/sorting/use-sortings-table-columns.tsx` — Select with `useBranches()` |
| 10  | Status filter on sortings table (model_id=46)                                                                                                                                                       | `hooks/sorting/use-sortings-table-columns.tsx` — Select with `useQuery`      |
| 11  | Declaration status filter (model_id=2) + sorting status filter (model_id=47)                                                                                                                        | `hooks/sorting/use-sorting-declarations-table-columns.tsx`                   |
| 12  | Branch filter on non-sorted declarations                                                                                                                                                            | `hooks/sorting/use-non-sorted-declarations-table-columns.tsx`                |
| 13  | Print sorting check (handlebars template)                                                                                                                                                           | `templates/check.hbs` + row menu "Etiket çap et"                             |
| 14  | Row menu: details → azeriexpress → flyex → edit → print                                                                                                                                             | `hooks/sorting/use-sortings-table-columns.tsx`                               |
| 15  | 4 radio views: total / another / sorting / missing                                                                                                                                                  | `containers/sorting-details.tsx`                                             |
| 16  | `SortingDeclarationsView` includes `'sorting'` variant                                                                                                                                              | `interfaces/index.ts` + `use-cases/table-fetch.ts`                           |
| 17  | Selection UI in sortings action bar                                                                                                                                                                 | `containers/sortings-action-bar.tsx`                                         |
| 18  | Flight Select outside HeadPortal                                                                                                                                                                    | `containers/sortings-action-bar.tsx`                                         |
| 19  | Column order: user_id → user_name → track_code → branch_id                                                                                                                                          | `hooks/sorting/use-non-sorted-declarations-table-columns.tsx`                |
| 20  | openSortingInfo uses background navigation to `/sorting/:id/info`                                                                                                                                   | `hooks/sorting/use-branch-transfer-acceptance.ts`                            |
| 21  | All service methods (getList, getById, create, addToTransfer, removeFromTransfer, truncateTransfer, getTransferInfo, send, getNonSorted, getDeclarations, getAnother, getMissing, getSelectFlights) | `services/index.ts`                                                          |

## ❌ Missing / not migrated

_(none)_

## Scale check

| Metric               | Old | New                                  |
| -------------------- | --- | ------------------------------------ |
| Service/repo methods | 13  | 13                                   |
| Hooks                | 5   | 5                                    |
| Page routes          | 3   | 3                                    |
| Modal routes         | 1   | 1                                    |
| Table column hooks   | 3   | 3                                    |
| Containers           | 6   | 7 (split sorting-info into own file) |
| Templates            | 1   | 1                                    |
