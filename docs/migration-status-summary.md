# Migration Status — Project Summary

**Date:** 2026-06-21  
**Method:** Lightweight automated scan — route counts, API/repo method counts, hook file counts, column header grep. Audited modules sourced from existing `docs/*-migration-audit.md` files.  
**Note:** Column counts are approximate (grep on `Header:|header:|title:` in table-column hooks). New service counts use object-literal `async ` pattern; old counts use repo file count (one file ≈ one API method). Hook counts may be lower in new project due to architectural consolidation (react-query + combined hooks) — not necessarily missing features.

---

## Summary Table

| Old module               | New module(s)                   | Status     | Cols (old/new) | APIs (old/new) | Hooks (old/new) | Routes (old/new) | Notes                                                                                                                                                                                            |
| ------------------------ | ------------------------------- | ---------- | -------------- | -------------- | --------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| about                    | about                           | 🟡 Partial | 0/0            | 2/2            | 1/0             | 2/2              | No hook files in new                                                                                                                                                                             |
| appointment              | appointment                     | 🟡 Partial | 0/0            | 2/1            | 1/1             | 3/4              | 1 API missing                                                                                                                                                                                    |
| archived-declarations    | (→ declarations)                | ✅ Full    | 22/—           | 3/—            | 5/—             | 3/—              | Folded into declarations; covered by declarations audit                                                                                                                                          |
| archive-status           | archive-status                  | 🟡 Partial | 6/6            | 1/1            | 4/2             | 2/2              | Cols + APIs match; hooks reduced                                                                                                                                                                 |
| auth                     | me                              | 🟡 Partial | 0/0            | 3/?            | 2/0             | 1/2              | Login/register flows; service count unverified in `me` module                                                                                                                                    |
| azerpost                 | azerpost-queues                 | 🟡 Partial | 9/10           | 1/1            | 5/2             | 5/5              | Renamed; APIs + routes match; hooks 5→2                                                                                                                                                          |
| banners                  | banners                         | 🟡 Partial | 6/7            | 5/5            | 6/3             | 3/5              | APIs match; hooks reduced                                                                                                                                                                        |
| boxes                    | boxes                           | 🟡 Partial | 5/7            | 10/10          | 13/7            | 3/4              | APIs match exactly; hooks significantly reduced (13→7)                                                                                                                                           |
| box-transfers            | box-transfers                   | 🟡 Partial | 8/8            | 1/1            | 3/2             | 1/3              | Cols + APIs match                                                                                                                                                                                |
| branches                 | branches                        | 🟡 Partial | 8/9            | 9/9            | 11/6            | 4/6              | APIs match; hooks reduced (11→6)                                                                                                                                                                 |
| branch-inspections       | branch-inspections              | 🟡 Partial | 9/9            | 8/8            | 9/6             | 6/7              | APIs + cols match                                                                                                                                                                                |
| branch-partners          | branch-partners                 | 🟡 Partial | 6/6            | 4/5            | 7/3             | 3/5              | APIs + cols match                                                                                                                                                                                |
| cargoes                  | cargoes                         | 🟡 Partial | 3/5            | 4/5            | 7/4             | 3/5              | APIs + routes match                                                                                                                                                                              |
| cashback                 | cashbacks                       | ✅ Full    | 6/6            | 2/2            | 8/2             | 4/4              | **Per audit**                                                                                                                                                                                    |
| cash-flow                | cash-flow                       | 🟡 Partial | 21/26          | 0/0            | 0/5             | 0/15             | Old was group of sub-modules (analytics, cash-registers, currencies, operations, transactions); new is standalone with 15 routes but 0 service methods found — service wiring needs verification |
| counter                  | counter                         | 🟡 Partial | 0/0            | 1/1            | 1/1             | 0/0              | Sidebar badge counter; minimal                                                                                                                                                                   |
| countries                | countries                       | 🟡 Partial | 8/8            | 3/5            | 7/4             | 4/5              | Cols + APIs at parity                                                                                                                                                                            |
| coupons                  | coupons                         | 🟡 Partial | 23/10          | 5/5            | 10/3            | 4/5              | APIs match; column count gap suspicious (23→10) — verify                                                                                                                                         |
| couriers                 | couriers                        | ✅ Full    | 21/27          | 22/23          | 16/8            | 9/11             | **Per audit**                                                                                                                                                                                    |
| currency-rates           | transactions (dissolved)        | ✅ Full    | 0/—            | 1/1            | 2/—             | 0/—              | `getCurrencyRate` folded into `transactions/services`; context dissolved — no standalone module needed                                                                                           |
| customs                  | customs                         | ✅ Full    | 16/53          | 8/8            | 11/9            | 7/9              | **Per audit**                                                                                                                                                                                    |
| declarations             | declarations                    | ✅ Full    | 55/72          | 49/57          | 39/19           | 20/26            | **Per audit**; includes archived-declarations + united-declarations                                                                                                                              |
| delivery-proofs          | delivery-proofs                 | 🟡 Partial | 5/6            | 1/1            | 4/2             | 1/2              | APIs match                                                                                                                                                                                       |
| export                   | shared/hooks (dissolved)        | ✅ Full    | 0/—            | 0/—            | 1/1             | 0/—              | `useMassiveExport` promoted to `src/shared/hooks/use-massive-export.ts`; used by declarations, orders, etc.                                                                                      |
| failed-jobs              | failed-jobs                     | 🟡 Partial | 5/7            | 3/3            | 3/2             | 3/4              | APIs match                                                                                                                                                                                       |
| faq                      | faq                             | 🟡 Partial | 4/7            | 4/5            | 6/3             | 3/5              | APIs match                                                                                                                                                                                       |
| flights                  | flights                         | ✅ Full    | 34/16          | 25/24          | 16/10           | 12/16            | **Per audit**                                                                                                                                                                                    |
| layout                   | layout                          | 🟡 Partial | 0/0            | 0/0            | 3/0             | 0/0              | Old has 3 sidebar/menu hooks; new layout dir has none — may live elsewhere                                                                                                                       |
| logs                     | logs                            | 🟡 Partial | 6/6            | 4/4            | 5/2             | 4/4              | APIs + routes + cols match                                                                                                                                                                       |
| models                   | models                          | ✅ Full    | 5/5            | 1/1            | 4/3             | 2/1              | **Per audit**                                                                                                                                                                                    |
| news                     | news                            | 🟡 Partial | 6/6            | 4/5            | 6/3             | 3/5              | APIs + cols match                                                                                                                                                                                |
| notifications            | notifications                   | 🟡 Partial | 0/0            | 0/0            | 1/1             | 0/0              | Minimal toast wrapper module                                                                                                                                                                     |
| notifier                 | notifier                        | ✅ Full    | 62/64          | 29/30          | 34/26           | 13/15            | **Per audit**                                                                                                                                                                                    |
| orders                   | orders                          | ✅ Full    | 13/17          | 10/10          | 8/7             | 6/9              | **Per audit**                                                                                                                                                                                    |
| parcels                  | parcels                         | 🟡 Partial | 0/0            | 1/1            | 1/1             | 0/0              | Minimal                                                                                                                                                                                          |
| partner-box-acceptance   | partner-box-acceptance          | 🟡 Partial | 0/0            | 4/4            | 4/1             | 2/2              | APIs match; hooks severely reduced (4→1) — verify                                                                                                                                                |
| partner-boxes            | partner-boxes                   | 🟡 Partial | 5/6            | 4/6            | 7/4             | 3/4              | APIs close                                                                                                                                                                                       |
| partners                 | partners                        | 🟡 Partial | 0/0            | 1/1            | 1/1             | 0/0              | Minimal                                                                                                                                                                                          |
| plans                    | plans                           | ✅ Full    | 8/9            | 7/7            | 9/3             | 4/5              | **Per audit**                                                                                                                                                                                    |
| popups                   | popups                          | 🟡 Partial | 11/8           | 4/5            | 8/3             | 3/5              | APIs match; column count off (11→8)                                                                                                                                                              |
| product-types            | product-types                   | 🟡 Partial | 7/6            | 3/5            | 7/3             | 3/5              | APIs match                                                                                                                                                                                       |
| refunds                  | refunds                         | ✅ Full    | 10/13          | 6/7            | 8/4             | 4/6              | **Per audit**                                                                                                                                                                                    |
| regions                  | regions                         | 🟡 Partial | 6/7            | 4/5            | 7/3             | 3/5              | APIs match                                                                                                                                                                                       |
| return-types             | return-types                    | 🟡 Partial | 3/4            | 4/5            | 7/3             | 3/5              | APIs match                                                                                                                                                                                       |
| settings                 | settings + system-settings      | 🟡 Partial | 0/0            | 19/2           | 10/1            | 2/2              | `system-settings` uses 2 generic `getGroup`/`updateGroup` calls (replaces 19 individual repos); containers: 9 old → 7 new — **missing `branches-settings` and `warehouses-settings`**            |
| shop-names               | shop-names                      | 🟡 Partial | 4/5            | 5/5            | 7/3             | 3/4              | APIs match                                                                                                                                                                                       |
| shops                    | shops                           | 🟡 Partial | 6/6            | 5/6            | 8/4             | 4/6              | APIs + cols match                                                                                                                                                                                |
| sorting                  | sorting                         | ✅ Full    | 29/18          | 14/10          | 27/5            | 7/8              | **Per audit**                                                                                                                                                                                    |
| statistics               | statistics + partner-statistics | 🟡 Partial | 0/10           | 0/0            | 0/4             | 46/32            | **Large gap**: 14 routes missing (46→32); complex reporting module                                                                                                                               |
| status                   | statuses                        | 🟡 Partial | 6/6            | 6/4            | 9/4             | 3/5              | Renamed; 2 API methods missing                                                                                                                                                                   |
| supports                 | supports                        | 🟡 Partial | 8/12           | 11/12          | 8/7             | 4/6              | APIs + hooks close                                                                                                                                                                               |
| telegram-bot-users       | telegram-bot-users              | 🟡 Partial | 6/8            | 2/2            | 3/1             | 1/2              | APIs match                                                                                                                                                                                       |
| ticket-templates         | ticket-templates                | 🟡 Partial | 3/4            | 4/4            | 7/2             | 4/5              | APIs match; hooks reduced (7→2)                                                                                                                                                                  |
| transactions             | transactions                    | 🟡 Partial | 12/14          | 6/7            | 5/1             | 3/4              | APIs match; hooks severely reduced (5→1)                                                                                                                                                         |
| transportationConditions | transportation-conditions       | 🟡 Partial | 0/0            | 2/2            | 1/0             | 2/2              | Renamed; APIs + routes match                                                                                                                                                                     |
| united-declarations      | (→ declarations)                | ✅ Full    | 24/—           | 4/—            | 4/—             | 2/—              | Folded into declarations; covered by declarations audit                                                                                                                                          |
| united-pool              | united-queues                   | 🟡 Partial | 7/7            | 1/1            | 3/2             | 3/5              | Renamed; APIs + cols match                                                                                                                                                                       |
| united-returns           | united-returns                  | 🟡 Partial | 6/7            | 6/6            | 8/4             | 4/6              | APIs match                                                                                                                                                                                       |
| users                    | users                           | 🟡 Partial | 12/19          | 19/18          | 17/9            | 7/9              | APIs close (19→18); hooks significantly reduced (17→9)                                                                                                                                           |
| warehouse                | warehouse                       | 🟡 Partial | 8/10           | 5/5            | 10/4            | 3/4              | APIs + cols match                                                                                                                                                                                |

---

## Totals

**59 old modules** (counting archived-declarations and united-declarations as separate entries)

| Status                | Count | Modules                                                                                                                                                                                                                                          |
| --------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ✅ Fully migrated     | 15    | cashbacks, couriers, customs, declarations _(+archived-declarations +united-declarations)_, flights, models, notifier, orders, plans, refunds, sorting, **currency-rates** _(dissolved → transactions)_, **export** _(dissolved → shared/hooks)_ |
| 🟡 Partially migrated | 44    | all remaining modules including settings                                                                                                                                                                                                         |
| ❌ Not migrated       | 0     | —                                                                                                                                                                                                                                                |

**25% fully migrated · 75% partially migrated · 0% not migrated** (of 59 old modules)

---

## New-only modules (no old counterpart)

These exist in `delivery_management_new` but have no direct match in old project:

| New module         | Likely origin                 | Notes                                                                       |
| ------------------ | ----------------------------- | --------------------------------------------------------------------------- |
| country            | possible split from countries | Stub: 0 hooks/services                                                      |
| me                 | auth module rewrite           | Login/register                                                              |
| partner-statistics | split from statistics         | 1 route, 2 hooks                                                            |
| statuses           | renamed from `status`         | Has counterpart — counted above                                             |
| system-settings    | split from settings           | 7 of 9 settings containers; missing branches-settings + warehouses-settings |
| united-queues      | renamed from `united-pool`    | Has counterpart — counted above                                             |

---

## Existing Deep Audit Docs

| Module       | Doc                                                                     | Verdict |
| ------------ | ----------------------------------------------------------------------- | ------- |
| cashbacks    | [docs/cashbacks-migration-audit.md](cashbacks-migration-audit.md)       | ✅ Full |
| couriers     | [docs/couriers-migration-audit.md](couriers-migration-audit.md)         | ✅ Full |
| customs      | [docs/customs-migration-audit.md](customs-migration-audit.md)           | ✅ Full |
| declarations | [docs/declarations-migration-audit.md](declarations-migration-audit.md) | ✅ Full |
| flights      | [docs/flights-migration-audit.md](flights-migration-audit.md)           | ✅ Full |
| models       | [docs/models-migration-audit.md](models-migration-audit.md)             | ✅ Full |
| notifier     | [docs/notifier-migration-audit.md](notifier-migration-audit.md)         | ✅ Full |
| orders       | [docs/orders-migration-audit.md](orders-migration-audit.md)             | ✅ Full |
| plans        | [docs/plans-migration-audit.md](plans-migration-audit.md)               | ✅ Full |
| refunds      | [docs/refunds-migration-audit.md](refunds-migration-audit.md)           | ✅ Full |
| sorting      | [docs/sorting-migration-audit.md](sorting-migration-audit.md)           | ✅ Full |

---

## Priority Queue for Deep Audits

Ordered by urgency (gap size × business criticality):

1. **settings** 🟡 — `system-settings` has 7 of 9 containers; `branches-settings` and `warehouses-settings` are missing; these cover branch configuration and warehouse configuration forms
2. **statistics** 🟡 — 46 routes in old vs 32 in new (14 missing); largest module by route count; reporting dashboards are user-visible
3. **users** 🟡 — 19 API methods (close at 18 new), hooks halved (17→9); admin user management is core workflow
4. **cash-flow** 🟡 — Old was 6 sub-modules (analytics, cash-registers, currencies, operations, transactions, cash-flow); new merged into 1 with 15 routes but 0 service methods detected — wiring needs verification
5. **azerpost-queues** 🟡 — Queue management module; hooks 5→2 raises concern about missing action flows
6. **coupons** 🟡 — Column count gap (23→10) is suspicious; table likely missing many columns
7. **partner-box-acceptance** 🟡 — Hooks 4→1 in a user-facing acceptance workflow
8. **branches** 🟡 — 9 APIs match but hooks halved (11→6); important logistics module
9. **boxes** 🟡 — 10 APIs match but hooks 13→7; box management is core to delivery flow
10. **transactions** 🟡 — Hooks severely reduced (5→1); financial records module
