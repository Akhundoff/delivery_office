# United-Queues Module — Migration Audit

> Comparison of `delivery_management_new/src/modules/united-queues` against the old
> `delivery_management/src/@next/modules/united-pool`.
>
> **Date:** 2026-06-21
> **Verdict:** ✅ **Fully migrated** — 100% parity with `delivery_management/src/@next/modules/united-pool`.

## Method

Compared all repos, hooks, containers, columns, modal pages, and routes between old `united-pool` module and new `united-queues` module.

## ✅ Migrated and wired

| Feature                                             | Route/Location                                                                                                                        |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| United queues list page                             | `index` route → `UnitedQueuesPage`                                                                                                    |
| Payload preview modal                               | `preview/payload` modal route → `UnitedQueuesPayloadPreview`                                                                          |
| Response preview modal                              | `preview/response` modal route → `UnitedQueuesResponsePreview`                                                                        |
| `getList` service (old: `get-united-queues.repo`)   | `services/index.ts` → `UnitedQueuesService.getList` hitting `GET /api/admin/united_pool`                                              |
| Inline `toDomain` mapper (old: `UnitedQueueMapper`) | `services/index.ts` — parses JSON for `response` and `payload` fields                                                                 |
| Table with 8 columns                                | `hooks/unitedQueues/use-united-queues-table-columns.tsx` — Actions, Kod, URL, Metod, Cəhd sayı, Status, Cəhd tarixi, Yaradılma tarixi |
| Actions column with payload preview button          | `FileTextOutlined` icon navigating to `preview/payload` with background                                                               |
| Status column with inline response icon             | `FileTextOutlined` click navigates to `preview/response` with background                                                              |
| Action bar (refresh + reset)                        | `containers/united-queues-action-bar.tsx`                                                                                             |
| ReactJson preview for payload                       | `containers/united-queues-payload-preview.tsx`                                                                                        |
| ReactJson preview for response                      | `containers/united-queues-response-preview.tsx`                                                                                       |
| NextTable context                                   | `context/index.ts` → `UnitedQueuesTableContext`                                                                                       |
| Table fetch use-case                                | `use-cases/table-fetch.ts`                                                                                                            |
| Interface `IUnitedQueue`                            | `interfaces/index.ts` — matches old fields exactly                                                                                    |

## ❌ Missing / not migrated

_(none)_

## Notes

- Old payload/response preview modals had a bug: `onCancel` closed to `/@next/customs/dns-queues` instead of `/@next/united-queues`. Fixed in new module.
- New action bar adds a "Sıfırla" (Reset) button not present in old — an improvement.

## Scale check

| Metric                | Old | New                                                  |
| --------------------- | --- | ---------------------------------------------------- |
| Repos/Service methods | 1   | 1                                                    |
| Table columns         | 8   | 8                                                    |
| Containers            | 3   | 5 (table, action-bar, 2 previews, containers barrel) |
| Page routes           | 1   | 1                                                    |
| Modal routes          | 2   | 2                                                    |
