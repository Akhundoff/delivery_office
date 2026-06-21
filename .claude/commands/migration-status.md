---
description: 'Aggregate migration progress from existing audit docs (no fresh scanning). Usage: /migration-status'
---

You are producing a quick aggregate view of migration progress, using only the audit docs that already exist under `docs/` — this is a cheap dashboard, not a fresh deep-scan.

Arguments (ignored — this command takes none): $ARGUMENTS

This command is **read-only** and does not write or update any docs.

---

## Steps

1. Find every audit/comparison doc on disk:
   - `docs/migration-status-summary.md`
   - `docs/*-migration-audit.md`
   - `docs/compare-*-vs-*.md`
2. Read each and extract:
   - Module name(s) covered
   - Verdict (✅/🟡/❌)
   - Doc's **Date** (flag if stale)
   - Count of remaining gaps — broken down by category where available:
     - Missing columns
     - Missing API methods
     - Missing hooks
     - Missing routes
     - Missing row menu items
     - Missing action bar actions
     - Missing permissions
3. Cross-reference against full module list in `../delivery_management/src/@next/modules/` — modules with no audit doc = "unknown" status.
4. Print compact aggregate:

```markdown
# Migration Status — Aggregate (from existing audits)

**Generated:** YYYY-MM-DD · sources: N audit docs (oldest: YYYY-MM-DD, newest: YYYY-MM-DD)

| Status                | Count | Modules                                                            |
| --------------------- | ----- | ------------------------------------------------------------------ |
| ✅ Fully migrated     | X     | orders, flights, ...                                               |
| 🟡 Partially migrated | Y     | couriers (gaps: 3 cols, 5 APIs, 2 hooks), declarations (gaps: ...) |
| ❌ Not migrated       | Z     | ...                                                                |
| ❔ No audit yet       | W     | ...                                                                |

**Total old modules:** N

## Gap Breakdown for Partial Modules

| Module   | Columns | APIs | Hooks | Routes | Menu items | Actions | Permissions | Total gaps |
| -------- | ------- | ---- | ----- | ------ | ---------- | ------- | ----------- | ---------- |
| couriers | 1       | 5    | 4     | 3      | 4          | 4       | 1           | 22         |
| ...      | ...     | ...  | ...   | ...    | ...        | ...     | ...         | ...        |

⚠️ Stale audits (>14 days old):

- declarations — last audited 2026-06-02
```

5. Recommend next actions: which module to audit/migrate next, prioritizing by:
   - User-facing impact (list/detail pages over admin tooling)
   - Gap count (fewer gaps = quicker to complete)
   - Staleness of last audit

## Rules

- **Do not** re-derive verdicts by reading source code — trust the docs
- If no audit docs exist, say so and suggest running `/migration-report` first
- When showing gap counts, always break down by category (columns, APIs, hooks, etc.) — never just a total number
