# Orders module migration audit

Date: 2026-06-07
Verdict: ✅ Fully migrated (100% parity with `delivery_management/src/@next/modules/orders`)

## Migrated and wired

| Area | Old reference | New location | Notes |
|---|---|---|---|
| Routes (page + modal) | `orders.router.tsx`, `orders-modal.router.tsx` | `router/page.router.tsx`, `router/modal.router.tsx` | `/orders`, `/orders/:id`, `/orders/create`, `/orders/:id/update`, `/orders/:id/timeline`, `/orders/:id/reject`, `/orders/bulk_reject` |
| `OrdersService.getList/getById/getStates/save/changeStatus/bulkChangeStatus/cancel/getExcel` | `repos/get-orders*`, `update-orders-status`, `bulk-update-orders-status`, `create-order`, `get-orders-excel` | `services/index.ts` | static-method service, `ApiResult` pattern |
| `OrdersService.updateRead` (NEW) | `repos/update-orders-read.repo.ts` (`POST /api/admin/isnew`) | `services/index.ts` | added — marks order(s) read/unread |
| Orders table + columns | `use-orders-table-columns.tsx` | `hooks/orders/use-orders-table-columns.tsx` | all 13 base columns + row actions menu now match (see below) |
| Row actions menu (Ətraflı bax / Düzəliş et / Bağlama / Məhsul / Status xəritəsi / Oxunmuş-Oxunmamış et / Statusu dəyiş / Sil) | `use-orders-table-columns.tsx` | `hooks/orders/use-orders-table-columns.tsx` | all 8 menu items wired |
| Columns: Ölkə (filter), D.K qiyməti (+ debt), Link, Qiymət (+ debt), İzləmə kodu (read coloring), Status (`OrderStateTag` + filter), Ödənilib (checkbox filter), Gözlənilən tarix | `use-orders-table-columns.tsx` | `hooks/orders/use-orders-table-columns.tsx` | added/fixed to match old visuals & filters |
| Action bar: create, select-all/selection+total price, refresh, reset, total count, bulk status change, counts-by-status link, CSV massive export, Excel export | `use-orders-action-bar.ts` + `orders-action-bar.tsx` | `containers/orders-action-bar.tsx` | added selection total price, `/statistics/status/order-counts` link, `useMassiveExport` + `react-csv` `CSVLink` export |
| Order detail page/container | `order-details.tsx` | `containers/order-detail.tsx`, `pages/detail.tsx` | full parity |
| Order timeline modal | `order-timeline.tsx` | `containers/order-timeline.tsx` | added "Status tarixçəsi" footer button → `/archive/state` |
| Create/edit order modal + form | `create-order.tsx`, `use-create-order.ts` | `containers/create-order.tsx`, `hooks/createOrder/use-create-order.ts` | full parity |
| Reject orders modal (single + bulk) | `reject-order.tsx`, `use-reject-order.ts` | `containers/reject-orders.tsx`, `hooks/rejectOrders/use-reject-orders.ts` | full parity |
| `OrderStateTag` component | `components/order-state-tag.tsx` | `components/order-state-tag.tsx` | parity |
| Interfaces (`IOrder`, `IDetailedOrder`, `IOrderStateExecution`, `ICreateOrderValues`, `IRejectOrdersValues`) | `interfaces/order.interface.ts` | `interfaces/index.ts` | parity |
| Statistics drill-down reuse (`orderRowToDomain`) | n/a (new architecture) | `services/index.ts` | exported and consumed by `statistics/orders-details-modal.tsx` |

## Notes

- `ProductParserMapper` / `ParsedProduct` from the old module are dead code (not wired to any UI flow in `delivery_management`) — intentionally not migrated.
- Added npm dependency: `react-csv` + `@types/react-csv` (installed with `--legacy-peer-deps` due to an existing `react-json-view` peer-dependency conflict in this project), required for the CSV "massive export" button to reach parity.
- `npx tsc --noEmit` passes with no errors in `src/modules/orders/**`.
