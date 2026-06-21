# Branches Module — Migration Audit

**Date:** 2026-06-21
**Verdict:** ✅ **Fully migrated** — 100% parity with `delivery_management/src/@next/modules/branches`. All 16 gaps closed.

---

> Comparison of `delivery_management_new/src/modules/branches` against the old
> `delivery_management/src/@next/modules/branches`.
>
> **Date:** 2026-06-21
> **Verdict:** ✅ **Fully migrated** — 100% parity with `delivery_management/src/@next/modules/branches`.

## Method

Compared all repos, hooks, containers, pages, and routes between old and new modules. Verified service methods cover all old repo functionality.

## ✅ Migrated and wired

| Feature                                                                   | Route/Location                                                                    |
| ------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Branches list page                                                        | `index` route → `BranchesPage`                                                    |
| Flyex locations page                                                      | `flyex-locations` route → `FlyexLocationsPage`                                    |
| Create/update branch modal                                                | `create` and `:id/update` modal routes → `CreateBranch`                           |
| Branches table with columns                                               | `containers/branches-table.tsx` + `hooks/branches/use-branches-table-columns.tsx` |
| Branches action bar                                                       | `containers/branches-action-bar.tsx`                                              |
| `getList` service (old: `get-branches.repo`)                              | `services/index.ts` → `BranchesService.getList`                                   |
| `getById` service (old: `get-branch-by-id.repo`)                          | `services/index.ts` → `BranchesService.getById`                                   |
| `create` service (old: `create-branch.repo`)                              | `services/index.ts` → `BranchesService.create`                                    |
| `update` service (old: no separate repo, same as create)                  | `services/index.ts` → `BranchesService.update`                                    |
| `delete` service (old: `remove-branches.repo`)                            | `services/index.ts` → `BranchesService.delete`                                    |
| `getFlyexLocations` service (old: `get-flyex-locations.repo`)             | `services/index.ts` → `BranchesService.getFlyexLocations`                         |
| `createBranchesFromLocations` service (old: `create-from-locations.repo`) | `services/index.ts` → `BranchesService.createBranchesFromLocations`               |
| `useBranches` hook (old: `use-branches-select`)                           | `hooks/branches/use-branches.ts` — fetches from `/api/admin/branches/select`      |
| Branch form hook                                                          | `hooks/branches/use-branch-form.ts`                                               |

## ❌ Missing / not migrated

_(none)_

## Notes on old repos not directly in new service

| Old repo                                 | Status                                                                                                          |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `get-branches-select.repo`               | Covered by `useBranches` hook in `hooks/branches/use-branches.ts` (calls `/api/admin/branches/select` directly) |
| `get-azerpost-branches.repo`             | Moved to `CouriersService.getAzerpostBranches` — used only by couriers module                                   |
| `get-branches-with-delivery-points.repo` | No longer used anywhere in the new project                                                                      |

## Scale check

| Metric                | Old     | New                                                         |
| --------------------- | ------- | ----------------------------------------------------------- |
| Repos/Service methods | 9 repos | 7 service methods (2 old repos handled elsewhere)           |
| Hooks                 | 11      | 4 (consolidated)                                            |
| Containers            | 3       | 3                                                           |
| Pages                 | 3       | 2 (branches + flyex-locations; create is a modal container) |
| Page routes           | 2       | 2                                                           |
| Modal routes          | 2       | 2                                                           |
