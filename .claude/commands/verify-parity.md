---
description: 'Fast post-migration sanity check for one module (build + routes + permissions). Usage: /verify-parity <module-name>'
---

You are running a **fast** sanity check on one module after migration work — this is a smoke test, not a full audit. Use `/migration-report <module-name>` for exhaustive comparison; use this for quick "did I break anything / is everything wired" verification.

Module: $ARGUMENTS

This command is **read-only** — it never edits code.

---

## Checks (in order — stop and report immediately if a blocking check fails)

### 1. Type-check / build (blocking)

```bash
npx tsc --noEmit
```

- Errors inside `src/modules/<module-name>/` → **blocking**, don't continue.
- Errors outside → note but don't block.

### 2. Table Column Parity

- Read old `use-*-table-columns.tsx` and new equivalent
- Quick count: same number of columns?
- Spot-check: first column, last column, and any custom-cell columns — same `id`, same `Header`, same `Cell` component?
- Check column ORDER matches

### 3. Query Key Parity

- Compare old query keys object with new
- Any missing keys = filters/sorting that won't work

### 4. Row Menu Item Parity

- Read old `actionsColumn` row menu
- Count menu items (excluding dividers)
- Spot-check: every permission-guarded item exists, every navigation item points to correct route, every API-calling item calls the service

### 5. Action Bar Parity

- Read old action bar hook/container
- Count actions
- Verify: create, export excel, bulk operations, selection-dependent buttons all present and wired

### 6. API / Service Method Parity

- Count old repo files vs new service methods
- Spot-check 3-4 critical endpoints: same URL, same verb, same field names

### 7. Route Wiring

- Read `src/modules/<module-name>/router/*.router.tsx`
- Count page routes and modal routes — must match old counts
- Confirm every route is mounted — trace to root router
- Flag orphaned routes

### 8. Permission Guards

- Grep for `can(` / `canDisplay(` in both old and new module
- Same permission keys guarding same elements?
- Flag any old guard missing in new

### 9. Hook Parity

- Count old hooks vs new hooks
- Verify every old hook has a counterpart (by responsibility, not necessarily same filename)

### 10. Dead-handler Scan

- Grep module's components/containers for `onClick`, `onConfirm`, `onSubmit`, menu `items`
- Flag handlers that are `undefined`, empty functions, or unconnected to any service/navigation

### 11. Service → Hook → Component Chain Spot-check

- Pick 3 most user-facing flows (list load, primary action, detail load)
- Trace each: service method → hook → container/component
- Confirm chain is intact

---

## Report

```markdown
## Parity Smoke Check — <module-name>

**Date:** YYYY-MM-DD

| Check              | Result | Old count | New count | Notes                        |
| ------------------ | ------ | --------- | --------- | ---------------------------- |
| Type-check         | ✅/❌  | —         | —         |                              |
| Table columns      | ✅/❌  | X         | Y         |                              |
| Query keys         | ✅/❌  | X         | Y         |                              |
| Row menu items     | ✅/❌  | X         | Y         |                              |
| Action bar actions | ✅/❌  | X         | Y         |                              |
| API methods        | ✅/❌  | X         | Y         |                              |
| Routes (page)      | ✅/❌  | X         | Y         |                              |
| Routes (modal)     | ✅/❌  | X         | Y         |                              |
| Permission guards  | ✅/❌  | X         | Y         |                              |
| Hooks              | ✅/❌  | X         | Y         |                              |
| Dead handlers      | ✅/❌  | —         | —         | N buttons checked, M unwired |
| Core flow chains   | ✅/❌  | —         | —         |                              |

**Verdict:** <All counts match, all wired / Issues found — see below>

### Issues found

<numbered list with exact file:line references, grouped by category>

### Recommended next steps

<if issues found, whether to use /migrate-module to fix them or manual intervention needed>
```

## Rules

- This is a **smoke check** — if more than a handful of issues, recommend `/migration-report <module-name>` for full audit
- Don't fix anything — report only
- Always show old vs new counts so discrepancies are immediately visible
- Be precise about file paths and line numbers
