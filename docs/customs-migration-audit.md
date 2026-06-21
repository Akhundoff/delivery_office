# Customs Module Migration Audit

**Date:** 2026-06-21
**Verdict:** ✅ **Fully migrated**

## Summary

20 gaps found, 20 closed. Zero remaining.

## Migrated and Wired

| Item                        | Type      | Old Location                               | New Location                                          |
| --------------------------- | --------- | ------------------------------------------ | ----------------------------------------------------- |
| `getList` (declarations)    | Service   | `GetCustomsDeclarationsRepo`               | `CustomsDeclarationsService.getList`                  |
| `getCounts`                 | Service   | `GetCustomsDeclarationsCountsRepo`         | `CustomsDeclarationsService.getCounts`                |
| `uploadDocument`            | Service   | `UploadCustomsDeclarationsDocumentRepo`    | `CustomsDeclarationsService.uploadDocument`           |
| `getList` (posts)           | Service   | `GetCustomsPostsRepo`                      | `CustomsPostsService.getList`                         |
| `getList` (tasks)           | Service   | `GetCustomsTasksRepo`                      | `CustomsTasksService.getList`                         |
| `getById` (task)            | Service   | `GetCustomsTaskByIdRepo`                   | `CustomsTasksService.getById`                         |
| `getList` (dns queues)      | Service   | `GetDnsQueuesRepo`                         | `DnsQueuesService.getList`                            |
| `getStatus`                 | Service   | `GetCustomsStatusRepo`                     | `CustomsService.getStatus`                            |
| Declarations list           | Page      | `customs-declarations.page.tsx`            | `pages/customs-declarations.tsx`                      |
| Posts list                  | Page      | `customs-posts.page.tsx`                   | `pages/customs-posts.tsx`                             |
| Tasks list                  | Page      | `customs-tasks.page.tsx`                   | `pages/customs-tasks.tsx`                             |
| DNS queues list             | Page      | `dns-queues.page.tsx`                      | `pages/index.tsx`                                     |
| Task detail modal           | Container | `custom-task-details.tsx`                  | `containers/customs-task-detail.tsx`                  |
| Declarations counts popover | Container | `customs-declarations-counts.tsx`          | `containers/customs-declarations-counts.tsx`          |
| Upload document             | Container | `upload-customs-declarations-document.tsx` | `containers/upload-customs-declarations-document.tsx` |
| DGK Status tag              | Container | `customs-status.tsx`                       | `containers/customs-status.tsx`                       |
| DNS query preview           | Container | `DnsQueuePreviewQueryPage`                 | `containers/dns-queues-query-preview.tsx`             |
| DNS response preview        | Container | `DnsQueuePreviewResponsePage`              | `containers/dns-queues-response-preview.tsx`          |

## Customs Tasks Table Columns (all 17 match old project)

| Column            | ID                       | Filter                          | Special                   |
| ----------------- | ------------------------ | ------------------------------- | ------------------------- |
| Actions           | (actions)                | —                               | FileSearchOutlined button |
| Kod               | `id`                     | —                               | small                     |
| M. kodu           | `user_id`                | —                               | small                     |
| Müştəri           | `user_name`              | —                               | large                     |
| Filial            | `branch_id`              | BranchFilter (useBranches)      | normal                    |
| Ölkə              | `country_id`             | CountryFilter (SettingsContext) | small                     |
| İzləmə kodu       | `track_code`             | —                               | `<Tag>` Cell              |
| Anbara əlavə edən | `changer_id`             | —                               | large                     |
| Yəni əlavə olunma | `created_at_humanized`   | —                               | dayjs.fromNow()           |
| Çəkisi            | `weight`                 | —                               | toFixed(2) + kq           |
| Səbət             | `basket_id`              | —                               | normal                    |
| Miqdar            | `quantity`               | —                               | smaller                   |
| Bağ. status       | `declaration_state_name` | —                               | normal                    |
| Məhsul tipi       | `product_type_id`        | —                               | normal                    |
| Top               | `action`                 | —                               | small                     |
| Task statusu      | `state_id`               | TaskStatusFilter (37/38)        | normal                    |
| Yaradılıb         | `created_at`             | —                               | date                      |

## Declarations Action Bar

| Control         | Type    | Notes             |
| --------------- | ------- | ----------------- |
| Yenilə          | Button  | Refresh           |
| Sıfırla         | Button  | Reset filters     |
| Yüklə           | Upload  | JSON file upload  |
| Statistika      | Popover | Lazy-loads counts |
| Cəmi            | Label   | Total count       |
| Bəyan statusu   | Select  | d: 0/1            |
| Müştəri statusu | Select  | u: 0/1            |
| Uçuş statusu    | Select  | flight: in/out    |

## DNS Queues Action Bar

| Control | Type         | Notes              |
| ------- | ------------ | ------------------ |
| Yenilə  | Button       | Refresh            |
| Sıfırla | Button       | Reset              |
| Axtar   | Input.Search | tracking_no filter |

## Missing / Not Migrated

(none)
