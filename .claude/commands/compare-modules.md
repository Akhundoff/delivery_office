---
description: 'Strict 1-vs-1 deep comparison between an old and a new module. Usage: /compare-modules <old-module-path> <new-module-path>'
---

You are doing a strict, exhaustive 1-vs-1 comparison between exactly two modules — one from the old project, one from the new — without assuming they share a name or a clean boundary.

Arguments: $ARGUMENTS

Parse args as: `<old-module-path> <new-module-path>`, where each is a path relative to its project's modules root, e.g.:

- `/compare-modules archived-declarations declarations` → compares `../delivery_management/src/@next/modules/archived-declarations/` against `src/modules/declarations/`
- `/compare-modules united-declarations united-declarations` → same-name comparison

If either argument is missing, ask the user for the two module paths before doing anything else.

This command is **read-only** — it never edits application code, only writes the comparison doc.

---

## Why this exists (vs. `/migration-report`)

`/migration-report <module>` assumes old and new modules share a name. Use `/compare-modules` when modules were split, merged, or renamed.

---

## Comparison method — EVERY line, EVERY item

Resolve both paths:

- Old root: `../delivery_management/src/@next/modules/<old-module-path>/`
- New root: `src/modules/<new-module-path>/`

Read both completely before writing anything. Then compare exhaustively — enumerate, don't sample:

### 1. Table Columns (line-by-line)

- Read old `use-*-table-columns.tsx` completely
- List EVERY column with: `id` (query key), `Header` text, `accessor`, `Cell` component, `Filter` component, column width/size
- Compare each column against new module: same id, same header, same cell renderer, same filter, same width
- Check column ORDER matches exactly
- Check ALL tables if module has multiple (main list + sub-tables)

### 2. Query Keys (exact match)

- Find old query keys object
- Every key used as column `id`, filter param, or sort param must be identical in new module
- These are API query parameters — changing them breaks server-side filtering/sorting

### 3. Column Cell Components (every renderer)

- List every custom cell: state tags, check cells, user cells, currency formatting, link cells, declaration cells
- Verify each has an equivalent in the new module with same rendering logic

### 4. APIs / Service Methods (every endpoint)

- Read every file in old `repos/`
- For each repo method document: endpoint URL, HTTP verb, request body field names, query params, response type
- Verify new `services/index.ts` has matching static method with: same endpoint, same verb, same field names
- Special attention to:
  - Excel exports: blob download with `URL.createObjectURL` + anchor click + filename pattern
  - Print/document: `window.open` with auth token in URL
  - Bulk operations: same request shape (array of ids, etc.)

### 5. Action Columns / Row Menu (every item)

- Read old `actionsColumn` or row menu definition
- List EVERY menu item: label, icon, handler type (navigate/API call/modal), dividers, sub-menus
- List permission guards on items (e.g. `can('deletecourier')`)
- List confirmation dialogs (Modal.confirm) with exact title and content text
- Verify each in new module

### 6. Header Actions / Action Bar (every button)

- Read old `use-*-action-bar.ts` + container
- List EVERY action: label, icon, handler, selection-dependent visibility
- Include: create, export, bulk status change, bulk delete, assign, handover, azerpost operations, print, counts-by-status link
- Verify each in new module

### 7. Routes (every path)

- Read old `router/*.router.tsx` (page AND modal)
- List EVERY route: path, component, type (page/modal)
- Modal routes: check `{ background: location }` pattern
- Dynamic segments (`:id`, `:id(\d+)+`) must be preserved
- Verify each in new module

### 8. Hooks (every hook)

- List every hook: filename, responsibility, return values, dependencies
- Table hooks: pagination, sorting, filtering logic
- Form hooks: field definitions, validation rules, submit handler
- Action hooks: side effects (messages, modals, navigation)
- Verify each in new module's `hooks/<camelCase>/`

### 9. Containers (every container)

- List every container: what hooks it uses, what UI it renders, what events it handles
- Verify each in new module

### 10. Components (every component)

- List every component: props, rendering logic
- Verify each in new module

### 11. Pages (every page)

- List every page: what it composes (action bar + table, detail + tabs, form)
- Verify each in new module

### 12. Permissions (every guard)

- Grep for all `can('...')` in old module
- List permission key + what it guards
- Verify same guard in new module

### 13. Interfaces (every type)

- List every interface with field names
- Verify in new module

For each item, classify as:

- ✅ **Equivalent** — present and wired the same way (architecture differences ok; missing behavior is not)
- 🔁 **Present but different** — exists on both sides but differs (describe delta precisely)
- ➖ **Old-only** — exists in old, no counterpart in new
- ➕ **New-only** — exists in new with no old counterpart

---

## Output

Write `docs/compare-<old-slug>-vs-<new-slug>.md`:

```markdown
# Module Comparison — `<old-module-path>` vs `<new-module-path>`

**Date:** YYYY-MM-DD
**Old:** `delivery_management/src/@next/modules/<old-module-path>`
**New:** `delivery_management_new/src/modules/<new-module-path>`

## Summary

<one paragraph: alignment assessment>

## Scale Check

| Category           | Old count | New count | Status |
| ------------------ | --------- | --------- | ------ |
| Table columns      | X         | Y         | ✅/❌  |
| Query keys         | X         | Y         | ✅/❌  |
| API methods        | X         | Y         | ✅/❌  |
| Row menu items     | X         | Y         | ✅/❌  |
| Action bar actions | X         | Y         | ✅/❌  |
| Hooks              | X         | Y         | ✅/❌  |
| Containers         | X         | Y         | ✅/❌  |
| Components         | X         | Y         | ✅/❌  |
| Pages              | X         | Y         | ✅/❌  |
| Routes (page)      | X         | Y         | ✅/❌  |
| Routes (modal)     | X         | Y         | ✅/❌  |
| Permissions        | X         | Y         | ✅/❌  |

## Table Columns

| #   | Header  | Query Key | Cell    | Filter | Old | New | Status |
| --- | ------- | --------- | ------- | ------ | --- | --- | ------ |
| 1   | M. kodu | user.id   | default | none   | ✅  | ✅  | ✅     |
| ... | ...     | ...       | ...     | ...    | ... | ... | ...    |

## Row Menu Items

| #   | Label       | Icon               | Handler         | Permission | Status |
| --- | ----------- | ------------------ | --------------- | ---------- | ------ |
| 1   | Ətraflı bax | FileSearchOutlined | navigate detail | none       | ✅/➖  |
| ... | ...         | ...                | ...             | ...        | ...    |

## Action Bar

| #   | Action | Type   | Handler         | Needs selection? | Status |
| --- | ------ | ------ | --------------- | ---------------- | ------ |
| 1   | Create | button | navigate create | no               | ✅/➖  |
| ... | ...    | ...    | ...             | ...              | ...    |

## Services / API

| #   | Old method  | Endpoint            | Verb | Fields       | New method  | Status |
| --- | ----------- | ------------------- | ---- | ------------ | ----------- | ------ |
| 1   | getCouriers | /api/admin/couriers | GET  | query params | getCouriers | ✅/➖  |
| ... | ...         | ...                 | ...  | ...          | ...         | ...    |

## Routes

| #   | Path      | Type | Component    | Status |
| --- | --------- | ---- | ------------ | ------ |
| 1   | /couriers | page | CouriersPage | ✅/➖  |
| ... | ...       | ...  | ...          | ...    |

## Hooks

| #   | Old hook | Responsibility | New hook | Status |
| --- | -------- | -------------- | -------- | ------ |
| ... | ...      | ...            | ...      | ...    |

## Containers

| #   | Old | New | Status | Notes |
| --- | --- | --- | ------ | ----- |
| ... | ... | ... | ...    | ...   |

## Components

| #   | Old | New | Status | Notes |
| --- | --- | --- | ------ | ----- |
| ... | ... | ... | ...    | ...   |

## Permissions

| #   | Key | Guards | Old location | New location | Status |
| --- | --- | ------ | ------------ | ------------ | ------ |
| ... | ... | ...    | ...          | ...          | ...    |

## Verdict

<✅ Equivalent · 🟡 Mostly equivalent (N deltas) · ❌ Significantly diverged — plus the single most important thing to fix first>

## All ➖/🔁 Deltas

<numbered list of every gap/difference, grouped by category, with exact file references>
```

## Accuracy rules

- Every ✅ must be backed by reading actual wiring on both sides — not name similarity
- Every ➖ must be backed by confirmed grep-for-it-and-found-nothing in the new module
- Column-level, menu-item-level, button-level granularity — never "table mostly matches"
- If uncertain, mark ⚠️ **needs verification** and say what would resolve it

## Report back

Print the verdict and the full deltas list. Tell the user the doc location.
