# Sidebar Reorder & Permission Gating — Design Spec

**Date:** 2026-06-14
**Reference:** `delivery_management/src/@next/modules/layout/containers/sidebar.tsx`, `delivery_management/src/@next/modules/auth/context/auth.context.tsx`
**Target:** `delivery_management_new/src/modules/layout/containers/sidebar.tsx`, `delivery_management_new/src/modules/me/context/*`

---

## Context

The new sidebar (`src/modules/layout/containers/sidebar.tsx`) already links to nearly every page old's sidebar links to, but:

1. Item order/grouping diverges from old — old has one large "Əsas menyu" (16 items) plus a 4-item "Bəyannamələr" group; new split these differently (10 + 11 items).
2. New renders almost every item unconditionally — old gates nearly every item with `can('permission_name')`, gates whole groups with `hasAnyPermission(...)`, and gates the whole admin menu with `canDisplay('*')` / partner section with `canDisplay('*') || canDisplay('partner')`.
3. `MeContext` only exposes `can()` — it's missing `canDisplay` and `hasAnyPermission`, and `IMeUser` is missing the `admin` field those depend on.

This spec covers both: restoring old's order/grouping, and porting old's full permission-gating to the new `MeContext` + sidebar. Count badges (already implemented in a prior change) are preserved.

Three sidebar items have no counterpart in old's sidebar at all (`Yeşik köçürmələri` / box-transfers, `Göndərilməyən bildirişlər` / failed-jobs, `Telegram bot istifadəçiləri` / telegram-bot-users). Old gates their _routes_ (not sidebar items, which don't exist) with `can('container_transfers_logs')`, `can('dev')`, and `can('telegram_grant')` respectively — this spec reuses those same permission names for the sidebar items.

---

## Part 1 — `MeContext` additions

### `src/modules/me/context/types.ts`

Add `admin` to `IMeUser`:

```ts
export interface IMeUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  permissions: string[];
  adminBranchId: number | null;
  admin: number | null;
}
```

Extend `IMeContext`:

```ts
export interface IMeContext {
  state: IMeState;
  dispatch: Dispatch<MeAction>;
  can: (permission: string) => boolean;
  canDisplay: (route: '*' | 'partner') => boolean;
  hasAnyPermission: (group: 'settings' | 'declarations' | 'queues' | 'notify' | 'content') => boolean;
}
```

### `src/modules/me/mappers/index.ts`

In `MeMappers.meFromApi`, map `admin` the same way `adminBranchId` is mapped:

```ts
admin: userData.admin ?? null,
```

### `src/modules/me/context/context.tsx`

Default context value gets `canDisplay: () => false` and `hasAnyPermission: () => false`.

Inside `MeProvider`, add (ported verbatim from old's `auth.context.tsx`):

```tsx
const permissions = useMemo(
  () => ({
    settings: {
      systemSettings: can('system_settings'),
      coupons: can('coupons'),
      returns: can('returns'),
      cashback: can('cashback'),
      foreignCargoes: can('foreign_cargoes'),
      containers: can('containers'),
      shopNames: can('shop_names'),
      returnReasons: can('return_reasons'),
      countries: can('countries'),
      branches: can('branches'),
      companies: can('companies'),
      tarifs: can('tarifs'),
      productTypes: can('producttypes'),
      regions: can('regions'),
      models: can('models'),
      states: can('states'),
    },
    declarations: {
      dgkDeclarations: can('dgk_declarations'),
      deletedCustomsDeclarations: can('deleted_customs_declarations'),
      postDeclarations: can('post_declarations'),
    },
    queues: {
      bbsQueues: can('bbs_queues'),
      unitedQueues: can('united_queues'),
      azerpostQueues: can('azerpost_queues'),
    },
    notify: {
      smsArchive: can('sms_archive'),
      whatsappArchive: can('whatsapp_archive'),
      mailArchive: can('mail_archive'),
      bulkAppNotification: can('bulk_app_notification'),
      notificationTemplates: can('notification_templates'),
      ticketTemplates: can('ticket_templates'),
    },
    content: {
      stateChanges: can('state_changes'),
      myLogs: can('my_logs'),
      partnerDeclarations: can('partner_declarations'),
      news: can('news'),
      faq: can('faq'),
      shops: can('shops'),
      transportationConditions: can('transportation_conditions'),
      banners: can('banners'),
      popups: can('popups'),
    },
  }),
  [can],
);

const hasAnyPermission = useCallback((group: keyof typeof permissions) => Object.values(permissions[group]).some(Boolean), [permissions]);

const canDisplay = useCallback(
  (route: '*' | 'partner') => {
    switch (route) {
      case '*':
        return state.user.data?.admin === 1;
      case 'partner':
        return state.user.data?.admin === 4;
      default:
        return false;
    }
  },
  [state.user.data],
);
```

Pass `canDisplay` and `hasAnyPermission` through the `MeContext.Provider` value. `content`'s permission map intentionally omits `about`/`delivery_proof` permissions — replicated verbatim from old, including this quirk.

---

## Part 2 — Sidebar reorder + permission gating

`sidebar.tsx` destructures `{ can, canDisplay, hasAnyPermission }` from `MeContext`. The whole admin menu is wrapped in `canDisplay('*') && (<>...</>)`; "Filial bölmələri" becomes a sibling wrapped in `(canDisplay('*') || canDisplay('partner')) && (...)`. Every `Menu.Item` (except those with no permission in old) is wrapped `{can('xxx') && (<Menu.Item>...)}`. Groups get `hasAnyPermission(...)` wrappers where old has them.

### Ümumi (no group wrapper)

| #   | Label                              | Route                        | Permission                 | Icon                    |
| --- | ---------------------------------- | ---------------------------- | -------------------------- | ----------------------- |
| 1   | Statistika                         | `/statistics`                | `stat`                     | LineChartOutlined       |
| 2   | Müştəri qəbul                      | `/appointment`               | `client_appointment`       | CustomerServiceOutlined |
| 3   | Anbardar təhvil (+ handover badge) | `/warehouse/handover/queues` | `local_warehouse`          | UserSwitchOutlined      |
| 4   | Cashflow                           | `/cash-flow`                 | `cashflow`                 | FundOutlined            |
| 5   | Yeşik köçürmələri                  | `/box-transfers`             | `container_transfers_logs` | SwapOutlined            |

### Əsas menyu (no group wrapper, old's 16-item order)

| #   | Label                  | Route                             | Permission                | Icon                       | Extra                     |
| --- | ---------------------- | --------------------------------- | ------------------------- | -------------------------- | ------------------------- |
| 1   | İstifadəçilər          | `/users`                          | `users`                   | TeamOutlined               |                           |
| 2   | Sifarişlər             | `/orders`                         | `orders`                  | ShoppingCartOutlined       | orders badge              |
| 3   | Bağlamalar             | `/declarations`                   | _(none)_                  | InboxOutlined              | declarations badge        |
| 4   | United bəyannamələri   | `/united-declarations`            | `trendyol_declarations`   | FileTextOutlined           |                           |
| 5   | United iadələri        | `/united-returns`                 | `united_returns`          | RollbackOutlined           |                           |
| 6   | Partnyor bəyannamələri | `/declarations/partners`          | `partner_declarations`    | TeamOutlined               |                           |
| 7   | Filial göndərişləri    | `/sorting`                        | `parcel_sorting_list`     | DeliveredProcedureOutlined |                           |
| 8   | Filial yoxlamaları     | `/branch-inspections`             | `branch_inspections_list` | AuditOutlined              | InspectionBadge           |
| 9   | Uçuşlar                | `/flights`                        | `flights`                 | RocketOutlined             |                           |
| 10  | Müraciətlər            | `/supports`                       | `tickets`                 | MessageOutlined            | supports badge            |
| 11  | Balans əməliyyatları   | `/transactions`                   | `transactions`            | MoneyCollectOutlined       |                           |
| 12  | Kuryerlər              | `/couriers`                       | `couriers`                | CarOutlined                | couriers badge            |
| 13  | Kuryer təhkim          | `/couriers/deliverer-assignments` | `courier_assignments`     | UserAddOutlined            |                           |
| 14  | Naməlum bəyannamələr   | `/declarations/unknowns`          | `conflicted_declarations` | QuestionCircleOutlined     | unknownDeclarations badge |
| 15  | Bağlamalar arxivi      | `/declarations/archived`          | `declarations_archive`    | FileTextOutlined           |                           |
| 16  | Gömrük tapşırıqları    | `/customs/tasks`                  | `bbs_office`              | AuditOutlined              |                           |

### Bəyannamələr — wrapped in `hasAnyPermission('declarations')`

| #   | Label                    | Route                   | Permission                     | Icon              |
| --- | ------------------------ | ----------------------- | ------------------------------ | ----------------- |
| 1   | Bəyannamələr             | `/customs/declarations` | `dgk_declarations`             | ExceptionOutlined |
| 2   | Silinmiş bəyannamələr    | `/declarations/deleted` | `deleted_customs_declarations` | DeleteOutlined    |
| 3   | DGK Bağlamalar           | `/customs/posts`        | `dgk_declarations`             | AuditOutlined     |
| 4   | Bəyan sonrası bağlamalar | `/declarations/post`    | `post_declarations`            | FileTextOutlined  |

### Növbələr — wrapped in `hasAnyPermission('queues')`

| #   | Label              | Route                 | Permission        | Icon                |
| --- | ------------------ | --------------------- | ----------------- | ------------------- |
| 1   | BBS növbələri      | `/customs/dns-queues` | `bbs_queues`      | OrderedListOutlined |
| 2   | United növbələri   | `/united-queues`      | `united_queues`   | DropboxOutlined     |
| 3   | Azərpoçt növbələri | `/azerpost-queues`    | `azerpost_queues` | DropboxOutlined     |

### Bildirişlər — wrapped in `hasAnyPermission('notify')`

| #   | Label                     | Route                        | Permission               | Icon                 |
| --- | ------------------------- | ---------------------------- | ------------------------ | -------------------- |
| 1   | SMS Arxivi                | `/notifier/sms`              | `sms_archive`            | TabletOutlined       |
| 2   | Whatsapp Arxivi           | `/notifier/whatsapp`         | `whatsapp_archive`       | WhatsAppOutlined     |
| 3   | Mail Arxivi               | `/notifier/email`            | `mail_archive`           | MailOutlined         |
| 4   | APP bildiriş              | `/notifier/mobile/bulk/send` | `bulk_app_notification`  | NotificationOutlined |
| 5   | Bildiriş şablonları       | `/notifier/templates`        | `notification_templates` | NotificationOutlined |
| 6   | Müraciət şablonları       | `/ticket-templates`          | `ticket_templates`       | FileTextOutlined     |
| 7   | Göndərilməyən bildirişlər | `/failed-jobs`               | `dev`                    | CloseSquareOutlined  |

### Məzmun — wrapped in `hasAnyPermission('content')`

| #   | Label                       | Route                        | Permission                  | Icon                   |
| --- | --------------------------- | ---------------------------- | --------------------------- | ---------------------- |
| 1   | Status Arxivi               | `/archive/state`             | `state_changes`             | HistoryOutlined        |
| 2   | Əməliyyat Arxivi            | `/logs`                      | `my_logs`                   | FileSearchOutlined     |
| 3   | Xəbərlər                    | `/news`                      | `news`                      | ReadOutlined           |
| 4   | Tez-tez verilən suallar     | `/faq`                       | `faq`                       | QuestionCircleOutlined |
| 5   | Mağazalar                   | `/shops`                     | `shops`                     | ShoppingOutlined       |
| 6   | Haqqında                    | `/about`                     | `about`                     | InfoCircleOutlined     |
| 7   | Daşınma şərtləri            | `/transportation_conditions` | `transportation_conditions` | CarOutlined            |
| 8   | Bannerlər                   | `/banners`                   | `banners`                   | PictureOutlined        |
| 9   | Popuplar                    | `/popups`                    | `popups`                    | NotificationOutlined   |
| 10  | Təhvil sənədləri            | `/delivery-proofs`           | `delivery_proof`            | FileProtectOutlined    |
| 11  | Telegram bot istifadəçiləri | `/telegram-bot-users`        | `telegram_grant`            | RobotOutlined          |

### Proqram ayarları — wrapped in `hasAnyPermission('settings')`

| #   | Label            | Route              | Permission        | Icon                |
| --- | ---------------- | ------------------ | ----------------- | ------------------- |
| 1   | Sistem ayarları  | `/settings`        | `system_settings` | SettingOutlined     |
| 2   | Kuponlar         | `/coupons`         | `coupons`         | GiftOutlined        |
| 3   | İadələr          | `/refunds`         | `returns`         | RollbackOutlined    |
| 4   | Kəşbəklər        | `/cashback`        | `cashback`        | SketchOutlined      |
| 5   | Xarici karqolar  | `/cargoes`         | `foreign_cargoes` | CodeSandboxOutlined |
| 6   | Yeşiklər         | `/boxes`           | `containers`      | InboxOutlined       |
| 7   | Xarici mağazalar | `/shop-names`      | `shop_names`      | ShopOutlined        |
| 8   | İadə səbəbləri   | `/return-types`    | `return_reasons`  | RollbackOutlined    |
| 9   | Ölkələr          | `/countries`       | `countries`       | GlobalOutlined      |
| 10  | Filiallar        | `/branches`        | `branches`        | BranchesOutlined    |
| 11  | Şirkətlər        | `/branch-partners` | `companies`       | BankOutlined        |
| 12  | Tariflər         | `/plans`           | `tarifs`          | TableOutlined       |
| 13  | Məhsul tipləri   | `/product-types`   | `producttypes`    | AppstoreOutlined    |
| 14  | Rayonlar         | `/regions`         | `regions`         | EnvironmentOutlined |
| 15  | Modellər         | `/models`          | `models`          | ApartmentOutlined   |
| 16  | Statuslar        | `/status`          | `states`          | TagOutlined         |

### Filial bölmələri — wrapped in `(canDisplay('*') || canDisplay('partner')) && (...)`, sibling to the admin menu block

| #   | Label                    | Route                          | Permission       | Icon              |
| --- | ------------------------ | ------------------------------ | ---------------- | ----------------- |
| 1   | Yeşiklər                 | `/partner-boxes`               | _(none)_         | InboxOutlined     |
| 2   | Bağlama qəbulu           | `/partner/acceptance/box`      | _(none)_         | FileTextOutlined  |
| 3   | Yerli anbar statistikası | `/statistics/branches-partner` | `branch_manager` | LineChartOutlined |

---

## Out of scope

- No changes to routing/pages, only the sidebar menu and `MeContext`.
- No new permission names beyond what's listed above (the 3 new-only items reuse old's route-guard permission names).
