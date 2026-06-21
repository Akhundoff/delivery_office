# Azerpost-Queues Module — Migration Audit

> Comparison of `delivery_management_new/src/modules/azerpost-queues` against the old
> `delivery_management/src/@next/modules/azerpost`.
>
> **Date:** 2026-06-21
> **Verdict:** ✅ **Fully migrated** — 100% parity with `delivery_management/src/@next/modules/azerpost`.

## Method

Compared all repos, hooks, containers, pages, columns, and routes between old `azerpost` module and new `azerpost-queues` module.

## ✅ Migrated and wired

| Feature                                       | Route/Location                                                                                                                                                              |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Azerpost queues list page                     | `index` route → `AzerpostQueuesPage`                                                                                                                                        |
| Request body preview modal                    | `request-body` modal route → `AzerpostQueueRequestBodyPreview`                                                                                                              |
| Response body preview modal                   | `response-body` modal route → `AzerpostQueueResponseBodyPreview`                                                                                                            |
| `getList` service (old: `get-azerposts.repo`) | `services/index.ts` → `AzerpostQueuesService.getList` hitting `GET /api/admin/azerpost_pools`                                                                               |
| Table with 10 columns                         | `hooks/azerpostQueues/use-azerpost-queues-table-columns.tsx` — Kod, Obyekt kod, Metod, Body, Response body, Status kod, Əməliyyat, Cəhd sayı, Cəhd edildi, Yaradılma tarixi |
| Executed column Select filter                 | Filter with İcra edilib / İcra edilməyib options                                                                                                                            |
| Default filter `executed=1`                   | `NextTableProvider` `defaultState` in `pages/index.tsx`                                                                                                                     |
| Action bar (select all, refresh, reset)       | `containers/azerpost-queues-action-bar.tsx`                                                                                                                                 |
| ReactJson preview for request body            | `containers/azerpost-queue-request-body-preview.tsx`                                                                                                                        |
| ReactJson preview for response body           | `containers/azerpost-queue-response-body-preview.tsx`                                                                                                                       |
| NextTable context                             | `context/index.ts` → `AzerpostQueuesTableContext`                                                                                                                           |
| Table fetch use-case                          | `use-cases/table-fetch.ts`                                                                                                                                                  |

## ❌ Missing / not migrated

_(none)_

## Scale check

| Metric                | Old                                    | New                                         |
| --------------------- | -------------------------------------- | ------------------------------------------- |
| Repos/Service methods | 1                                      | 1                                           |
| Table columns         | 9                                      | 10 (added `createdAt`)                      |
| Containers            | 3 (table, action-bar, 2 preview pages) | 4 (table, action-bar, 2 preview containers) |
| Page routes           | 1                                      | 1                                           |
| Modal routes          | 2                                      | 2                                           |
