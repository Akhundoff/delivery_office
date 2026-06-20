# Migration Status — Project Summary

**Date:** 2026-06-20
**Method:** Lightweight metric comparison (route count, service method count, container list) for unaudited modules; per-module audit docs used for the 5 audited modules. Modules marked ✅† are "likely fully migrated" based on structural parity — no deep audit yet.

---

## Summary table

| Old module                 | New module(s)               | Status | Notes                                                                                                          |
| -------------------------- | --------------------------- | ------ | -------------------------------------------------------------------------------------------------------------- |
| `about`                    | `about`                     | ✅†    | routes=1, svc=2 match; simple page                                                                             |
| `appointment`              | `appointment`               | ✅†    | routes+containers match                                                                                        |
| `archived-declarations`    | `declarations` (folded)     | ✅     | folded into declarations — see `docs/declarations-migration-audit.md`                                          |
| `archive-status`           | `archive-status`            | ✅†    | routes=1, svc=1; simple filter module                                                                          |
| `auth`                     | `me`                        | ✅†    | renamed + restructured as `me` module; login/register/profile flows present                                    |
| `azerpost`                 | `azerpost-queues`           | ✅†    | routes=3/3, svc=1/1; renamed module                                                                            |
| `banners`                  | `banners`                   | ✅†    | routes=2→3, svc=5/5                                                                                            |
| `boxes`                    | `boxes`                     | ✅†    | svc=10/10 exact match                                                                                          |
| `box-transfers`            | `box-transfers`             | ✅†    | routes+svc close                                                                                               |
| `branches`                 | `branches`                  | 🟡     | svc 9→7 (−2 methods); hooks 11→4; needs deep audit                                                             |
| `branch-inspections`       | `branch-inspections`        | ✅†    | routes=5/5, svc 8→7, containers 3→6                                                                            |
| `branch-partners`          | `branch-partners`           | ✅†    | routes+svc match                                                                                               |
| `cargoes`                  | `cargoes`                   | ✅†    | routes+svc match                                                                                               |
| `cashback`                 | `cashbacks`                 | 🟡     | missing `transactions-table` container; routes 2→1; needs deep audit                                           |
| `cash-flow`                | `cash-flow`                 | 🆕     | old module was empty; new is a full new feature (svc=14, routes=13)                                            |
| `counter`                  | `counter`                   | ✅†    | simple counter provider; svc=1/1                                                                               |
| `countries`                | `countries`                 | ✅†    | routes=3/3, svc close                                                                                          |
| `coupons`                  | `coupons`                   | ✅†    | routes=3/3, svc=5/5                                                                                            |
| `currency-rates`           | _(none)_                    | ❌     | no counterpart module in new project                                                                           |
| `customs`                  | `customs`                   | 🟡     | routes 7→4; missing `customs/posts`, `customs/declarations`, `customs/tasks` (list) pages                      |
| `declarations`             | `declarations`              | ✅     | see `docs/declarations-migration-audit.md`                                                                     |
| `delivery-proofs`          | `delivery-proofs`           | ✅†    | routes=1/1, svc=1/1                                                                                            |
| `export`                   | _(folded)_                  | ✅†    | old was empty stub; export functionality in each module's action bar                                           |
| `failed-jobs`              | `failed-jobs`               | ✅†    | routes=2/2, svc=3/3                                                                                            |
| `faq`                      | `faq`                       | ✅†    | routes+svc match                                                                                               |
| `flights`                  | `flights`                   | ✅     | see `docs/flights-migration-audit.md`                                                                          |
| `layout`                   | `layout`                    | ✅†    | shared infra — sidebar, head-portal; present and in use                                                        |
| `logs`                     | `logs`                      | ✅†    | all 4 service methods present (getList, getById, exportAsExcel, exportDeclarationChanges)                      |
| `models`                   | `models`                    | 🟡     | svc 2→1 (missing one repo method); needs spot-check                                                            |
| `news`                     | `news`                      | ✅†    | routes+svc match                                                                                               |
| `notifications`            | `notifications`             | ✅†    | simple hook wrapper; no API calls in either old or new                                                         |
| `notifier`                 | `notifier`                  | ✅     | see `docs/notifier-migration-audit.md`                                                                         |
| `orders`                   | `orders`                    | ✅     | see `docs/orders-migration-audit.md`                                                                           |
| `parcels`                  | `parcels`                   | ✅†    | simple list hook; svc=1/1                                                                                      |
| `partner-box-acceptance`   | `partner-box-acceptance`    | ✅†    | svc=4/4; barcode scan + box selection present                                                                  |
| `partner-boxes`            | `partner-boxes`             | ✅†    | routes+svc match                                                                                               |
| `partners`                 | `partners`                  | ✅†    | minimal module; svc=1/1                                                                                        |
| `plans`                    | `plans`                     | 🟡     | svc 7→5; missing `getPlanCategories` + `getPlanTypes`; create/edit form may lack category/type selects         |
| `popups`                   | `popups`                    | ✅†    | routes+svc match                                                                                               |
| `product-types`            | `product-types`             | ✅†    | routes+svc match                                                                                               |
| `refunds`                  | `refunds`                   | 🟡     | svc 6→5; likely missing Excel export (`getRefundsExcel`)                                                       |
| `regions`                  | `regions`                   | ✅†    | routes+svc match                                                                                               |
| `return-types`             | `return-types`              | ✅†    | routes+svc match                                                                                               |
| `settings`                 | `settings`                  | ❌     | old: routes=1, repos=19, containers=9; new: routes=0, svc=1, containers=0 — essentially unmigrated             |
| `shop-names`               | `shop-names`                | ✅†    | routes+svc match                                                                                               |
| `shops`                    | `shops`                     | ✅†    | routes+svc match                                                                                               |
| `sorting`                  | `sorting`                   | 🟡     | containers 11→6; missing: in/out-sorting-missing tables, sorting-another-declarations, sorting-info; svc 14→11 |
| `statistics`               | `statistics`                | 🟡     | routes 44→29 (−15); 14/~30 page routes exist; missing chart pages need audit                                   |
| `status`                   | `statuses`                  | ✅†    | renamed; routes+svc match (CRUD)                                                                               |
| `supports`                 | `supports`                  | ✅†    | routes=4/4, svc 11→12 (new added one)                                                                          |
| `telegram-bot-users`       | `telegram-bot-users`        | ✅†    | routes=1/1, svc=2/2                                                                                            |
| `ticket-templates`         | `ticket-templates`          | ✅†    | routes 3→4, svc=4/4                                                                                            |
| `transactions`             | `transactions`              | ✅†    | routes=2/2, svc 6→7                                                                                            |
| `transportationConditions` | `transportation-conditions` | ✅†    | svc=2/2 (renamed)                                                                                              |
| `united-declarations`      | `united-declarations`       | ✅†    | svc 4→6 (new added methods)                                                                                    |
| `united-pool`              | `united-queues`             | ✅†    | renamed; routes=3/3, svc=1/1                                                                                   |
| `united-returns`           | `united-returns`            | ✅†    | routes 3→4, svc=6/6, containers=4/4                                                                            |
| `users`                    | `users`                     | ✅†    | routes 6→7, svc 19→16; 27 gaps closed 2026-06-20; 3 service methods may still differ                           |
| `warehouse`                | `warehouse`                 | ✅†    | routes=3/3, svc=5/5                                                                                            |

---

## Totals

| Status                                 | Count | Modules                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| -------------------------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ✅ Fully migrated (audited)            | 5     | couriers, declarations, flights, notifier, orders                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ✅† Likely fully migrated (unverified) | 40    | about, appointment, archive-status, azerpost→azerpost-queues, auth→me, banners, boxes, box-transfers, branch-inspections, branch-partners, cargoes, counter, countries, coupons, delivery-proofs, export→folded, failed-jobs, faq, layout, logs, news, notifications, parcels, partner-box-acceptance, partner-boxes, partners, popups, product-types, regions, return-types, shop-names, shops, statuses, supports, telegram-bot-users, ticket-templates, transactions, transportation-conditions, united-declarations, united-queues, united-returns, users, warehouse |
| 🟡 Partially migrated                  | 8     | branches, cashbacks, customs, models, plans, refunds, sorting, statistics                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ❌ Not migrated                        | 2     | currency-rates, settings                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| 🆕 New feature (no old equivalent)     | 1     | cash-flow                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |

**Total old modules tracked:** 59 (4 infra/empty: auth, cash-flow, export, layout handled separately)

---

## Priority queue for deep audits and gap-closing

Ordered by user-facing impact and gap severity:

### 🔴 Urgent — large gap or high traffic

1. **`settings`** ❌ — 19 service methods, 9 containers missing. Covers azerpost, branches, cashback, cash-flow, mail, warehouses, trendyol, topup, and "others" settings tabs. Highest unblocking value.
2. **`statistics`** 🟡 — 15 of 44 routes missing. Used from couriers, declarations, and users detail pages. Run `/migration-report statistics` first to enumerate missing chart pages.
3. **`sorting`** 🟡 — 5 of 11 containers missing (in-sorting-missing, out-sorting-missing, sorting-another, sorting-info). Core warehouse workflow.
4. **`customs`** 🟡 — 3 page routes missing (customs/posts, customs/declarations, customs/tasks list). Blocked workflow for customs staff.

### 🟡 Medium — small gap, targeted fix

5. **`branches`** 🟡 — 2 missing service methods; likely `getBranchesExcel` + one other. Quick fix.
6. **`plans`** 🟡 — missing `getPlanCategories` + `getPlanTypes`; create/edit form may be broken.
7. **`refunds`** 🟡 — likely missing `getRefundsExcel` only.
8. **`cashbacks`** 🟡 — missing `transactions-table` container (cashback transaction sub-list).
9. **`models`** 🟡 — 1 missing service method; spot-check needed.
10. **`currency-rates`** ❌ — simple CRUD (was 2 repos, 0 routes in old); fast to build if needed.

### 🟢 Verification only — run `/migration-report` to confirm

All 40 ✅† modules have no audit doc. High-confidence candidates to audit next:

- **`users`** — 27 gaps closed 2026-06-20 but no audit doc written; confirm 3 service-method delta.
- **`branches`** — run `/migrate-module branches` (already flagged as 🟡).
- **`boxes`** — high-traffic, svc=10/10 exact match; good candidate for a fast ✅ confirmation.
