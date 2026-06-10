---
description: 'Aggregate migration progress from existing audit docs (no fresh scanning). Usage: /migration-status'
---

You are producing a quick aggregate view of migration progress, using only the audit docs that already exist under `docs/` — this is a cheap dashboard, not a fresh deep-scan.

Arguments (ignored — this command takes none): $ARGUMENTS

This command is **read-only** and does not write or update any docs (that's what `/migration-report` is for). It only prints a summary to the user.

---

## Steps

1. Find every audit/comparison doc already on disk:
   - `docs/migration-status-summary.md` (project-wide table from `/migration-report`, if present)
   - `docs/*-migration-audit.md` (per-module audits from `/migration-report <module>`)
   - `docs/compare-*-vs-*.md` (1-vs-1 comparisons from `/compare-modules`)
2. Read each one and extract:
   - Module name(s) covered
   - Verdict (✅ Fully migrated / 🟡 Partially migrated / ❌ Not migrated, or the comparison verdict)
   - The doc's **Date** (so stale entries can be flagged)
   - Count of remaining gaps (size of the "Missing / not migrated" or "➖/🔁" sections)
3. Cross-reference against the full module list in `../delivery_management/src/@next/modules/` to see which old modules have **no** audit doc at all yet — these are "unknown" status, not "not migrated" (don't conflate the two).
4. Print a compact aggregate report:

```markdown
# Migration Status — Aggregate (from existing audits)

**Generated:** YYYY-MM-DD · sources: N audit docs (oldest: YYYY-MM-DD, newest: YYYY-MM-DD)

| Status | Count | Modules |
|---|---|---|
| ✅ Fully migrated | X | orders, flights, ... |
| 🟡 Partially migrated | Y | declarations (12 gaps, audited 2026-06-02), ... |
| ❌ Not migrated | Z | ... |
| ❔ No audit yet | W | ... |

**Total old modules:** N

⚠️ Stale audits (>14 days old — re-run `/migration-report <module>` to refresh):
- declarations — last audited 2026-06-02
```

5. Recommend next actions: which 🟡/❌/❔ module to audit or migrate next, prioritizing by user-facing impact (list/detail pages over admin/back-office tooling) and by how stale its last audit is.

## Rules

- **Do not** re-derive verdicts by reading source code — trust the docs as the source of truth for this command. If the user wants a fresh check, point them at `/migration-report <module>`.
- If no audit docs exist yet, say so plainly and suggest running `/migration-report` (no arg) to generate the first project-wide summary.
