---
description: 'Audit migration status from delivery_management to delivery_management_new. Usage: /migration-report [module-name]'
---

You are auditing migration progress from the old project (`delivery_management`, DI/Redux architecture under `src/@next/modules/`) to this rewrite (`delivery_management_new`, context+hooks architecture under `src/modules/`).

Argument: $ARGUMENTS

This command is **read-only** — it never edits application code. It only writes/updates report docs under `docs/`.

---

## Mode selection

- **No argument** → run the **Project-wide summary** (Mode A).
- **A module name given** → run the **Per-module deep audit** (Mode B) for that module.

---

## Mode A — Project-wide summary

1. List every module under `../delivery_management/src/@next/modules/` (old) and every module under `src/modules/` (new).
2. For each old module, determine whether it has a clear counterpart in the new project. Note 1:1 matches, splits, and merges.
3. For each old module (or group), do a **lightweight** comparison — route count, service/repo method count, hook count, table column count, action bar buttons, row menu items — enough to classify it:
   - ✅ **Fully migrated** — all categories match: routes, services, hooks, columns, actions, components, pages, permissions
   - 🟡 **Partially migrated** — core flows exist but gaps remain in any category
   - ❌ **Not migrated** — no counterpart or only a stub
4. If a per-module audit doc already exists, read its verdict and reuse it — link to it.
5. Output a single summary table:

```markdown
# Migration Status — Project Summary

**Date:** YYYY-MM-DD

| Old module | New module(s) | Status     | Columns | APIs  | Hooks | Routes | Actions | Notes                         |
| ---------- | ------------- | ---------- | ------- | ----- | ----- | ------ | ------- | ----------------------------- |
| couriers   | couriers      | 🟡 Partial | 12/13   | 18/23 | 8/12  | 5/8    | 6/10    | missing deliverer-assignments |
| orders     | orders        | ✅ Full    | 15/15   | 20/20 | 10/10 | 6/6    | 12/12   |                               |
| ...        | ...           | ...        |         |       |       |        |         |                               |

**Totals:** X fully migrated · Y partially migrated · Z not migrated (of N old modules)
```

6. Save to `docs/migration-status-summary.md`.
7. Print the table and call out which modules most urgently need a deep audit.

---

## Mode B — Per-module deep audit (`/migration-report <module-name>`)

### 1. Locate both sides

- Old: `../delivery_management/src/@next/modules/<module-name>/` (also check sibling modules that may have been folded in)
- New: `src/modules/<module-name>/`

If the new module doesn't exist, verdict is ❌ **Not migrated** — list everything from the old module as missing.

### 2. Compare exhaustively — ALL categories, ALL items, line by line

Go through **every** category below. Do not summarize or sample — enumerate every single item:

#### 2a. Table Columns

- Read old `use-*-table-columns.tsx` completely
- List EVERY column with: `id` (query key), `Header` text, `accessor` field, `Cell` component, `Filter` component, column width
- For each column, check if it exists in the new module with identical id, header, cell, and filter
- Check column ORDER matches
- If multiple tables exist (main table + sub-tables), check ALL of them

#### 2b. Query Keys

- Find old query keys object (e.g. `courierQueryKeys`)
- List every key and verify it exists identically in the new module
- These are the filter/sort parameter names sent to the API — they must be exact

#### 2c. Column Cell Components

- List every custom cell renderer used in old columns: `CourierStateTag`, `CheckCell`, `UserCell`, `CurrencySymbols` formatting, link cells, etc.
- Verify each has an equivalent component in the new module

#### 2d. APIs / Service Methods

- Read every file in old `repos/` directory
- List every repo method with: endpoint URL, HTTP verb, request parameters/body field names, response type
- For each, check if new `services/index.ts` has a matching static method with same endpoint, verb, and field names
- Pay special attention to: excel export endpoints (blob handling), print/document endpoints (window.open + auth token), bulk operation endpoints

#### 2e. Action Columns / Row Menu Items

- Read the old `actionsColumn` in the table columns hook
- List EVERY menu item with: label text, icon component, handler action (navigate, API call, modal)
- List menu dividers and sub-menus (e.g. status change sub-menu)
- List permission guards on menu items (e.g. `can('deletecourier')`)
- Verify each exists in the new module with same label, icon, handler, and guard

#### 2f. Header Actions / Action Bar

- Read old `use-*-action-bar.ts` and corresponding container
- List EVERY action with: button/dropdown label, icon, handler (create, export, bulk status, bulk delete, assign, handover, azerpost ops, print)
- List selection-dependent behavior (which buttons appear only when rows are selected)
- Verify each exists in the new module

#### 2g. Navigations / Routes

- Read old `router/*.router.tsx` (page router AND modal router)
- List EVERY route with: path pattern, component, type (page vs modal)
- For modals: note `{ background: location }` state pattern
- Verify each exists in the new module's router

#### 2h. Hooks

- List every hook file in old `hooks/` with: filename, responsibility, return values, data dependencies
- Verify each has a counterpart in new `hooks/<camelCase>/`
- Check table hooks have same pagination, sorting, filtering logic
- Check form hooks have same field validation

#### 2i. Containers

- List every container in old `containers/`
- Verify each has a counterpart rendering the same UI structure with same event handlers

#### 2j. Components

- List every component in old `components/`
- Verify each has a counterpart with same props and rendering logic

#### 2k. Pages

- List every page in old `pages/`
- Verify composition: list pages = action bar + table, detail pages = detail info + sub-tables, modal pages = forms

#### 2l. Interfaces / Types

- List every interface in old `interfaces/`
- Verify field names match API response exactly

#### 2m. Permissions / Guards

- Grep for all `can('...')` in old module
- List each permission key and what it guards (route, button, menu item)
- Verify same key guards same element in new module

### 3. Write the report

Write/overwrite `docs/<module-name>-migration-audit.md`:

```markdown
# <Module> Module — Migration Audit

> Comparison of `delivery_management_new/src/modules/<module-name>` against
> `delivery_management/src/@next/modules/<module-name>` [+ sibling modules].
>
> **Date:** YYYY-MM-DD
> **Verdict:** <✅ Fully migrated | 🟡 Partially migrated | ❌ Not migrated> — <summary>

## Method

<exact file paths compared on both sides>

## Scale Check

| Category                   | Old count | New count | Match? |
| -------------------------- | --------- | --------- | ------ |
| Table columns (main)       | X         | Y         | ✅/❌  |
| Table columns (sub-tables) | X         | Y         | ✅/❌  |
| Query keys                 | X         | Y         | ✅/❌  |
| API / service methods      | X         | Y         | ✅/❌  |
| Row menu items             | X         | Y         | ✅/❌  |
| Action bar buttons         | X         | Y         | ✅/❌  |
| Hooks                      | X         | Y         | ✅/❌  |
| Containers                 | X         | Y         | ✅/❌  |
| Components                 | X         | Y         | ✅/❌  |
| Pages                      | X         | Y         | ✅/❌  |
| Routes (page)              | X         | Y         | ✅/❌  |
| Routes (modal)             | X         | Y         | ✅/❌  |
| Permissions                | X         | Y         | ✅/❌  |

## Table Columns — Detailed Comparison

| #   | Column Header   | Query Key (id) | Cell Component | Filter | Old | New | Status |
| --- | --------------- | -------------- | -------------- | ------ | --- | --- | ------ |
| 1   | M. kodu         | user.id        | default        | none   | ✅  | ✅  | ✅     |
| 2   | Kuryer trak kod | id             | default        | none   | ✅  | ✅  | ✅     |
| ... | ...             | ...            | ...            | ...    | ... | ... | ...    |

## Row Menu Items — Detailed Comparison

| #   | Label       | Icon               | Handler                | Permission | Status |
| --- | ----------- | ------------------ | ---------------------- | ---------- | ------ |
| 1   | Ətraflı bax | FileSearchOutlined | navigate to detail     | none       | ✅/❌  |
| 2   | Düzəliş et  | EditOutlined       | navigate to edit modal | none       | ✅/❌  |
| ... | ...         | ...                | ...                    | ...        | ...    |

## Action Bar — Detailed Comparison

| #   | Action       | Type   | Handler                  | Selection required? | Status |
| --- | ------------ | ------ | ------------------------ | ------------------- | ------ |
| 1   | Create       | button | navigate to create modal | no                  | ✅/❌  |
| 2   | Export Excel | button | download blob            | no                  | ✅/❌  |
| ... | ...          | ...    | ...                      | ...                 | ...    |

## API Methods — Detailed Comparison

| #   | Old repo method  | Endpoint                  | Verb | New service method | Status |
| --- | ---------------- | ------------------------- | ---- | ------------------ | ------ |
| 1   | getCouriers      | /api/admin/couriers       | GET  | getCouriers        | ✅/❌  |
| 2   | getCouriersExcel | /api/admin/couriers/excel | GET  | getCouriersExcel   | ✅/❌  |
| ... | ...              | ...                       | ...  | ...                | ...    |

## Routes — Detailed Comparison

| #   | Path pattern     | Type  | Component          | Status |
| --- | ---------------- | ----- | ------------------ | ------ |
| 1   | /couriers        | page  | CouriersPage       | ✅/❌  |
| 2   | /couriers/:id    | page  | CourierDetailsPage | ✅/❌  |
| 3   | /couriers/create | modal | CreateCourierPage  | ✅/❌  |
| ... | ...              | ...   | ...                | ...    |

## Hooks — Detailed Comparison

| #   | Old hook                   | Responsibility                      | New hook                   | Status |
| --- | -------------------------- | ----------------------------------- | -------------------------- | ------ |
| 1   | use-couriers-table-columns | table column definitions + row menu | use-couriers-table-columns | ✅/❌  |
| ... | ...                        | ...                                 | ...                        | ...    |

## Permissions — Detailed Comparison

| #   | Permission key | Guards                 | Old location                     | New location | Status |
| --- | -------------- | ---------------------- | -------------------------------- | ------------ | ------ |
| 1   | deletecourier  | row menu delete button | containers/couriers-table.tsx:45 | —            | ❌     |
| ... | ...            | ...                    | ...                              | ...          | ...    |

## ✅ Migrated and wired

<table: Feature | Category | Route/Location — only things confirmed present AND wired>

## ❌ Missing / not migrated

<table: Feature | Category | Old location | What's needed — every gap, no matter how small>

## Suggested priority for completing migration

<ordered list by category, most user-facing first>
```

### 4. Accuracy rules

- Every claim of "migrated" must be backed by reading the actual wiring — not just file existence
- Every claim of "missing" must be backed by confirmed absence (grep for it)
- If uncertain, mark ⚠️ **needs verification** rather than guessing
- Column-level, menu-item-level, and button-level granularity — never summarize "table is mostly done"

### 5. Report back

Print the verdict and the detailed comparison tables to the user. Tell them the doc was saved to `docs/<module-name>-migration-audit.md`.
