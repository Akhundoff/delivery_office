---
description: 'Bring a module to 100% feature parity with the old project. Usage: /migrate-module <module-name>'
---

You are completing the migration of one module from `delivery_management` (old, DI/Redux, `src/@next/modules/`) to `delivery_management_new` (this rewrite, context+hooks, `src/modules/`).

Module: $ARGUMENTS

**The bar is 100% parity.** Not "the main flows work" — every flow, every button, every service method, every table column, every hook, every conditional rendering rule that exists in the old module must exist and be wired in the new one. Partial migration is a fail.

---

## Phase 1 — Audit (always runs first, no exceptions)

1. If `docs/<module-name>-migration-audit.md` exists **and is dated today**, read it and treat it as the starting point — but spot-check 3-4 of its "Migrated" claims against the actual code before trusting it (audits can drift as code changes).
2. Otherwise, perform the full deep audit yourself — same method as `/migration-report <module-name>` (Mode B): exhaustively compare routes, services, hooks, components/containers, table columns, buttons/actions, permissions between old `src/@next/modules/<module-name>/` (+ siblings) and new `src/modules/<module-name>/`.
3. Produce the complete gap list. Group it by type (routes, services, hooks, components, columns, actions) and order each group by user-facing impact.

---

## Phase 2 — Present the plan, then STOP

Do **not** write any code yet. Present to the user:

1. The full gap list from Phase 1, with counts (e.g. "14 items: 1 route, 3 service methods, 2 hooks, 5 action-bar items, 3 table-column rules").
2. For each gap, a concrete plan for closing it **in this project's architecture** (not the old one):
   - New service methods → static methods on the module's `*Service` class in `services/index.ts`, using `caller`/`urlMaker`, returning `ApiResult<Status, Data>` — copy the endpoint URL, HTTP verb, and field names from the old repo, but the implementation pattern from `delivery_warehouse`-style services already in this project
   - New state → extend `context/types.ts` + `context/reducer.ts`, not Redux
   - New hooks → `hooks/<camelCase-subfolder>/use-*.ts`, exported through the barrel (see `Hook Subfolder Naming Convention` in `CLAUDE.md`)
   - New routes → React Router v6 `<Route>` entries in the module's `router/*.router.tsx`
   - New components/containers/modals → mirror the old UI/behavior, built with this project's component & styling conventions (Ant Design v5, styled-components, dayjs)
3. Ask explicitly:

   > "This will close N gaps across M files. Proceed with implementation now, or do you want to adjust scope first?"

Wait for an explicit go-ahead. If the user wants to trim scope, narrow the plan and re-confirm before writing any code.

---

## Phase 3 — Implement (only after confirmation)

Work through the confirmed list **in dependency order**: interfaces/types → services → context/reducer → hooks → components → containers → pages → router wiring. For each item:

1. Mark it in-progress.
2. Implement it for real — no stubs, no `// TODO: wire this up later`, no "similar to the old one" hand-waving. Read the old implementation for business logic/endpoint/field names; write the new implementation in this project's patterns.
3. Wire it all the way through — a button with no `onClick`, a route with no link to it, or a hook nothing calls is **not** done.
4. Mark it complete and move to the next.

If you discover a gap mid-implementation that wasn't in the original list, add it to the list, tell the user, and keep going (don't silently skip it).

---

## Phase 4 — Re-verify (mandatory — do not skip)

1. Re-run the full comparison from Phase 1 against the now-updated new module.
2. Confirm **zero** remaining gaps. If anything is still missing or unwired, go back to Phase 3 for those items — do not report success with known gaps remaining.
3. Run `npx tsc --noEmit` (or the project's type-check command) and confirm it passes for the touched files.
4. Update `docs/<module-name>-migration-audit.md` to reflect the final state — verdict should now read ✅ **Fully migrated**, with the "Missing / not migrated" section empty (or removed) and the "Migrated and wired" table extended to cover the newly-added items.

---

## Final report

Tell the user:
- How many gaps were found, how many were closed, and confirm the count is now zero
- Which files were created/modified
- That `docs/<module-name>-migration-audit.md` now reflects ✅ full parity
- Anything you'd recommend testing manually in the browser (golden path + edge cases for each newly-wired flow)
