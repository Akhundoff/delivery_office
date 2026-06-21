# Models Module — Migration Audit

**Date:** 2026-06-21
**Verdict:** ✅ **Fully migrated** — 100% parity with `delivery_management/src/@next/modules/models`.

## Summary

3 gaps found, 3 closed. Zero remaining.

## Migrated and Wired

| Item                    | Type      | Old Location                                          | New Location                                  |
| ----------------------- | --------- | ----------------------------------------------------- | --------------------------------------------- |
| `IModel` interface      | Interface | `interfaces/model.interface.ts`                       | `interfaces/index.ts`                         |
| `getList`               | Service   | `GetModelsRepo`                                       | `ModelsService.getList`                       |
| `useModels` hook        | Hook      | `hooks/use-models.ts`                                 | `hooks/models/use-models.ts`                  |
| `useModelsTable`        | Hook      | `hooks/use-models-table/use-models-table.tsx`         | `hooks/models/use-models-table.ts`            |
| `useModelsTableColumns` | Hook      | `hooks/use-models-table/use-models-table-columns.tsx` | `hooks/models/use-models-table-columns.tsx`   |
| `ModelsTableContext`    | Context   | `contexts/models-table.context.tsx`                   | `context/index.ts`                            |
| `ModelsTable`           | Container | `containers/models-table.tsx`                         | `containers/models-table.tsx`                 |
| `ModelsActionBar`       | Container | _(none)_                                              | `containers/models-action-bar.tsx` (additive) |
| `ModelsPage`            | Page      | `pages/models.page.tsx`                               | `pages/index.tsx`                             |
| Router                  | Route     | `router/models.router.tsx`                            | `router/page.router.tsx`                      |
| Module barrel           | Export    | `index.ts`                                            | `index.ts` (exports `IModel` + `useModels`)   |

## Table Columns (all 5 match old project)

| Column    | ID           | Preset | Notes        |
| --------- | ------------ | ------ | ------------ |
| Kod       | `id`         | small  | —            |
| Ad        | `name`       | —      | —            |
| Sıra      | `sort`       | small  | fallback "—" |
| Yaradılıb | `created_at` | date   | —            |
| Açıqlama  | `descr`      | —      | fallback "—" |

## Table Props

| Prop       | Value |
| ---------- | ----- |
| filterable | false |
| sortable   | false |
| pagination | false |

## Missing / Not Migrated

(none)
