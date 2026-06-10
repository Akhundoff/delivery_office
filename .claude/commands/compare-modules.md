---
description: 'Strict 1-vs-1 deep comparison between an old and a new module. Usage: /compare-modules <old-module-path> <new-module-path>'
---

You are doing a strict, exhaustive 1-vs-1 comparison between exactly two modules — one from the old project, one from the new — without assuming they share a name or a clean boundary.

Arguments: $ARGUMENTS

Parse args as: `<old-module-path> <new-module-path>`, where each is a path relative to its project's modules root, e.g.:

- `/compare-modules archived-declarations declarations` → compares `../delivery_management/src/@next/modules/archived-declarations/` against `src/modules/declarations/`
- `/compare-modules united-declarations united-declarations` → same-name comparison
- `/compare-modules acceptance/box partner-box-acceptance` → compares a subfolder/feature of an old module against a whole new module

If either argument is missing, ask the user for the two module paths before doing anything else.

This command is **read-only** — it never edits application code, only writes the comparison doc.

---

## Why this exists (vs. `/migration-report`)

`/migration-report <module>` assumes the old and new modules share a name and a 1:1 boundary. That assumption breaks when modules were split, merged, or renamed during the rewrite (e.g. old `archived-declarations` + `united-declarations` content landing inside new `declarations` and `united-declarations` differently than their names suggest). Use `/compare-modules` whenever you need to check two **specific, explicitly-named** module paths against each other — regardless of whether their names match.

---

## Comparison method

Resolve both paths first:

- Old root: `../delivery_management/src/@next/modules/<old-module-path>/`
- New root: `src/modules/<new-module-path>/`

Read both completely before writing anything. Then compare exhaustively, category by category — enumerate, don't sample:

1. **Routes** — every entry in old `router/*.router.tsx` vs new `router/*.router.tsx` (pages and modals)
2. **Services / API calls** — every method in old `repos/index.ts` (or per-file repos) vs every method in new `services/index.ts`: same endpoint URL, HTTP verb, request/response field names?
3. **State shape** — old Redux slice / react-query keys vs new `context/types.ts` + `reducer.ts`: same data being held, same derived state?
4. **Hooks** — every hook in old `hooks/` vs new `hooks/`: same responsibility, same inputs/outputs (allowing for pattern differences — DI/react-query vs context/services)
5. **Components, containers, pages** — list views, detail views, forms, modals: same structure, same fields, same layout intent
6. **Table columns & conditional rendering** — same columns, same visibility/formatting conditions per row state
7. **Buttons / actions / menus** — every action-bar button, row-menu item, modal footer button: present AND wired (has a real handler) on both sides
8. **Permissions / guards** — same `can('...')` checks gating the same routes/actions

For each item, classify as:
- ✅ **Equivalent** — present and wired the same way on both sides (architecture differences don't count against equivalence; missing *behavior* does)
- 🔁 **Present but different** — exists on both sides but behaves differently (different fields, different conditions, different wiring) — describe the delta precisely
- ➖ **Old-only** — exists in the old module, has no counterpart in the new one
- ➕ **New-only** — exists in the new module with no old counterpart (flag these too — could be intentional new functionality, or could mean it actually belongs to a *different* old module and you've been pointed at the wrong pair)

---

## Output

Write `docs/compare-<old-module-path-slug>-vs-<new-module-path-slug>.md` (replace `/` in paths with `-` for the filename), structured as:

```markdown
# Module Comparison — `<old-module-path>` vs `<new-module-path>`

**Date:** YYYY-MM-DD
**Old:** `delivery_management/src/@next/modules/<old-module-path>`
**New:** `delivery_management_new/src/modules/<new-module-path>`

## Summary
<one paragraph: how aligned are these two modules really? Are they a true 1:1 pair, a partial overlap, or mismatched?>

## Routes
<table: Old route | New route | Status (✅/🔁/➖/➕) | Notes>

## Services / API
<table: Old method (endpoint) | New method (endpoint) | Status | Notes>

## Hooks
<table: Old hook | New hook | Status | Notes>

## Components / Containers / Pages
<table: Old | New | Status | Notes>

## Table columns & conditions
<table: Column | Old condition | New condition | Status>

## Buttons / actions / menu items
<table: Action | Old location | New location | Wired? | Status>

## Permissions
<table: Permission key | Old guard | New guard | Status>

## Verdict
<One of: ✅ Equivalent · 🟡 Mostly equivalent (N deltas) · ❌ Significantly diverged — plus the single most important thing to fix first>
```

## Accuracy rules

- Every ✅ must be backed by reading the actual wiring on both sides — not name similarity.
- Every ➖ must be backed by a confirmed grep-for-it-and-found-nothing in the new module.
- If genuinely uncertain, mark it ⚠️ **needs verification** rather than guessing — and say what would resolve the uncertainty (e.g. "run the flow in the browser to confirm the modal opens").

## Report back

Print the verdict and the list of ➖/🔁 deltas to the user, and tell them the doc was saved to `docs/compare-<...>-vs-<...>.md`.
