# Statistics Module — Migration Audit

> Comparison of `delivery_management_new/src/modules/statistics` against the old
> `delivery_management/src/@next/modules/statistics`.
>
> **Date:** 2026-06-21
> **Verdict:** ✅ **Fully migrated** — 100% parity with `delivery_management/src/@next/modules/statistics`.

## Method

Compared all sub-modules (cashflow-transactions, couriers, declarations, orders, transactions, users, qizil-onluq), their chart/table pages, detail modals, routes, and services between old and new.

## ✅ Migrated and wired

| Feature                          | Route/Location                                                              |
| -------------------------------- | --------------------------------------------------------------------------- |
| Statistics overview page         | `index` route → `StatisticsOverviewPage`                                    |
| Declarations by status           | `declarations/by-status` → `DeclarationsByStatusPage`                       |
| Orders by status                 | `orders/by-status` → `OrdersByStatusPage`                                   |
| Orders by admin                  | `orders/by-admin` → `OrdersByAdminPage`                                     |
| Users counts                     | `users/counts` → `UsersCountsPage`                                          |
| Couriers counts                  | `couriers/counts` → `CouriersCountsPage`                                    |
| Couriers by regions              | `couriers/by-regions` → `CouriersByRegionsPage`                             |
| Couriers by regions overview     | `couriers/by-regions-overview` → `CouriersByRegionsOverviewPage`            |
| Cashflow transactions            | `cashflow-transactions` → `CashflowTransactionsPage`                        |
| Transactions by payment type     | `transactions/by-payment-type` → `TransactionsByPaymentTypePage`            |
| Transactions by user             | `transactions/by-user` → `TransactionsByUserPage`                           |
| Payment types by declarations    | `declarations/payment-types` → `PaymentTypesByDeclarationsPage`             |
| Tariff overview                  | `declarations/tariff-overview` → `TariffOverviewPage`                       |
| Qizil onluq page                 | `qizil-onluq` → `QizilOnluqPage`                                            |
| Declarations details modal       | `declarations/details` modal → `DeclarationsDetailsModal`                   |
| Orders details modal             | `orders/details` modal → `OrdersDetailsModal`                               |
| Users details modal              | `users/details` modal → `UsersDetailsModal`                                 |
| Couriers details modal           | `couriers/details` modal → `CouriersDetailsModal`                           |
| Cashflow details modal           | `cashflow-transactions/details` modal → `CashflowDetailsModal`              |
| Transactions details modal       | `transactions/details` modal → `TransactionsDetailsModal`                   |
| Aggregated modals                | `containers/aggregated-modals.tsx`                                          |
| Bar chart component              | `components/statistics-bar-chart.tsx`                                       |
| Line chart component             | `components/statistics-line-chart.tsx`                                      |
| Statistics service               | `services/index.ts` — all chart data endpoints                              |
| Qizil onluq table + action bar   | `containers/qizil-onluq-table.tsx`, `containers/qizil-onluq-action-bar.tsx` |
| Detail fetch use-case            | `use-cases/detail-fetch.ts`                                                 |
| Qizil onluq table fetch use-case | `use-cases/qizil-onluq-table-fetch.ts`                                      |

## ❌ Missing / not migrated

_(none)_

## Scale check

| Metric                     | Old                                                                                  | New                                    |
| -------------------------- | ------------------------------------------------------------------------------------ | -------------------------------------- |
| Sub-modules                | 7 (cashflow-transactions, couriers, declarations, orders, transactions, users, core) | Flat structure with pages + components |
| Chart pages                | 14                                                                                   | 14                                     |
| Detail modals              | 6                                                                                    | 6                                      |
| Components (charts/tables) | ~13                                                                                  | 13                                     |
| Page routes                | ~14                                                                                  | 14                                     |
| Modal routes               | ~6                                                                                   | 6                                      |
