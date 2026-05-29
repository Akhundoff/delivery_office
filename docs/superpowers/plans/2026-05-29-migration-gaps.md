# Migration Gaps — delivery_management → delivery_management_new

**Date:** 2026-05-29
**Method:** Compared old project's `@next/modules` (the architecture being mirrored) against `delivery_management_new/src/modules`, using router path definitions in both projects as the source of truth.

---

## 1. Modules NOT migrated at all (no folder in new)

| Module | Old pages / routes | Priority |
|---|---|---|
| **orders** | list, `:id` detail, `:id/timeline` | High (major module, fully absent) |
| **statistics** | ~30 dashboards: couriers, declarations, orders, plans, transactions, users, qizil-onluq, cashflow-transactions, status counts, etc. | High (only `branches-partner` migrated, as `partner-statistics`) |
| **sorting** | list, `acceptance`, `:flightId/non-sorted-declarations`, `:id` | Medium |
| **supports** (tickets) | list, `categories`, `create`, `:id` | Medium |
| **branch-inspections** | list, `create`, `:id/details`, `:id/report`, `:id/scan` | Medium |
| **united-declarations** | list | Low |
| **united-returns** | list, `execution` | Low |
| **warehouse** | `handover/history`, `handover/queues`, `handover/queues/:queueId` | Low |
| **appointment** | list, `:userId` | Low |
| **box-transfers** | `:id/:type` | Low |

**Supporting sub-modules** (no standalone router in old; consumed by statistics / orders / dashboard) also absent:
`cash-flow`, `counter`, `currency-rates`, `export`, `notifications`, `parcels`, `partners`.

---

## 2. Partially migrated modules (folder exists, pages/actions missing)

### couriers
Only table + create migrated (~15 files). Missing pages:
- `deliverer-assignments` and `deliverer-assignments/cancel`
- `:id` detail
- `:id/assign-deliverer`
- `:id/handover`
- `:id/timeline`

### declarations
Most pages migrated. Missing:
- `acceptance` and `acceptance/box` (declaration acceptance flow)
- `users/:userId/current-month` (user current-month declarations)

### flights
Mostly migrated. Missing:
- `:id/box/declarations` (box declarations view)
- `:id/declarations` (flight declarations list)
- *(new added `trendyol-cari`, which is not in the old project — extra, not a gap)*

---

## 3. Fully migrated (verified complete)

`about`, `archive-status`, `azerpost-queues`, `banners`, `boxes`, `branches`, `branch-partners`,
`cargoes`, `cashbacks`, `countries`, `coupons`, `customs`, `delivery-proofs`, `faq`, `logs`,
`models`, `news`, `notifier`, `partner-box-acceptance`, `partner-boxes`, `plans`, `popups`,
`product-types`, `refunds`, `regions`, `return-types`, `settings`, `shop-names`, `shops`,
`statuses`, `system-settings`, `telegram-bot-users`, `ticket-templates`, `transactions`,
`transportation-conditions`, `united-queues`, `users`, `me`/`auth`.

---

## Suggested order of work (by effort / dependency)

1. **statistics** — largest surface; depends on sub-modules (`cash-flow`, `currency-rates`, `counter`, `export`, `parcels`, `partners`).
2. **orders** — major standalone module; likely a dependency of statistics dashboards.
3. **couriers** — finish the partially-migrated module (assignments, detail, handover, timeline).
4. **declarations / flights** — fill the remaining acceptance / box-declaration pages.
5. **sorting**, **supports**, **branch-inspections** — medium standalone modules.
6. **warehouse**, **united-declarations**, **united-returns**, **appointment**, **box-transfers** — lower priority.

> Reference old `@next/modules/<name>` for API endpoints, field names, and business rules.
> Re-implement with the warehouse architecture (services + context/useReducer + lazy routers), per CLAUDE.md.
