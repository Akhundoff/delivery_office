---
description: 'Fast post-migration sanity check for one module (build + routes + permissions). Usage: /verify-parity <module-name>'
---

You are running a **fast** sanity check on one module after migration work — this is a smoke test, not a full audit. Use `/migration-report <module-name>` when you need the exhaustive deep-compare; use this when you just want to know "did I break anything / is this wired" right now.

Module: $ARGUMENTS

This command is **read-only** — it never edits code.

---

## Checks (in order — stop and report immediately if a blocking check fails)

### 1. Type-check / build (blocking)

Run the project's type-check:

```bash
npx tsc --noEmit
```

- If it fails with errors inside `src/modules/<module-name>/`, report them immediately as **blocking** — don't continue to the next checks.
- Errors outside the module are worth noting but don't block the rest of this check.

### 2. Route wiring

- Read `src/modules/<module-name>/router/*.router.tsx`.
- Confirm every route is actually mounted — trace it up to the root router (`src/router/main.tsx`) or the parent module router that includes it.
- Flag any route definition that exists but isn't reachable from the app shell (orphaned route).

### 3. Permission guards

- Grep for `can(` / `canDisplay(` / guard checks inside the module.
- Cross-check each permission key against what the **old** module (`../delivery_management/src/@next/modules/<module-name>/`) guards on the equivalent route/action — same key, same place?
- Flag any route or action that the old module gated but the new one doesn't (or vice versa).

### 4. Dead-handler scan

- Grep the module's components/containers for `onClick`, `onConfirm`, `onSubmit`, menu `items` arrays, and dropdown definitions.
- Spot which of these are wired to a real handler vs. missing/`undefined`/empty-function — i.e. buttons that render but do nothing. This is the single most common "looks migrated but isn't" trap.

### 5. Service ↔ hook ↔ component chain spot-check

- Pick the 2-3 most user-facing flows in the module (e.g. list load, detail load, primary create/update action).
- For each, trace `service method → hook → container/component` and confirm the chain is intact (hook actually calls the service, component actually calls the hook, no orphaned pieces).

---

## Report

```markdown
## Parity Smoke Check — <module-name>

**Date:** YYYY-MM-DD

| Check | Result | Notes |
|---|---|---|
| Type-check | ✅/❌ | |
| Routes mounted | ✅/❌ | N routes checked, M orphaned |
| Permission guards | ✅/❌ | |
| Dead-handler scan | ✅/❌ | N buttons checked, M unwired |
| Core flow chains | ✅/❌ | |

**Verdict:** <Looks healthy / Issues found — see below>

### Issues found
<numbered list with exact file:line references>
```

## Rules

- This is a **smoke check**, not exhaustive — if you find more than a handful of issues, recommend running the full `/migration-report <module-name>` instead and stop here.
- Don't fix anything — report only, the same way `/find-bug` does.
- Be precise about file paths and line numbers so issues are immediately actionable.
