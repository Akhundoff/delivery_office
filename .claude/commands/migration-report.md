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
2. For each old module, determine whether it has a clear counterpart in the new project. Note 1:1 matches, splits (one old module → several new ones), and merges (several old modules → one new module) — e.g. old `archived-declarations` + `united-declarations` folding into new `declarations`/`united-declarations`.
3. For each old module (or group), do a **lightweight** comparison — route count, service/repo method count, hook count, presence of action bar / detail page / modals — enough to classify it, without going line-by-line:
   - ✅ **Fully migrated** — route, service, hook, and component coverage all present and wired; no obvious gaps.
   - 🟡 **Partially migrated** — core flows exist but some actions, modals, exports, or row-menu items are missing or unwired.
   - ❌ **Not migrated** — no counterpart exists in the new project, or only a stub/empty module exists.
4. If a per-module audit doc already exists at `docs/<module>-migration-audit.md`, read its verdict and reuse it instead of re-deriving the status from scratch — link to it.
5. Output a single summary table:

```markdown
# Migration Status — Project Summary

**Date:** YYYY-MM-DD

| Old module | New module(s) | Status | Notes / link to detailed audit |
|---|---|---|---|
| declarations | declarations | 🟡 Partial | see `docs/declarations-migration-audit.md` |
| orders | orders | ✅ Full | |
| ... | ... | ... | |

**Totals:** X fully migrated · Y partially migrated · Z not migrated (of N old modules)
```

6. Save to `docs/migration-status-summary.md` (overwrite if it exists — always reflects current state).
7. Print the table to the user and call out which modules most urgently need a deep audit (any 🟡/❌ without an existing detailed doc).

---

## Mode B — Per-module deep audit (`/migration-report <module-name>`)

Use `docs/declarations-migration-audit.md` as the reference template for both the **method** and the **output structure** — match its level of detail.

### 1. Locate both sides

- Old: `../delivery_management/src/@next/modules/<module-name>/` (also check sibling modules that may have been folded in, e.g. `archived-<module-name>`, `<module-name>-acceptance`)
- New: `src/modules/<module-name>/`

If the new module doesn't exist at all, skip straight to a verdict of ❌ **Not migrated** and list everything from the old module as missing.

### 2. Compare exhaustively — nothing is out of scope

Go through **every** category below. Do not summarize or sample — enumerate:

- **Routes** — old `router/*.router.tsx` vs new `router/*.router.tsx` (page routes AND modal routes)
- **Services / API calls** — old `repos/index.ts` (count + each method) vs new `services/index.ts` (count + each method); note endpoint URL, HTTP verb, and field-name parity
- **Hooks** — every hook in old `hooks/` vs new `hooks/`; what each one does, what it returns
- **Components & containers** — list pages, detail pages, action bars, row menus, modals, forms
- **Table columns** — old `use-*-table-columns.tsx` vs new equivalent: same columns, same conditional rendering/visibility logic
- **Buttons / actions / menu items** — every clickable action in the old UI (row menu entries, action-bar buttons, dropdown items, modal footer buttons) — confirm each exists AND is wired (has a working `onClick`/handler), not just present as a dead stub
- **Permissions / guards** — `can('...')` checks gating routes or actions

### 3. Classify and write the report

Write/overwrite `docs/<module-name>-migration-audit.md` following this structure (mirror `docs/declarations-migration-audit.md`):

```markdown
# <Module> Module — Migration Audit

> Comparison of `delivery_management_new/src/modules/<module-name>` against the old
> `delivery_management/src/@next/modules/<module-name>` [+ sibling modules].
>
> **Date:** YYYY-MM-DD
> **Verdict:** <✅ Fully migrated | 🟡 Partially migrated | ❌ Not migrated> — <one-line summary>

## Method
<what was compared and against which files — be specific about file paths>

## ✅ Migrated and wired
<table: Feature | Route/Location — only things confirmed present AND wired>

## ❌ Missing / not migrated
<table: Feature | Old location | Status in new — every gap, no matter how small>

## Scale check
<repo/service method counts, hook counts, route counts — old vs new>

## Suggested priority for completing migration
<ordered list, most user-facing / highest-traffic first>
```

### 4. Be accurate — this doc drives real work

- Every claim of "migrated" must be backed by reading the actual wiring (handler attached, route registered, service method called) — not just "a file with a similar name exists."
- Every claim of "missing" must be backed by a confirmed absence (grep for the symbol/endpoint/route in the new module and find nothing).
- If you're not sure whether something is wired, say so explicitly rather than guessing — list it under a "⚠️ Needs verification" note rather than asserting either way.

### 5. Report back

Print the verdict and the "Missing / not migrated" table to the user, and tell them the doc was saved to `docs/<module-name>-migration-audit.md`.
