# Refunds Module Migration Audit

**Date:** 2026-06-21
**Verdict:** ✅ **Fully migrated**

## Summary

22 gaps found, 22 closed. Zero remaining.

## Migrated and Wired

| Item                              | Type      | Old Location                     | New Location                                  |
| --------------------------------- | --------- | -------------------------------- | --------------------------------------------- |
| `getList`                         | Service   | `GetRefundsRepo`                 | `RefundsService.getList`                      |
| `getById`                         | Service   | `GetRefundByIdRepo`              | `RefundsService.getById`                      |
| `create`                          | Service   | `CreateRefundRepo` (create path) | `RefundsService.create`                       |
| `update`                          | Service   | `CreateRefundRepo` (edit path)   | `RefundsService.update`                       |
| `delete` (array)                  | Service   | `RemoveRefundsRepo`              | `RefundsService.delete`                       |
| `changeStatus`                    | Service   | `ChangeRefundStatus`             | `RefundsService.changeStatus`                 |
| `getExcel`                        | Service   | `GetRefundsExcelRepo`            | `RefundsService.getExcel`                     |
| `IRefund`                         | Interface | `refund.interface.ts`            | `interfaces/index.ts`                         |
| `IRefundFormValues` (with file)   | Interface | `CreateRefundDto`                | `interfaces/index.ts`                         |
| `useRefundForm`                   | Hook      | `useCreateRefund`                | `hooks/refunds/use-refund-form.ts`            |
| `useRefundsTable`                 | Hook      | `useRefundsTable`                | `hooks/refunds/use-refunds-table.ts`          |
| `useRefundsTableColumns`          | Hook      | `useRefundsTableColumns`         | `hooks/refunds/use-refunds-table-columns.tsx` |
| `usePrintSticker`                 | Hook      | `usePrintSticker`                | `hooks/refunds/use-print-sticker.ts`          |
| Refunds list page                 | Page      | `refunds.page.tsx`               | `pages/index.tsx`                             |
| Refund details page               | Page      | `refund-details.tsx`             | `pages/refund-details.tsx`                    |
| Create/edit modal                 | Container | `create-refund.tsx`              | `containers/create-refund.tsx`                |
| Refund details view               | Container | `refund-details.tsx`             | `containers/refund-details.tsx`               |
| Refunds table                     | Container | `refunds-table.tsx`              | `containers/refunds-table.tsx`                |
| Action bar (all buttons)          | Container | `refunds-action-bar.tsx`         | `containers/refunds-action-bar.tsx`           |
| `/refunds` route                  | Route     | `refunds.router.tsx`             | `router/page.router.tsx`                      |
| `/refunds/:id/info` route         | Route     | `refunds.router.tsx`             | `router/page.router.tsx`                      |
| `/refunds/create` modal route     | Route     | `refund-modal.router.tsx`        | `router/modal.router.tsx`                     |
| `/refunds/:id/update` modal route | Route     | `refund-modal.router.tsx`        | `router/modal.router.tsx`                     |
| Sticker template                  | Asset     | `handlebars/sticker.hbs`         | `src/assets/refund-sticker.hbs`               |

## Table Columns (all match old project)

| Column        | ID                  | Filter                     | Special                               |
| ------------- | ------------------- | -------------------------- | ------------------------------------- |
| Kod           | `id`                | —                          | `nextTableColumns.small`              |
| М.kodu        | `user_id`           | —                          | `nextTableColumns.small`              |
| М.adı         | `user_name`         | —                          | `nextTableColumns.normal`             |
| Trak kod      | `track_code`        | —                          | —                                     |
| Kargo firması | `cargo_id`          | CargoFilter (useCargoes)   | `nextTableColumns.normal`             |
| İadə nömrəsi  | `return_number`     | —                          | —                                     |
| Kateqoriyası  | `product_type_name` | —                          | `nextTableColumns.small`              |
| Status        | `state_id`          | StatusFilter (model_id=38) | `<Tag color='orange'>`                |
| İstiqamət     | `direction`         | DirectionFilter (AZ/TR)    | `nextTableColumns.small`              |
| Yaradılıb     | `created_at`        | —                          | `nextTableColumns.date`               |
| Prints        | `prints`            | —                          | Print sticker button (status 59 only) |

## Action Bar Buttons (all match old project)

| Button       | Condition        | Action                                         |
| ------------ | ---------------- | ---------------------------------------------- |
| Yeni         | Always           | Navigate to `/refunds/create` modal            |
| Hamısını seç | No selection     | Select all rows                                |
| {n} seçilib  | Selection active | Reset selection                                |
| Yenilə       | Always           | Re-fetch table                                 |
| Sıfırla      | Always           | Reset filters                                  |
| Export       | Always           | Download Excel via `/api/admin/returns/export` |
| Sil          | Selection active | Bulk delete selected refunds                   |

## Action Column Menu Items

| Item         | Action                                  |
| ------------ | --------------------------------------- |
| Ətraflı bax  | Navigate to `/refunds/:id/info`         |
| Düzəliş et   | Navigate to `/refunds/:id/update` modal |
| Status dəyiş | Submenu of statuses from model_id=38    |
| Sil          | Delete with confirmation                |

## Form Fields (all match old project)

| Field           | Type          | Notes                                |
| --------------- | ------------- | ------------------------------------ |
| userId          | SelectField   | From `useLimitedUsers()`, searchable |
| trackCode       | TextField     | —                                    |
| cargoId         | SelectField   | From `useCargoes()`, searchable      |
| direction       | SelectField   | AZERBAIJAN/TURKIYE                   |
| refundNumber    | TextField     | —                                    |
| productTypeName | TextField     | —                                    |
| shopName        | TextField     | —                                    |
| quantity        | TextField     | —                                    |
| price           | TextField     | —                                    |
| description     | TextAreaField | —                                    |
| file            | UploadField   | Document upload                      |

## Missing / Not Migrated

(none)
