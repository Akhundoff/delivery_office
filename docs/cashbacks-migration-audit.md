# Cashbacks Module — Migration Audit

> Comparison of `delivery_management_new/src/modules/cashbacks` against the old
> `delivery_management/src/@next/modules/cashback`.
>
> **Date:** 2026-06-21
> **Verdict:** ✅ **Fully migrated** — 100% parity with `delivery_management/src/@next/modules/cashback`.
> All 13 previously identified gaps are closed.

---

## Method

Files compared:

- **Routes**: old `router/cashback.router.tsx` + `router/statistics-modal.router.tsx`
  vs new `router/page.router.tsx` + `router/modal.router.tsx`
- **Services**: old `repos/get-cashback.repo.ts` + `repos/update-transactions-status.repo.ts`
  vs new `services/index.ts` (`CashbacksService` with 2 async methods)
- **Table columns**: old `hooks/use-cashback-table/use-cashback-table-columns.tsx`
  vs new `hooks/cashbacks/use-cashbacks-table-columns.tsx`
- **Action bar**: old `containers/cashback-action-bar.tsx` vs new `containers/cashbacks-action-bar.tsx`
- **Containers**: old `containers/cashback-table.tsx` + `containers/transactions-table.tsx`
  vs new `containers/cashbacks-table.tsx` + `containers/cashbacks-transactions-table.tsx`
- **Pages**: old `pages/cashback.page.tsx` + `pages/cashflow-cashback-transactions-details.page.tsx`
  vs new `pages/index.tsx` + `pages/transactions-details.tsx`
- **Context**: old `contexts/cashback-table.context.tsx` + `contexts/transactions-table.context.ts`
  vs new `context/index.ts` (two `createNextTableContext()` exports)
- **Hooks**: old 8 hook files (incl. `use-cashback.ts`, `use-update-cashback-status.ts`, table context hooks)
  vs new 2 hook files + use-cases (architecture difference — new project inlines fetch in use-cases, status update in action bar)

---

## ✅ Migrated and wired

| Feature                                                                                   | Location                                                                                                      |
| ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Cashbacks list page (`/cashback`)                                                         | `pages/index.tsx` → `CashbacksPage`                                                                           |
| Cashback list table (filterable, sortable)                                                | `containers/cashbacks-table.tsx`                                                                              |
| Row double-click → transactions detail modal                                              | `hooks/cashbacks/use-cashbacks-table.ts` → `getRowProps`                                                      |
| Transactions detail modal (`/cashback/:cashbackId`)                                       | `pages/transactions-details.tsx` → full-width Modal                                                           |
| Transactions table in detail modal                                                        | `containers/cashbacks-transactions-table.tsx` (reuses `useTransactionsTableColumns` from transactions module) |
| Action bar: Hamısını seç / selection count                                                | `containers/cashbacks-action-bar.tsx`                                                                         |
| Action bar: Yenilə                                                                        | `containers/cashbacks-action-bar.tsx`                                                                         |
| Action bar: Sıfırla                                                                       | `containers/cashbacks-action-bar.tsx`                                                                         |
| Action bar: Kəşbəki təsdiqlə (confirm modal → POST changestate)                           | `containers/cashbacks-action-bar.tsx` → `CashbacksService.updateTransactionsStatus`                           |
| Table column: Kod (id)                                                                    | `use-cashbacks-table-columns.tsx`                                                                             |
| Table column: Müştəri kodu (user_id)                                                      | `use-cashbacks-table-columns.tsx`                                                                             |
| Table column: Müştəri adı (user_name, not filterable)                                     | `use-cashbacks-table-columns.tsx`                                                                             |
| Table column: Kəşbək məbləği (cashback, not filterable)                                   | `use-cashbacks-table-columns.tsx`                                                                             |
| Table column: Ödəniş sayı (cashback_count, not filterable)                                | `use-cashbacks-table-columns.tsx`                                                                             |
| Table column: Statusu (state_id, with Select filter model_id=35)                          | `use-cashbacks-table-columns.tsx`                                                                             |
| Service: getList → GET `/api/admin/cashbacks`                                             | `services/index.ts`                                                                                           |
| Service: updateTransactionsStatus → POST `/api/admin/cashbacks/changestate` (state_id=56) | `services/index.ts`                                                                                           |
| Context: CashbacksTableContext                                                            | `context/index.ts`                                                                                            |
| Context: CashbackTransactionsTableContext                                                 | `context/index.ts`                                                                                            |
| Use-case: cashbacksTableFetchUseCase                                                      | `use-cases/table-fetch.ts`                                                                                    |
| Use-case: makeCashbackTransactionsFetchUseCase (factory with cashbackId)                  | `use-cases/transactions-table-fetch.ts`                                                                       |
| Modal router wired in `src/router/main.tsx`                                               | lazy import + `<Route path="/cashback/*">`                                                                    |

---

## ✅ All 13 gaps closed (2026-06-21)

| Was missing                                      | Now                                                                                         |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| `updateTransactionsStatus` service method        | `CashbacksService.updateTransactionsStatus` → `POST /api/admin/cashbacks/changestate`       |
| `CashbackTransactionsTableContext`               | Added to `context/index.ts`                                                                 |
| Transactions table fetch use-case                | `use-cases/transactions-table-fetch.ts` with `makeCashbackTransactionsFetchUseCase` factory |
| `getRowProps` (row double-click)                 | Added to `useCashbacksTable` hook                                                           |
| `user_id` table column ("Müştəri kodu")          | Added to `use-cashbacks-table-columns.tsx`                                                  |
| Status column filter (model_id=35)               | Select filter with `StatusesService.getList` added                                          |
| `CashbackTransactionsTable` container            | `containers/cashbacks-transactions-table.tsx`                                               |
| `CashbackTransactionsDetailsPage`                | `pages/transactions-details.tsx`                                                            |
| Action bar: row selection (select all / reset)   | Added to `cashbacks-action-bar.tsx`                                                         |
| Action bar: "Kəşbəki təsdiqlə" button            | Added with Modal.confirm + service call                                                     |
| Modal router                                     | `router/modal.router.tsx`                                                                   |
| Lazy import for CashbacksModalRouter in main.tsx | Added                                                                                       |
| Modal route `/cashback/*` in main.tsx            | Added                                                                                       |

---

## Scale check

| Metric               | Old (`cashback`)             | New (`cashbacks`)                                                 |
| -------------------- | ---------------------------- | ----------------------------------------------------------------- |
| Repo/service methods | 2 repos                      | 2 async methods on `CashbacksService`                             |
| Page routes          | 1                            | 1                                                                 |
| Modal routes         | 1                            | 1                                                                 |
| Containers           | 3                            | 3                                                                 |
| Table columns        | 6                            | 6                                                                 |
| Hooks                | 8 files (DI/Redux/event-bus) | 2 files + 2 use-cases (architecture diff — context+hooks pattern) |

---

## Notes

- Old `useCashback` hook (standalone react-query data hook) was only consumed by the `settings` module — not needed in `cashbacks` itself. Will be needed when `settings` is migrated.
- Old "Yeni" (create) button was commented out in the old module — correctly excluded from migration.
- Column `filterable: false` / `sortable: false` flags match old module exactly.
