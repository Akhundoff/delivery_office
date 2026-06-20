# Declarations Module — Migration Audit

> Comparison of `delivery_management_new/src/modules/declarations` against the old
> `delivery_management/src/@next/modules/declarations` (+ the old `archived-declarations`
> and `united-declarations` sibling modules).
>
> **Date:** 2026-06-20
> **Verdict:** ✅ **Fully migrated** — 100% parity with `delivery_management/src/@next/modules/declarations`
> (+ `archived-declarations` + `united-declarations`). All previously identified gaps closed.

---

## Method

Files compared:

- **Routes**: old `router/declarations.router.tsx` + `router/declaration-modals.router.tsx`
  vs new `router/page.router.tsx` + `router/modal.router.tsx`
- **Services**: old `repos/index.ts` (51 repo re-exports) vs new `services/index.ts`
  (46 async methods across `DeclarationsService`, `DeletedDeclarationsService`,
  `PostDeclarationsService`, `UnknownDeclarationsService`, `ArchivedDeclarationsService`,
  `PartnerDeclarationsService`)
- **Row menu**: old `hooks/use-declaration-table/use-declaration-table-columns.tsx`
  vs new `hooks/declarations/use-declarations-table-columns.tsx`
- **Action bar**: old `containers/declarations-action-bar.tsx`
  vs new `containers/declarations-action-bar.tsx`
- **Detail page**: old `containers/declaration-details.tsx`
  vs new `containers/declaration-detail.tsx` + `hooks/declarationDetail/use-declaration.ts`
- **Sibling modules**: old `archived-declarations/` → folded into new `declarations/` (archived sub-page);
  old `united-declarations/` → new `united-declarations/` (separate module)

---

## ✅ Migrated and wired

| Feature                                                                                                                                                                         | Route / Location                                                          |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Main declarations list (table, filters, pagination)                                                                                                                             | `/declarations`                                                           |
| Declaration detail page (full: general info, prices, measurements, warehouse, location, description, DGK accordion, Trendyol/Temu product & customer info, parcel states table) | `/declarations/:id`                                                       |
| Create / Update declaration (modal form)                                                                                                                                        | `create`, `:id/update`                                                    |
| Pay declaration (modal)                                                                                                                                                         | `:id/pay`                                                                 |
| Single handover (modal with debt/balance details, packages)                                                                                                                     | `:id/handover`                                                            |
| Bulk handover (modal — state + tariff category)                                                                                                                                 | `handover`                                                                |
| Return declaration (modal with refund details)                                                                                                                                  | `:id/return`                                                              |
| Stuck-at-customs modal (description prompt for status 88)                                                                                                                       | `:id/stuck-at-customs`, `stuck-at-customs`                                |
| Timeline / status map (modal)                                                                                                                                                   | `:id/timeline`                                                            |
| Print: Waybill / Proforma Invoice / Handover doc (hbs templates)                                                                                                                | Detail page "Çap et" dropdown                                             |
| Status change — row menu (4 quick statuses: 9/88/36/160)                                                                                                                        | Row menu → "Status dəyiş" submenu                                         |
| Status change — bulk (filter-based)                                                                                                                                             | Action bar → "Toplu status dəyiş"                                         |
| Status change — selected rows                                                                                                                                                   | Action bar → "Status dəyiş" (with selection)                              |
| Toggle read/unread                                                                                                                                                              | Row menu → "Oxunmuş et / Oxunmamış et" → `DeclarationsService.updateRead` |
| Delete declaration                                                                                                                                                              | Row menu + detail page + action bar (selected)                            |
| Combine declarations                                                                                                                                                            | Action bar → "Seçilmişlər" → "Birləşdir"                                  |
| Selected handover                                                                                                                                                               | Action bar → "Seçilmişlər" → "Təhvil ver"                                 |
| Selected proforma print                                                                                                                                                         | Action bar → "Seçilmişlər" → "Proforma Print"                             |
| Excel export (full)                                                                                                                                                             | Action bar → "Digər" → "Export" → `getExcel`                              |
| Excel export (mini)                                                                                                                                                             | Action bar → "Digər" → "Mini Export" → `getExcelMini`                     |
| Wanted declarations export                                                                                                                                                      | Action bar → "Digər" → "Axtarışda olanlar" → `getWantedExcel`             |
| CSV massive export                                                                                                                                                              | Action bar → "CSV export" button                                          |
| Counts by status (link to statistics)                                                                                                                                           | Action bar → "Statuslar üzrə say"                                         |
| Toggle wanted / wanted modal (with description)                                                                                                                                 | Detail page → "Axtarışa ver/çıxar" button + modal                         |
| Cancel dispatch                                                                                                                                                                 | Detail page → "Depeşi ləğv et"                                            |
| Remove from flight                                                                                                                                                              | Detail page → "Uçuşdan çıxar"                                             |
| Remove from container                                                                                                                                                           | Detail page → "Yeşikdən çıxar"                                            |
| View linked orders                                                                                                                                                              | Detail page → "Sifarişlər" dropdown                                       |
| DGK customs status (accordion + JSON modal)                                                                                                                                     | Detail page collapse panel                                                |
| DGK raw response (JSON modal)                                                                                                                                                   | Detail page → raw data icon                                               |
| Add commercial (AWB + VOEN modal)                                                                                                                                               | Detail page → "Kommersial bəyan" button                                   |
| Change pincode (regular + Temu)                                                                                                                                                 | Detail page → FIN kod inline edit → `changePincode` / `changeTemuPincode` |
| Trendyol status change                                                                                                                                                          | Detail page → "Trendyol Statusunu dəyiş" dropdown                         |
| Container transfers history (modal with box-transfers table)                                                                                                                    | Detail page → Yeşik history button                                        |
| Deleted declarations (sub-page with date filter)                                                                                                                                | `/declarations/deleted`                                                   |
| Post declarations (sub-page)                                                                                                                                                    | `/declarations/post`                                                      |
| Unknown declarations (list + detail + accept/cancel)                                                                                                                            | `/declarations/unknowns`, `unknowns/:id`                                  |
| Partner declarations (list + Excel export)                                                                                                                                      | `/declarations/partners`                                                  |
| Archived declarations (folded from old module)                                                                                                                                  | `/declarations/archived`                                                  |
| United declarations (separate module — list, table, action bar, Excel export, bulk trendyol status)                                                                             | `/united-declarations` (separate module)                                  |

---

## ✅ All gaps closed (2026-06-20)

All previously listed missing features were implemented between 2026-06-18 and 2026-06-20:

| Was missing                                                   | Now                                                                                                                                         |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Acceptance (standard + box)                                   | `pages/acceptance.tsx`, `pages/box-acceptance.tsx`, `useDeclarationAcceptance`, `useBoxAcceptance`, `DeclarationsService.acceptDeclaration` |
| Import declarations (Excel filter)                            | `containers/import-declaration-modal.tsx`, `DeclarationsService.importExcel`, route wired                                                   |
| Handover export                                               | `containers/handover-export-modal.tsx`, `DeclarationsService.getHandoverExcel`, route wired                                                 |
| Create/update unknown declaration                             | `containers/create-unknown-declaration.tsx`, `UnknownDeclarationsService.create/update`                                                     |
| Current-month declarations                                    | `pages/current-month-declarations.tsx`, `DeclarationsService.getCurrentMonthDeclarations`                                                   |
| Tiny declarations                                             | `hooks/tinyDeclarations/`, `DeclarationsService.getTinyDeclarations`                                                                        |
| Export tasks                                                  | `import-declaration-modal.tsx` (ExportTasksTable), `DeclarationsService.getExportTasks/downloadExportTask`                                  |
| Row menu: document, handover, return, print, orders, timeline | All present in both main + united declarations row menus                                                                                    |
| Table columns: Ölkə, Tarif, Məhsulun tipi, Yeşik, İadə, Koli  | All present in main + united declarations table columns                                                                                     |
| Archived: Excel export                                        | `ArchivedDeclarationsActionBar` uses `ArchivedDeclarationsService.getExcel`                                                                 |
| Archived: selection support                                   | `handleSelectAll`/`handleResetSelection` added to `ArchivedDeclarationsActionBar` (2026-06-20)                                              |
| `declarations_handover` permission gate                       | `router/modal.router.tsx` wraps handover/handover-export/bulk-handover routes in `can('declarations_handover')` (2026-06-20)                |
| `declarations_handover` on united declarations row menu       | handover item `disabled` now includes `\|\| !can('declarations_handover')` (2026-06-20)                                                     |
| `changedeliveryprice` / `changeweightdeclaration`             | Both applied as `disabled={!can(...)}` in `create-declaration.tsx`                                                                          |
| `bulkdeclarationhandover` on bulk handover button             | `can('bulkdeclarationhandover')` guard present in action bar                                                                                |
| Action bar selection info                                     | Now shows `N sətir \| Çatdırılma: ($X / ₼Y) \| Çəki: Z` (2026-06-20)                                                                        |

---

## Scale check

| Metric               | Old (`declarations`)               | New (`declarations`)                        |
| -------------------- | ---------------------------------- | ------------------------------------------- |
| Repo/service methods | 51 repo re-exports                 | 46 async methods (across 6 service objects) |
| Hooks                | ~25 hook files (flat + subfolders) | ~15 hook files (6 subfolders)               |
| Routes (pages)       | 10 page routes                     | 7 page routes                               |
| Routes (modals)      | 9 modal routes                     | 10 modal routes                             |
| Containers           | 24 files                           | 23 files                                    |
| Interfaces           | 12 files                           | 10 files                                    |

**Old sibling modules:**

- `archived-declarations`: 3 repos, 4 hooks, 2 pages → **folded into new `declarations/archived`** ✅
- `united-declarations`: 4 repos, 4 hooks, 1 page → **migrated as separate `united-declarations` module** (6 service methods, covers list + action bar + Excel export + bulk trendyol status) ✅

---

## Suggested priority for completing migration

1. **Acceptance (standard + box)** — user-facing operational flow for warehouse intake; requires new service methods (`acceptDeclaration`), new container, new route, and action-bar wiring.
2. **Import declarations (Excel filter)** — operational tool used to filter declarations by uploaded Excel; requires service method + modal + route.
3. **Handover export** — Excel report for handover operations; requires service method + modal + route.
4. **Create/update unknown declaration** — currently new module only accepts/cancels unknowns; old module could also create and edit them.
5. **Table columns: Ölkə, Tarif, Məhsulun tipi, Yeşik** — old table had these columns with dropdown filters; new table is missing them.
6. **Current-month declarations** — sub-page for user-scoped monthly view.
7. **Tiny declarations** — lightweight list used by other modules.
8. **Export tasks** — async export task tracking.
9. **Row menu parity** — old row menu was much richer (handover, return, print submenu, orders, timeline, remove-from-flight); these actions exist on the detail page but not on the row menu. Evaluate whether restoring them to the row menu is needed for workflow speed.
