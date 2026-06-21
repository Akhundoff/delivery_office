# Migration Status — Project Summary

**Date:** 2026-06-21
**Method:** Per-module audit docs for confirmed modules; lightweight metric comparison for ✅† entries.

---

## Summary table

| Old module                 | New module(s)               | Status | Notes / link to detailed audit                                                                  |
| -------------------------- | --------------------------- | ------ | ----------------------------------------------------------------------------------------------- |
| `about`                    | `about`                     | ✅†    | routes=1, svc=2 match; simple page                                                              |
| `appointment`              | `appointment`               | ✅†    | routes+containers match                                                                         |
| `archived-declarations`    | `declarations` (folded)     | ✅     | folded into declarations — see `docs/declarations-migration-audit.md`                           |
| `archive-status`           | `archive-status`            | ✅†    | routes=1, svc=1; simple filter module                                                           |
| `auth`                     | `me`                        | ✅†    | renamed + restructured as `me` module; login/register/profile flows present                     |
| `azerpost`                 | `azerpost-queues`           | ✅     | 2 gaps closed (executed filter + default state) — see `docs/azerpost-queues-migration-audit.md` |
| `banners`                  | `banners`                   | ✅†    | routes=2→3, svc=5/5                                                                             |
| `boxes`                    | `boxes`                     | ✅†    | svc=10/10 exact match                                                                           |
| `box-transfers`            | `box-transfers`             | ✅†    | routes+svc close                                                                                |
| `branches`                 | `branches`                  | ✅     | 2 old repos moved to couriers/unused — see `docs/branches-migration-audit.md`                   |
| `branch-inspections`       | `branch-inspections`        | ✅†    | routes=5/5, svc 8→7, containers 3→6                                                             |
| `branch-partners`          | `branch-partners`           | ✅†    | routes+svc match                                                                                |
| `cargoes`                  | `cargoes`                   | ✅†    | routes+svc match                                                                                |
| `cashback`                 | `cashbacks`                 | ✅     | see `docs/cashbacks-migration-audit.md`                                                         |
| `cash-flow`                | `cash-flow`                 | 🆕     | old module was empty; new is a full new feature (svc=14, routes=13)                             |
| `counter`                  | `counter`                   | ✅†    | simple counter provider; svc=1/1                                                                |
| `countries`                | `countries`                 | ✅†    | routes=3/3, svc close                                                                           |
| `coupons`                  | `coupons`                   | ✅†    | routes=3/3, svc=5/5                                                                             |
| `currency-rates`           | _(folded)_                  | ✅     | `getCurrencyRate` inlined into `TransactionsService`; no standalone module needed               |
| `customs`                  | `customs`                   | ✅     | see `docs/customs-migration-audit.md`                                                           |
| `declarations`             | `declarations`              | ✅     | see `docs/declarations-migration-audit.md`                                                      |
| `delivery-proofs`          | `delivery-proofs`           | ✅†    | routes=1/1, svc=1/1                                                                             |
| `export`                   | _(folded)_                  | ✅     | `useMassiveExport` lives in `@shared/hooks`; used by declarations, orders, and more             |
| `failed-jobs`              | `failed-jobs`               | ✅†    | routes=2/2, svc=3/3                                                                             |
| `faq`                      | `faq`                       | ✅†    | routes+svc match                                                                                |
| `flights`                  | `flights`                   | ✅     | see `docs/flights-migration-audit.md`                                                           |
| `layout`                   | `layout`                    | ✅†    | shared infra — sidebar, head-portal; present and in use                                         |
| `logs`                     | `logs`                      | ✅†    | all 4 service methods present                                                                   |
| `models`                   | `models`                    | ✅     | see `docs/models-migration-audit.md`                                                            |
| `news`                     | `news`                      | ✅†    | routes+svc match                                                                                |
| `notifications`            | `notifications`             | ✅†    | simple hook wrapper; no API calls in either old or new                                          |
| `notifier`                 | `notifier`                  | ✅     | see `docs/notifier-migration-audit.md`                                                          |
| `orders`                   | `orders`                    | ✅     | see `docs/orders-migration-audit.md`                                                            |
| `parcels`                  | `parcels`                   | ✅†    | simple list hook; svc=1/1                                                                       |
| `partner-box-acceptance`   | `partner-box-acceptance`    | ✅†    | svc=4/4; barcode scan + box selection present                                                   |
| `partner-boxes`            | `partner-boxes`             | ✅†    | routes+svc match                                                                                |
| `partners`                 | `partners`                  | ✅†    | minimal module; svc=1/1                                                                         |
| `plans`                    | `plans`                     | ✅     | see `docs/plans-migration-audit.md`                                                             |
| `popups`                   | `popups`                    | ✅†    | routes+svc match                                                                                |
| `product-types`            | `product-types`             | ✅†    | routes+svc match                                                                                |
| `refunds`                  | `refunds`                   | ✅     | see `docs/refunds-migration-audit.md`                                                           |
| `regions`                  | `regions`                   | ✅†    | routes+svc match                                                                                |
| `return-types`             | `return-types`              | ✅†    | routes+svc match                                                                                |
| `settings`                 | `system-settings`           | ✅     | 18 repos → 2 generic service methods — see `docs/system-settings-migration-audit.md`            |
| `shop-names`               | `shop-names`                | ✅†    | routes+svc match                                                                                |
| `shops`                    | `shops`                     | ✅†    | routes+svc match                                                                                |
| `sorting`                  | `sorting`                   | ✅     | see `docs/sorting-migration-audit.md`                                                           |
| `statistics`               | `statistics`                | ✅     | see `docs/statistics-migration-audit.md`                                                        |
| `status`                   | `statuses`                  | ✅†    | renamed; routes+svc match (CRUD)                                                                |
| `supports`                 | `supports`                  | ✅†    | routes=4/4, svc 11→12                                                                           |
| `telegram-bot-users`       | `telegram-bot-users`        | ✅†    | routes=1/1, svc=2/2                                                                             |
| `ticket-templates`         | `ticket-templates`          | ✅†    | routes 3→4, svc=4/4                                                                             |
| `transactions`             | `transactions`              | ✅†    | routes=2/2, svc 6→7                                                                             |
| `transportationConditions` | `transportation-conditions` | ✅†    | svc=2/2 (renamed)                                                                               |
| `united-declarations`      | `united-declarations`       | ✅†    | svc 4→6 (new added methods)                                                                     |
| `united-pool`              | `united-queues`             | ✅     | renamed; bug fix on modal close path — see `docs/united-queues-migration-audit.md`              |
| `united-returns`           | `united-returns`            | ✅†    | routes 3→4, svc=6/6, containers=4/4                                                             |
| `users`                    | `users`                     | ✅†    | 27 gaps closed 2026-06-20; svc=19/16 (3 methods handled elsewhere)                              |
| `warehouse`                | `warehouse`                 | ✅†    | routes=3/3, svc=5/5                                                                             |

---

## Totals

| Status                                 | Count | Modules                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| -------------------------------------- | ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ✅ Fully migrated (audited)            | 16    | azerpost-queues, branches, cashbacks, couriers, customs, declarations, flights, models, notifier, orders, plans, refunds, sorting, statistics, system-settings, united-queues                                                                                                                                                                                                                                                                                                                                    |
| ✅† Likely fully migrated (unverified) | 38    | about, appointment, archive-status, auth→me, banners, boxes, box-transfers, branch-inspections, branch-partners, cargoes, counter, countries, coupons, delivery-proofs, failed-jobs, faq, layout, logs, news, notifications, parcels, partner-box-acceptance, partner-boxes, partners, popups, product-types, regions, return-types, shop-names, shops, statuses, supports, telegram-bot-users, ticket-templates, transactions, transportation-conditions, united-declarations, united-returns, users, warehouse |
| ✅ Folded/inline                       | 2     | currency-rates (→ TransactionsService), export (→ @shared/hooks)                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| 🆕 New feature (no old equivalent)     | 1     | cash-flow                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ❌ Not migrated                        | 0     | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |

**Total old modules tracked:** 57

---

## Modules with deep audit docs

| Module          | Doc                                       |
| --------------- | ----------------------------------------- |
| azerpost-queues | `docs/azerpost-queues-migration-audit.md` |
| branches        | `docs/branches-migration-audit.md`        |
| cashbacks       | `docs/cashbacks-migration-audit.md`       |
| couriers        | `docs/couriers-migration-audit.md`        |
| customs         | `docs/customs-migration-audit.md`         |
| declarations    | `docs/declarations-migration-audit.md`    |
| flights         | `docs/flights-migration-audit.md`         |
| models          | `docs/models-migration-audit.md`          |
| notifier        | `docs/notifier-migration-audit.md`        |
| orders          | `docs/orders-migration-audit.md`          |
| plans           | `docs/plans-migration-audit.md`           |
| refunds         | `docs/refunds-migration-audit.md`         |
| sorting         | `docs/sorting-migration-audit.md`         |
| statistics      | `docs/statistics-migration-audit.md`      |
| system-settings | `docs/system-settings-migration-audit.md` |
| united-queues   | `docs/united-queues-migration-audit.md`   |
