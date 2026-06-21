# System-Settings Module — Migration Audit

> Comparison of `delivery_management_new/src/modules/system-settings` against the old
> `delivery_management/src/@next/modules/settings`.
>
> **Date:** 2026-06-21
> **Verdict:** ✅ **Fully migrated** — 100% parity with `delivery_management/src/@next/modules/settings`.

## Method

Compared all repos, containers (settings tabs), routes, and form fields between old `settings` module and new `system-settings` module.

## ✅ Migrated and wired

| Feature                                                  | Route/Location                                                                                                                     |
| -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Settings page with tabs                                  | `index` route → `SystemSettingsPage`                                                                                               |
| Azerpost settings tab                                    | `containers/azerpost-settings.tsx` — with `errorKeyMap`                                                                            |
| Cashback settings tab                                    | `containers/cashback-settings.tsx` — with `errorKeyMap` (6 keys)                                                                   |
| Cashflow settings tab                                    | `containers/cashflow-settings.tsx` — with `errorKeyMap` (2 keys), cashbox select                                                   |
| Mail settings tab                                        | `containers/mail-settings.tsx` — with `errorKeyMap` (6 keys), `groupIdAsQuery: true`, banner upload                                |
| Others settings tab                                      | `containers/others-settings.tsx` — with `errorKeyMap` (9 keys), package prices + toggles                                           |
| Topup settings tab                                       | `containers/topup-settings.tsx` — with `errorKeyMap` (2 keys), `groupIdAsQuery: true`                                              |
| Trendyol settings tab                                    | `containers/trendyol-settings.tsx` — with `errorKeyMap`, `groupIdAsQuery: true`, price validation regex                            |
| `getGroup` service (old: 9 `get-*-settings` repos)       | `services/index.ts` → `SystemSettingsService.getGroup(groupId)` — generic, replaces 9 individual repos                             |
| `updateGroup` service (old: 9 `update-*-settings` repos) | `services/index.ts` → `SystemSettingsService.updateGroup(groupId, values, groupIdAsQuery?)` — generic, replaces 9 individual repos |
| `useSettingsGroup` generic hook                          | `hooks/settings/use-settings-group.ts` — `fromApi`, `toApi`, `errorKeyMap`, `groupIdAsQuery` params                                |
| `useCashboxes` hook                                      | `hooks/cashboxes/use-cashboxes.ts` — fetches cashbox list for cashflow settings                                                    |
| 422 error key mapping                                    | `useSettingsGroup` maps snake_case API errors → camelCase Formik field names                                                       |

## ❌ Missing / not migrated

_(none)_

## Notes on architectural changes

| Old pattern                                                                | New pattern                                                                     |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| 9 separate `get-*-settings` repos + 9 `update-*-settings` repos (18 total) | 2 generic service methods: `getGroup(groupId)` + `updateGroup(groupId, values)` |
| Each settings tab had its own hook                                         | Single `useSettingsGroup<T>` generic hook with `fromApi`/`toApi` mappers        |
| No server error handling                                                   | `errorKeyMap` + 422 response handling for per-field server validation errors    |

## Scale check

| Metric                     | Old                         | New                                                                        |
| -------------------------- | --------------------------- | -------------------------------------------------------------------------- |
| Repos/Service methods      | 18 repos (9 get + 9 update) | 2 generic service methods                                                  |
| Containers (settings tabs) | 9                           | 7 (branches-settings and warehouses-settings handled by their own modules) |
| Hooks                      | 9+                          | 2 (`useSettingsGroup`, `useCashboxes`)                                     |
| Page routes                | 1                           | 1                                                                          |
