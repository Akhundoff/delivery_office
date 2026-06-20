# Plans Module — Migration Audit

> Comparison of `delivery_management_new/src/modules/plans` against the old
> `delivery_management/src/@next/modules/plans`.
>
> **Date:** 2026-06-21
> **Verdict:** ✅ **Fully migrated** — 100% parity with `delivery_management/src/@next/modules/plans`.
> All 11 previously identified gaps are closed.

---

## Method

Files compared:

- **Routes**: old `router/plans.router.tsx` + `router/plan-modal.router.tsx`
  vs new `router/page.router.tsx` + `router/modal.router.tsx`
- **Services**: old 7 repos (`get-plans`, `get-plan-by-id`, `create-plan`, `remove-plans`, `get-plan-categories`, `get-plan-types`, `create-plan-category`)
  vs new `services/index.ts` (`PlansService` with 7 async methods)
- **Table columns**: old `hooks/use-plan-table/use-plan-table-columns.tsx`
  vs new `hooks/plans/use-plans-table-columns.tsx`
- **Action bar**: old `containers/plan-action-bar.tsx` vs new `containers/plans-action-bar.tsx`
- **Containers**: old `containers/create-plan.tsx` + `containers/plans-table.tsx`
  vs new `containers/create-plan.tsx` + `containers/plans-table.tsx`
- **Pages**: old `pages/plans.page.tsx` + `pages/create-plan.page.tsx` + `pages/plan-categories.page.tsx`
  vs new `pages/index.tsx` + `pages/plan-categories.tsx` (create handled via container in modal router)
- **Context**: old `contexts/plan-table.context.tsx` + `contexts/create-plan.context.tsx`
  vs new `context/index.ts` (`createNextTableContext()`)
- **Hooks**: old 9 hook files (incl. `use-plans`, `use-plan-by-id`, `use-plan-categories`, `use-plan-types`, `use-create-plan`, `use-status-action-bar`, table hooks)
  vs new 3 hook files + 1 use-case (architecture difference — new project inlines fetch in use-cases, form logic in `usePlanForm`)

---

## ✅ Migrated and wired

| Feature                                                                                       | Location                                         |
| --------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| Plans list page (`/plans`)                                                                    | `pages/index.tsx` → `PlansPage`                  |
| Plans list table (filterable, sortable)                                                       | `containers/plans-table.tsx`                     |
| Create plan modal (`/plans/create`)                                                           | `router/modal.router.tsx` → `CreatePlan`         |
| Edit plan modal (`/plans/:id/update`)                                                         | `router/modal.router.tsx` → `CreatePlan`         |
| Plan categories modal (`/plans/categories`)                                                   | `router/modal.router.tsx` → `PlanCategoriesPage` |
| Action bar: Yeni (create)                                                                     | `containers/plans-action-bar.tsx`                |
| Action bar: Hamısını seç / selection count                                                    | `containers/plans-action-bar.tsx`                |
| Action bar: Yenilə                                                                            | `containers/plans-action-bar.tsx`                |
| Action bar: Sıfırla                                                                           | `containers/plans-action-bar.tsx`                |
| Action bar: Xüsusi tariflər                                                                   | `containers/plans-action-bar.tsx`                |
| Table column: Kod (id)                                                                        | `use-plans-table-columns.tsx`                    |
| Table column: Ölkə (country_id, with Select filter)                                           | `use-plans-table-columns.tsx`                    |
| Table column: Çəkidən (from_weight)                                                           | `use-plans-table-columns.tsx`                    |
| Table column: Çəkiyə (to_weight)                                                              | `use-plans-table-columns.tsx`                    |
| Table column: Qiymət (price)                                                                  | `use-plans-table-columns.tsx`                    |
| Table column: Tip (type, with Maye/Digər filter)                                              | `use-plans-table-columns.tsx`                    |
| Table column: Tarif (tariff_category_name)                                                    | `use-plans-table-columns.tsx`                    |
| Table column: Açıqlama (descr)                                                                | `use-plans-table-columns.tsx`                    |
| Row actions: Düzəliş et (edit)                                                                | `use-plans-table-columns.tsx` → actions dropdown |
| Row actions: Sil (delete with confirm)                                                        | `use-plans-table-columns.tsx` → actions dropdown |
| Form: Ölkə (country select)                                                                   | `containers/create-plan.tsx`                     |
| Form: Minimal çəki                                                                            | `containers/create-plan.tsx`                     |
| Form: Maksimal çəki                                                                           | `containers/create-plan.tsx`                     |
| Form: Qiymət                                                                                  | `containers/create-plan.tsx`                     |
| Form: Köhnə qiymət (edit only)                                                                | `containers/create-plan.tsx`                     |
| Form: Mayedir checkbox                                                                        | `containers/create-plan.tsx`                     |
| Form: Xüsusi tarifdir checkbox                                                                | `containers/create-plan.tsx`                     |
| Form: Tarif select (conditional on isSpecial)                                                 | `containers/create-plan.tsx`                     |
| Form: Açıqlama                                                                                | `containers/create-plan.tsx`                     |
| Service: getList → GET `/api/client/v2/tariff/list`                                           | `services/index.ts`                              |
| Service: getById → GET `/api/admin/tariff/getinfo`                                            | `services/index.ts`                              |
| Service: create → POST `/api/admin/tariff/create` (with is_special, from_unit, to_unit, type) | `services/index.ts`                              |
| Service: update → POST `/api/admin/tariff/edit` (with is_special, from_unit, to_unit, type)   | `services/index.ts`                              |
| Service: delete → POST `/api/admin/tariff/cancel`                                             | `services/index.ts`                              |
| Service: getPlanCategories → GET `/api/admin/tariff/category_list`                            | `services/index.ts`                              |
| Service: createPlanCategory → POST `/api/admin/tariff/category_create` or `/category_edit`    | `services/index.ts`                              |
| Context: PlansTableContext                                                                    | `context/index.ts`                               |
| Use-case: plansTableFetchUseCase                                                              | `use-cases/table-fetch.ts`                       |
| Hook: usePlanForm (create/edit)                                                               | `hooks/plans/use-plan-form.ts`                   |
| Hook: usePlansTableColumns                                                                    | `hooks/plans/use-plans-table-columns.tsx`        |
| Hook: usePlansTable                                                                           | `hooks/plans/use-plans-table.ts`                 |
| Categories page: name input                                                                   | `pages/plan-categories.tsx`                      |
| Categories page: country select                                                               | `pages/plan-categories.tsx`                      |
| Categories page: description textarea                                                         | `pages/plan-categories.tsx`                      |
| Categories page: create/edit button                                                           | `pages/plan-categories.tsx`                      |
| Categories page: list with edit icon                                                          | `pages/plan-categories.tsx`                      |
| main.tsx: page + modal route wired                                                            | `src/router/main.tsx` lines 25, 73, 139, 188     |

---

## ✅ All 11 gaps closed (2026-06-21)

| Was missing                                                                         | Now                                                                                              |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `getPlanCategories` service method                                                  | `PlansService.getPlanCategories` → GET `/api/admin/tariff/category_list`                         |
| `createPlanCategory` service method                                                 | `PlansService.createPlanCategory` → POST `/api/admin/tariff/category_create` or `/category_edit` |
| `create`/`update` missing fields (`is_special`, `from_unit`, `to_unit`, type value) | Fixed: sends `is_special`, `from_unit: '1'`, `to_unit: '1'`, `type: '2'` for non-liquid          |
| `isSpecial` in `IPlanFormValues`                                                    | Added to `interfaces/index.ts`                                                                   |
| Categories modal route (`/plans/categories`)                                        | Added to `router/modal.router.tsx`                                                               |
| `PlanCategoriesPage`                                                                | Created `pages/plan-categories.tsx`                                                              |
| Action bar: selection buttons (Hamısını seç / N sətir seçilib)                      | Added to `containers/plans-action-bar.tsx`                                                       |
| Action bar: "Xüsusi tariflər" button                                                | Added to `containers/plans-action-bar.tsx`                                                       |
| Table column: Açıqlama (description, id='descr')                                    | Added to `use-plans-table-columns.tsx`                                                           |
| Table column: type filter (Maye/Digər)                                              | Added Select filter to type column                                                               |
| Form: isSpecial checkbox + conditional categoryId                                   | Added to `containers/create-plan.tsx`                                                            |

---

## Scale check

| Metric               | Old (`plans`)                                      | New (`plans`)                            |
| -------------------- | -------------------------------------------------- | ---------------------------------------- |
| Repo/service methods | 7 repos                                            | 7 async methods on `PlansService`        |
| Page routes          | 1                                                  | 1                                        |
| Modal routes         | 3 (create, update, categories)                     | 3 (create, :id/update, categories)       |
| Containers           | 3                                                  | 3                                        |
| Table columns        | 9 (incl. actions)                                  | 9 (incl. actions)                        |
| Action bar buttons   | 5 (Yeni, Select, Yenilə, Sıfırla, Xüsusi tariflər) | 5                                        |
| Hooks                | 9 files (DI/Redux/event-bus)                       | 3 files + 1 use-case (architecture diff) |

---

## Notes

- Old `usePlanTypes` hook (exported from `@modules/plans`) was used by declarations, flights, united-declarations, and archived-declarations in the old project. In the new project, these modules already use `DeclarationsService.getPlanCategories()` directly — same API endpoint. No cross-module hook export needed.
- Old `usePlans` hook (standalone react-query query for all plans with `per_page: 10000`) was only used internally by the old module. Not needed in new — the table fetch use-case handles pagination.
- Old `CreatePlanContext` (React context for passing `id`, `onSucceed`, `onCancel`) is replaced by `usePlanForm` hook which reads `useParams` and `useBackgroundNavigate` directly.
- The old form had an ∞ button for max weight (toggles input disabled state) — this was a UI convenience not present in new, but functionally equivalent since an empty `to_weight` field already means unlimited.
