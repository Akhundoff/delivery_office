---
description: 'Bring a module to 100% feature parity with the old project. Usage: /migrate-module <module-name>'
---

You are completing the migration of one module from `delivery_management` (old, DI/Redux, `src/@next/modules/`) to `delivery_management_new` (this rewrite, context+hooks, `src/modules/`).

Module: $ARGUMENTS

**The bar is 100% parity.** Every single element that exists in the old module must exist and be wired in the new one. Partial migration is a fail.

---

## Strict Parity Rules — EVERY line, EVERY item must match

The following checklist defines what "100% parity" means. Every item in every category must be accounted for — not "most", not "the important ones", ALL of them.

### 1. Table Columns (EXACT match)

- Read the old `use-*-table-columns.tsx` line by line
- Every column in the old table must exist in the new table with:
  - **Same `id` / query key** — the column filter key sent to the API must be identical
  - **Same `Header` text** — the displayed column header text must be identical
  - **Same `accessor`** — pointing to the same data field
  - **Same `Cell` component** — if the old column uses a custom cell renderer (e.g. `CourierStateTag`, `CheckCell`, `UserCell`, `CouriersTableDeclarationsCell`), the new one must use the equivalent component
  - **Same `Filter` component** — if the old column has a filter (Select, Checkbox, DatePicker), the new one must have the same filter type with the same data source
  - **Same column width/size** — `tableColumns.small`, `tableColumns.normal`, `tableColumn(150, 'px')` etc.
  - **Same conditional rendering** — if a column is conditionally shown/hidden based on permissions or state, replicate that logic
- Column ORDER must match the old module exactly
- If there are multiple tables in the module (e.g. main list + detail sub-tables like deliverer-assignments), ALL tables must be checked

### 2. Query Keys (EXACT match)

- Find the old module's query keys object (e.g. `courierQueryKeys`, `declarationQueryKeys`)
- Every key used as a column `id`, filter parameter, or sort parameter must be identical in the new module
- These keys map directly to API query parameters — changing them breaks filtering/sorting
- Check: column ids, filter field names, sort field names — all must use the same string values

### 3. Column Cell Components (EXACT match)

- Every custom cell component used in old columns must have an equivalent in the new module
- Examples: `CourierStateTag`, `CheckCell`, `UserCell`, `CouriersTableDeclarationsCell`, `CurrencySymbols` formatting
- If the old cell renders a link, tag, badge, icon, or formatted value — the new cell must render the same
- Currency formatting (e.g. `${value.toFixed(2)} ${CurrencySymbols.AZN}`) must be identical

### 4. APIs / Service Methods (EXACT match)

- Read every file in old `repos/` directory
- Each repo file = one API call = one service method in the new module
- For each:
  - **Same endpoint URL** (e.g. `/api/admin/couriers`)
  - **Same HTTP verb** (GET, POST, PUT, DELETE, PATCH)
  - **Same request body field names** — if old sends `{ courierIds, statusId }`, new must send the same
  - **Same query parameters** — if old sends `?courier_id=X`, new must too
  - **Same response handling** — success/error paths must handle the same status codes
- Excel export endpoints must use the same download mechanism (blob → objectURL → anchor click)
- Print/document endpoints must use the same `window.open` pattern with auth token

### 5. Action Columns / Row Menu (EXACT match)

- Read the old `actionsColumn` or row menu in the table columns hook
- Every menu item must exist in the new module with:
  - **Same label text** (e.g. "Ətraflı bax", "Düzəliş et", "Təhvil ver")
  - **Same icon** (e.g. `FileSearchOutlined`, `EditOutlined`)
  - **Same onClick handler** — navigates to the same route, calls the same API, shows the same confirmation modal
  - **Same dividers** — `Menu.Divider` positions must match
  - **Same sub-menus** — if there's a status change sub-menu, it must exist with the same items
  - **Same permission guards** — if a menu item is wrapped in `can('deletecourier')`, the new one must have the same guard
  - **Same confirmation dialogs** — `Modal.confirm` with the same title and content text

### 6. Header Actions / Action Bar (EXACT match)

- Read the old `use-*-action-bar.ts` hook and corresponding container
- Every action bar button/dropdown must exist with:
  - **Same button labels and icons**
  - **Same handlers**: create, export excel, bulk status change, bulk delete, assign deliverer, handover, azerpost operations, print handing, etc.
  - **Same selection-dependent behavior** — buttons that require row selection must behave identically
  - **Same `selectAll` / `reset` / `resetSelection`** behavior
  - **Same bulk operations** — if old has `bulkUpdateStatus` with confirmation modal showing count, new must too
  - **Same excel export** — same loading message, same filename pattern, same blob download
  - **Same print/document** — same URL construction with auth token

### 7. Navigations / Routes (EXACT match)

- Read old `router/*.router.tsx` (both page router and modal router)
- Every route must exist in the new module:
  - **Page routes**: list page, detail page, sub-pages (e.g. deliverer-assignments)
  - **Modal routes**: create, update/edit, timeline, handover, assign-deliverer, cancel, reject
  - Route paths must be functionally equivalent (adjusted from `/@next/` to new project's base path)
  - `generatePath` patterns with `:id` params must match
  - Modal routes that use `{ background: location }` state must use the equivalent pattern in the new project

### 8. Hooks (EXACT match)

- Every hook file in old `hooks/` must have a counterpart in new `hooks/<camelCase>/`
- For each hook:
  - **Same responsibility** — if old hook fetches data + manages state, new hook must do the same
  - **Same return values** — if old hook returns `{ selection, fetch, reset, create, exportAsExcel, ... }`, new must return equivalent
  - **Same side effects** — loading messages, success/error messages, confirmation modals
  - **Same data dependencies** — if old hook uses `useStatusByModelId('3')`, `useRegions()`, `useBranches()`, new must use equivalent data sources
- Table hooks must include the same pagination, sorting, and filtering logic
- Subfolder naming: camelCase (see CLAUDE.md conventions)

### 9. Containers (EXACT match)

- Every container in old `containers/` must have a counterpart
- Each container must:
  - **Use the same hooks** it used in the old module (translated to new architecture)
  - **Render the same UI structure** — same Ant Design components, same layout
  - **Pass the same props** to child components
  - **Handle the same events** — onClick, onSubmit, onChange etc.

### 10. Components (EXACT match)

- Every component in old `components/` must have a counterpart
- Custom cell renderers, state tags, badges — all must exist
- Same props interface, same rendering logic

### 11. Route Names / Path Constants

- All route path strings must be equivalent
- If old uses `/@next/couriers/:id/update`, new must use the equivalent path for the new project
- Modal vs page distinction must be preserved

### 12. Pages (EXACT match)

- Every page in old `pages/` must have a counterpart
- List pages must compose: action bar + table
- Detail pages must compose: detail info + sub-tables + timeline (if present)
- Modal pages (create/edit forms) must have the same form fields, validation, and submit behavior

### 13. Interfaces / Types (EXACT match)

- Every interface in old `interfaces/` must have a counterpart
- Field names must match API response fields exactly
- Enum values and constants must match

### 14. Permissions / Guards (EXACT match)

- Every `can('permissionName')` check in the old module must exist in the new module
- Same permission key, guarding the same UI element (route, button, menu item)

---

## Phase 1 — Audit (always runs first, no exceptions)

1. If `docs/<module-name>-migration-audit.md` exists **and is dated today**, read it and treat it as the starting point — but spot-check 3-4 of its "Migrated" claims against the actual code before trusting it.
2. Otherwise, perform the full deep audit:
   - Read EVERY file in old `repos/`, `hooks/`, `containers/`, `components/`, `pages/`, `router/`, `interfaces/`, `contexts/`, `mappers/`, `utils/`
   - Read EVERY file in new `services/`, `hooks/`, `containers/`, `components/`, `pages/`, `router/`, `interfaces/`, `context/`
   - Compare line by line using ALL 14 categories above
3. Produce the complete gap list grouped by category with exact old file references.

---

## Phase 2 — Present the plan, then STOP

Do **not** write any code yet. Present to the user:

1. The full gap list from Phase 1, organized by the 14 categories above, with counts per category
2. For each gap, the exact old file + line where the feature exists, and what needs to be created/modified in the new module
3. For table columns: list every column with its id, Header, Cell component, and Filter — marking which are missing
4. For action items: list every menu item / button with its label, icon, and handler — marking which are missing
5. For APIs: list every endpoint with URL, verb, and field names — marking which are missing
6. Ask explicitly:

   > "This will close N gaps across M categories. Proceed with implementation now, or do you want to adjust scope first?"

Wait for explicit go-ahead.

---

## Phase 3 — Implement (only after confirmation)

Work through the confirmed list **in dependency order**: interfaces/types → services → context/reducer → hooks → components → containers → pages → router wiring. For each item:

1. Mark it in-progress.
2. Implement it for real — no stubs, no `// TODO`, no placeholders. Read the old implementation for exact business logic / endpoint / field names / column definitions / menu items / button labels; write the new implementation in this project's patterns.
3. Wire it all the way through — a button with no `onClick`, a route with no link, a column with no data, or a hook nothing calls is **not** done.
4. Verify exact match: same column order, same menu item order, same button positions, same text labels, same icons.
5. Mark it complete and move to the next.

If you discover a gap mid-implementation that wasn't in the original list, add it, tell the user, and keep going.

---

## Phase 4 — Re-verify (mandatory — do not skip)

1. Re-run the full comparison from Phase 1 against the now-updated new module, checking all 14 categories.
2. Specifically verify:
   - Open old table columns file side-by-side with new — every column present, same order, same ids, same cells
   - Open old action bar — every button/handler present
   - Open old row menu — every menu item present with same label/icon/handler
   - Count old repo files vs new service methods — must be equal
   - Count old hooks vs new hooks — must be equal
   - Count old routes vs new routes — must be equal
3. Confirm **zero** remaining gaps. If anything is still missing, go back to Phase 3.
4. Run `npx tsc --noEmit` and confirm it passes.
5. Update `docs/<module-name>-migration-audit.md` to reflect ✅ **Fully migrated**.

---

## Final report

Tell the user:

- Exact counts per category: X columns, Y service methods, Z hooks, W containers, V routes — all matching
- Which files were created/modified
- That `docs/<module-name>-migration-audit.md` now reflects ✅ full parity
- Anything to test manually in the browser (golden path + edge cases)
