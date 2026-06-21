# Shop Names Module — Migration Audit

> Comparison of `delivery_management_new/src/modules/shop-names` against the old
> `delivery_management/src/@next/modules/shop-names`.
>
> **Date:** 2026-06-21
> **Verdict:** ✅ **Fully migrated** — 100% parity with `delivery_management/src/@next/modules/shop-names`.
> All 9 previously identified gaps are closed.

---

## Method

Files compared:

- **Routes**: old `router/shops.router.tsx` + `router/shops-modal.router.tsx`
  vs new `router/page.router.tsx` + `router/modal.router.tsx`
- **Services**: old 5 repos (`get-shops`, `get-shop-by-id`, `create-shop`, `remove-shops`, `get-shop-types`)
  vs new `services/index.ts` (`ShopNamesService` — getList, getById, create, update, delete)
- **Table columns**: old `hooks/use-shops-table/use-shops-table-columns.tsx`
  vs new `hooks/shopNames/use-shop-names-table-columns.tsx`
- **Action bar**: old `containers/shops-action-bar.tsx` + `hooks/use-shops-action-bar.tsx`
  vs new `containers/shop-names-action-bar.tsx`
- **Create form**: old `containers/create-shop.tsx` + `hooks/use-create-shop.tsx`
  vs new `containers/create-shop-name.tsx` + `hooks/shopNames/use-shop-name-form.ts`
- **Query keys**: old `utils/shop-query-keys.ts` vs new column `id` values

---

## ✅ Migrated and wired

| #   | Feature                                                                        | Location                                                     |
| --- | ------------------------------------------------------------------------------ | ------------------------------------------------------------ |
| 1   | Shop names list page                                                           | `/shop-names` → `pages/index.tsx`                            |
| 2   | Create modal                                                                   | `/shop-names/create` → `containers/create-shop-name.tsx`     |
| 3   | Edit modal                                                                     | `/shop-names/:id/update` → `containers/create-shop-name.tsx` |
| 4   | All 5 service methods (getList, getById, create, update, delete)               | `services/index.ts`                                          |
| 5   | Column: Kod (`id: 'id'`)                                                       | `hooks/shopNames/use-shop-names-table-columns.tsx`           |
| 6   | Column: Karqo adı (`id: 'shop_name'`)                                          | `hooks/shopNames/use-shop-names-table-columns.tsx`           |
| 7   | Column: Ölkə (`id: 'country_id'`) with Select filter from `settings.countries` | `hooks/shopNames/use-shop-names-table-columns.tsx`           |
| 8   | Column: Yaradılıb (`id: 'created_at'`)                                         | `hooks/shopNames/use-shop-names-table-columns.tsx`           |
| 9   | Row menu: Düzəliş et → navigates to update modal                               | `hooks/shopNames/use-shop-names-table-columns.tsx`           |
| 10  | Row menu: Sil with confirm (correct title + content)                           | `hooks/shopNames/use-shop-names-table-columns.tsx`           |
| 11  | Action bar: Yeni, Hamısını seç / N sətir seçilib, Yenilə, Sıfırla              | `containers/shop-names-action-bar.tsx`                       |
| 12  | Create form title: "Yeni mağaza əlavə et" / "Reysterdə düzəliş et"             | `containers/create-shop-name.tsx`                            |
| 13  | Form fields: name + countryId (Select from settings.countries)                 | `containers/create-shop-name.tsx`                            |

## ❌ Missing / not migrated

_(none)_

## Scale check

| Metric               | Old                                                 | New                                          |
| -------------------- | --------------------------------------------------- | -------------------------------------------- |
| Repo/service methods | 5 (getList, getById, create, remove, getShopTypes†) | 5 (getList, getById, create, update, delete) |
| Hooks                | 5 files                                             | 3 files (consolidated)                       |
| Page routes          | 1                                                   | 1                                            |
| Modal routes         | 2 (create, update)                                  | 2 (create, update)                           |
| Containers           | 3                                                   | 3                                            |

† `GetShopTypesRepo` (GET `/api/admin/shop/categories`) existed in old repos but was unused — no hook or container in shop-names consumed it. Not migrated as dead code.

## Gaps closed in this migration

| #   | Gap                                                           | File                               |
| --- | ------------------------------------------------------------- | ---------------------------------- |
| 1   | Column name query key `"name"` → `"shop_name"`                | `use-shop-names-table-columns.tsx` |
| 2   | Column header "Ad" → "Karqo adı"                              | `use-shop-names-table-columns.tsx` |
| 3   | Column header "Tarix" → "Yaradılıb"                           | `use-shop-names-table-columns.tsx` |
| 4   | Country column: added Select filter from `settings.countries` | `use-shop-names-table-columns.tsx` |
| 5   | Delete confirm: fixed title + added content text              | `use-shop-names-table-columns.tsx` |
| 6   | Row menu: removed spurious divider between Edit and Delete    | `use-shop-names-table-columns.tsx` |
| 7   | Action bar: added "Hamısını seç" / selection count buttons    | `shop-names-action-bar.tsx`        |
| 8   | Create title: "Yeni xarici mağaza" → "Yeni mağaza əlavə et"   | `create-shop-name.tsx`             |
| 9   | Edit title: "Mağazanı düzəlt" → "Reysterdə düzəliş et"        | `create-shop-name.tsx`             |
