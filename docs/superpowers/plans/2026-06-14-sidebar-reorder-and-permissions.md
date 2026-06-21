# Sidebar Reorder & Permission Gating Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore old `delivery_management`'s sidebar item order/grouping and port its `canDisplay`/`hasAnyPermission`/`can` permission gating to the new sidebar and `MeContext`.

**Architecture:** Two independent file groups: (1) `MeContext` gains an `admin` field on the user plus `canDisplay`/`hasAnyPermission` helpers (ported verbatim from old's `auth.context.tsx`); (2) `sidebar.tsx` is rewritten so every group/item matches old's order and is wrapped in the appropriate `can()`/`hasAnyPermission()`/`canDisplay()` check. Count badges added previously are preserved.

**Tech Stack:** React 18 + TypeScript, Ant Design v5 `Menu`, React Context (`MeContext`).

**Reference spec:** `docs/superpowers/specs/2026-06-14-sidebar-reorder-and-permissions-design.md`

**Note on verification:** This codebase has no test framework configured (`npm test` only runs `react-app-rewired test` with zero spec files present). Verification for both tasks is `npx tsc --noEmit` plus a dev-server visual check per `CLAUDE.md`. If you cannot log in (no test credentials available), rely on `tsc` + careful review against the tables in the spec doc instead, and say so explicitly — don't claim the UI was verified if it wasn't.

---

### Task 1: MeContext — `admin` field, `canDisplay`, `hasAnyPermission`

**Files:**

- Modify: `src/modules/me/context/types.ts`
- Modify: `src/modules/me/mappers/index.ts`
- Modify: `src/modules/me/context/context.tsx`

- [x] **Step 1: Add `admin` to `IMeUser` and extend `IMeContext`**

In `src/modules/me/context/types.ts`, add `admin: number | null;` to `IMeUser` (alongside `adminBranchId`):

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

And extend `IMeContext`:

```ts
export interface IMeContext {
  state: IMeState;
  dispatch: Dispatch<MeAction>;
  can: (permission: string) => boolean;
  canDisplay: (route: '*' | 'partner') => boolean;
  hasAnyPermission: (group: 'settings' | 'declarations' | 'queues' | 'notify' | 'content') => boolean;
}
```

- [x] **Step 2: Map `admin` from the API response**

In `src/modules/me/mappers/index.ts`, add `admin` to the object returned by `meFromApi`, next to `adminBranchId`:

```ts
  public static meFromApi(raw: any): IMeUser {
    const userData = raw?.data || {};

    return {
      id: userData.id,
      firstName: userData.name,
      lastName: userData.surname,
      email: userData.email,
      permissions: Array.isArray(raw?.permissions)
        ? raw.permissions.map(({ code_name }: any) => code_name)
        : [],
      adminBranchId: userData.admin_branch_id ?? null,
      admin: userData.admin ?? null,
    };
  }
```

- [x] **Step 3: Implement `canDisplay` and `hasAnyPermission` in `MeProvider`**

Replace the full contents of `src/modules/me/context/context.tsx` with:

```tsx
import React, { createContext, FC, PropsWithChildren, useCallback, useMemo, useReducer } from 'react';
import { useBootstrapMeContext } from './hooks';
import { meContextReducer } from './reducer';
import { initialMeContextState } from './state';
import { IMeContext } from './types';

export const MeContext = createContext<IMeContext>({
  state: initialMeContextState,
  dispatch: () => null,
  can: () => false,
  canDisplay: () => false,
  hasAnyPermission: () => false,
});

export const MeProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(meContextReducer, initialMeContextState);

  useBootstrapMeContext(state, dispatch);

  const can = useCallback((permission: string) => !!state.user.data?.permissions.includes(permission), [state.user.data?.permissions]);

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

  return <MeContext.Provider value={{ state, dispatch, can, canDisplay, hasAnyPermission }}>{children}</MeContext.Provider>;
};
```

- [ ] **Step 4: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors related to `src/modules/me/*`. (Pre-existing unrelated errors in `node_modules/@ant-design/pro-form` are expected and not caused by this change — ignore them.)

- [ ] **Step 5: Commit**

```bash
git add src/modules/me/context/types.ts src/modules/me/mappers/index.ts src/modules/me/context/context.tsx
git commit -m "feat: add admin field, canDisplay and hasAnyPermission to MeContext"
```

---

### Task 2: Sidebar reorder + permission gating

**Files:**

- Modify: `src/modules/layout/containers/sidebar.tsx` (full rewrite)

This task replaces the entire file content. The new structure:

- Wraps the whole admin menu in `canDisplay('*') && (<>...</>)`.
- Reorders "Ümumi" (now 5 items) and "Əsas menyu" (now 16 items, old's order) — see spec tables for the full mapping.
- Reduces "Bəyannamələr" to old's original 4 items, wrapped in `hasAnyPermission('declarations')`.
- Adds `hasAnyPermission(...)` wrappers to "Növbələr" (`queues`), "Bildirişlər" (`notify`), "Məzmun" (`content`), "Proqram ayarları" (`settings`).
- Wraps every item in `can('permission_name')` per the spec tables (only "Bağlamalar", "Yeşiklər" [partner], "Bağlama qəbulu" [partner] have no permission, matching old).
- Moves "Filial bölmələri" outside the `canDisplay('*')` block, as a sibling wrapped in `(canDisplay('*') || canDisplay('partner')) && (...)`.
- Preserves the existing count badges (`counter.*`) and `InspectionBadge`/`shouldShowBadge` exactly as previously implemented.

- [ ] **Step 1: Replace `src/modules/layout/containers/sidebar.tsx` with the new structure**

```tsx
import React, { useContext } from 'react';
import { Menu } from 'antd';
import * as Icons from '@ant-design/icons';
import { NavLink } from 'react-router-dom';
import { StyledSider, SiderOverlay, Brand, InspectionBadge } from '../styled';
import { useSidebar } from '../hooks';
import { MeContext } from '@modules/me/context/context';
import { useInspectionBadge } from '@modules/branch-inspections';
import { useCounter } from '@modules/counter';

export const AppSidebar = () => {
  const { isOpen, activeKey, toggleSidebar } = useSidebar();
  const { can, canDisplay, hasAnyPermission } = useContext(MeContext);
  const { shouldShowBadge } = useInspectionBadge();
  const { state: counter, onMouseEnter } = useCounter();

  return (
    <React.Fragment>
      <StyledSider trigger={null} collapsible width={224} collapsedWidth={46} collapsed={!isOpen} className={isOpen ? 'active' : 'inactive'}>
        <Brand>{isOpen ? <img src="/logo.svg" alt={process.env.REACT_APP_COMPANY_NAME} /> : <img src="/logo-compact.svg" alt={process.env.REACT_APP_COMPANY_NAME} />}</Brand>
        <Menu onMouseOver={onMouseEnter} theme="dark" mode="inline" selectedKeys={[activeKey]}>
          {canDisplay('*') && (
            <>
              <Menu.ItemGroup title="Ümumi">
                {can('stat') && (
                  <Menu.Item key="/statistics" icon={<Icons.LineChartOutlined />}>
                    Statistika
                    <NavLink to="/statistics" />
                  </Menu.Item>
                )}
                {can('client_appointment') && (
                  <Menu.Item key="/appointment" icon={<Icons.CustomerServiceOutlined />}>
                    Müştəri qəbul
                    <NavLink to="/appointment" />
                  </Menu.Item>
                )}
                {can('local_warehouse') && (
                  <Menu.Item key="/warehouse/handover/queues" icon={<Icons.UserSwitchOutlined />}>
                    Anbardar təhvil ({counter.handoverQueue.pending}/{counter.handoverQueue.executing})
                    <NavLink to="/warehouse/handover/queues" />
                  </Menu.Item>
                )}
                {can('cashflow') && (
                  <Menu.Item key="/cash-flow" icon={<Icons.FundOutlined />}>
                    Cashflow
                    <NavLink to="/cash-flow" />
                  </Menu.Item>
                )}
                {can('container_transfers_logs') && (
                  <Menu.Item key="/box-transfers" icon={<Icons.SwapOutlined />}>
                    Yeşik köçürmələri
                    <NavLink to="/box-transfers" />
                  </Menu.Item>
                )}
              </Menu.ItemGroup>
              <Menu.ItemGroup title="Əsas menyu">
                {can('users') && (
                  <Menu.Item key="/users" icon={<Icons.TeamOutlined />}>
                    İstifadəçilər
                    <NavLink to="/users" />
                  </Menu.Item>
                )}
                {can('orders') && (
                  <Menu.Item key="/orders" icon={<Icons.ShoppingCartOutlined />}>
                    Sifarişlər {!!counter.declarations && `(${counter.orders})`}
                    <NavLink to="/orders" />
                  </Menu.Item>
                )}
                <Menu.Item key="/declarations" icon={<Icons.InboxOutlined />}>
                  Bağlamalar {!!counter.declarations && `(${counter.declarations})`}
                  <NavLink to="/declarations" />
                </Menu.Item>
                {can('trendyol_declarations') && (
                  <Menu.Item key="/united-declarations" icon={<Icons.FileTextOutlined />}>
                    United bəyannamələri
                    <NavLink to="/united-declarations" />
                  </Menu.Item>
                )}
                {can('united_returns') && (
                  <Menu.Item key="/united-returns" icon={<Icons.RollbackOutlined />}>
                    United iadələri
                    <NavLink to="/united-returns" />
                  </Menu.Item>
                )}
                {can('partner_declarations') && (
                  <Menu.Item key="/declarations/partners" icon={<Icons.TeamOutlined />}>
                    Partnyor bəyannamələri
                    <NavLink to="/declarations/partners" />
                  </Menu.Item>
                )}
                {can('parcel_sorting_list') && (
                  <Menu.Item key="/sorting" icon={<Icons.DeliveredProcedureOutlined />}>
                    Filial göndərişləri
                    <NavLink to="/sorting" />
                  </Menu.Item>
                )}
                {can('branch_inspections_list') && (
                  <Menu.Item key="/branch-inspections" icon={<Icons.AuditOutlined />}>
                    Filial yoxlamaları
                    {shouldShowBadge && <InspectionBadge />}
                    <NavLink to="/branch-inspections" />
                  </Menu.Item>
                )}
                {can('flights') && (
                  <Menu.Item key="/flights" icon={<Icons.RocketOutlined />}>
                    Uçuşlar
                    <NavLink to="/flights" />
                  </Menu.Item>
                )}
                {can('tickets') && (
                  <Menu.Item key="/supports" icon={<Icons.MessageOutlined />}>
                    Müraciətlər {!!counter.supports && `(${counter.supports})`}
                    <NavLink to="/supports" />
                  </Menu.Item>
                )}
                {can('transactions') && (
                  <Menu.Item key="/transactions" icon={<Icons.MoneyCollectOutlined />}>
                    Balans əməliyyatları
                    <NavLink to="/transactions" />
                  </Menu.Item>
                )}
                {can('couriers') && (
                  <Menu.Item key="/couriers" icon={<Icons.CarOutlined />}>
                    Kuryerlər {!!counter.couriers && `(${counter.couriers})`}
                    <NavLink to="/couriers" />
                  </Menu.Item>
                )}
                {can('courier_assignments') && (
                  <Menu.Item key="/couriers/deliverer-assignments" icon={<Icons.UserAddOutlined />}>
                    Kuryer təhkim
                    <NavLink to="/couriers/deliverer-assignments" />
                  </Menu.Item>
                )}
                {can('conflicted_declarations') && (
                  <Menu.Item key="/declarations/unknowns" icon={<Icons.QuestionCircleOutlined />}>
                    Naməlum bəyannamələr {!!counter.unknownDeclarations && `(${counter.unknownDeclarations})`}
                    <NavLink to="/declarations/unknowns" />
                  </Menu.Item>
                )}
                {can('declarations_archive') && (
                  <Menu.Item key="/declarations/archived" icon={<Icons.FileTextOutlined />}>
                    Bağlamalar arxivi
                    <NavLink to="/declarations/archived" />
                  </Menu.Item>
                )}
                {can('bbs_office') && (
                  <Menu.Item key="/customs/tasks" icon={<Icons.AuditOutlined />}>
                    Gömrük tapşırıqları
                    <NavLink to="/customs/tasks" />
                  </Menu.Item>
                )}
              </Menu.ItemGroup>
              {hasAnyPermission('declarations') && (
                <Menu.ItemGroup title="Bəyannamələr">
                  {can('dgk_declarations') && (
                    <Menu.Item key="/customs/declarations" icon={<Icons.ExceptionOutlined />}>
                      Bəyannamələr
                      <NavLink to="/customs/declarations" />
                    </Menu.Item>
                  )}
                  {can('deleted_customs_declarations') && (
                    <Menu.Item key="/declarations/deleted" icon={<Icons.DeleteOutlined />}>
                      Silinmiş bəyannamələr
                      <NavLink to="/declarations/deleted" />
                    </Menu.Item>
                  )}
                  {can('dgk_declarations') && (
                    <Menu.Item key="/customs/posts" icon={<Icons.AuditOutlined />}>
                      DGK Bağlamalar
                      <NavLink to="/customs/posts" />
                    </Menu.Item>
                  )}
                  {can('post_declarations') && (
                    <Menu.Item key="/declarations/post" icon={<Icons.FileTextOutlined />}>
                      Bəyan sonrası bağlamalar
                      <NavLink to="/declarations/post" />
                    </Menu.Item>
                  )}
                </Menu.ItemGroup>
              )}
              {hasAnyPermission('queues') && (
                <Menu.ItemGroup title="Növbələr">
                  {can('bbs_queues') && (
                    <Menu.Item key="/customs/dns-queues" icon={<Icons.OrderedListOutlined />}>
                      BBS növbələri
                      <NavLink to="/customs/dns-queues" />
                    </Menu.Item>
                  )}
                  {can('united_queues') && (
                    <Menu.Item key="/united-queues" icon={<Icons.DropboxOutlined />}>
                      United növbələri
                      <NavLink to="/united-queues" />
                    </Menu.Item>
                  )}
                  {can('azerpost_queues') && (
                    <Menu.Item key="/azerpost-queues" icon={<Icons.DropboxOutlined />}>
                      Azərpoçt növbələri
                      <NavLink to="/azerpost-queues" />
                    </Menu.Item>
                  )}
                </Menu.ItemGroup>
              )}
              {hasAnyPermission('notify') && (
                <Menu.ItemGroup title="Bildirişlər">
                  {can('sms_archive') && (
                    <Menu.Item key="/notifier/sms" icon={<Icons.TabletOutlined />}>
                      SMS Arxivi
                      <NavLink to="/notifier/sms" />
                    </Menu.Item>
                  )}
                  {can('whatsapp_archive') && (
                    <Menu.Item key="/notifier/whatsapp" icon={<Icons.WhatsAppOutlined />}>
                      Whatsapp Arxivi
                      <NavLink to="/notifier/whatsapp" />
                    </Menu.Item>
                  )}
                  {can('mail_archive') && (
                    <Menu.Item key="/notifier/email" icon={<Icons.MailOutlined />}>
                      Mail Arxivi
                      <NavLink to="/notifier/email" />
                    </Menu.Item>
                  )}
                  {can('bulk_app_notification') && (
                    <Menu.Item key="/notifier/mobile/bulk/send" icon={<Icons.NotificationOutlined />}>
                      APP bildiriş
                      <NavLink to="/notifier/mobile/bulk/send" />
                    </Menu.Item>
                  )}
                  {can('notification_templates') && (
                    <Menu.Item key="/notifier/templates" icon={<Icons.NotificationOutlined />}>
                      Bildiriş şablonları
                      <NavLink to="/notifier/templates" />
                    </Menu.Item>
                  )}
                  {can('ticket_templates') && (
                    <Menu.Item key="/ticket-templates" icon={<Icons.FileTextOutlined />}>
                      Müraciət şablonları
                      <NavLink to="/ticket-templates" />
                    </Menu.Item>
                  )}
                  {can('dev') && (
                    <Menu.Item key="/failed-jobs" icon={<Icons.CloseSquareOutlined />}>
                      Göndərilməyən bildirişlər
                      <NavLink to="/failed-jobs" />
                    </Menu.Item>
                  )}
                </Menu.ItemGroup>
              )}
              {hasAnyPermission('content') && (
                <Menu.ItemGroup title="Məzmun">
                  {can('state_changes') && (
                    <Menu.Item key="/archive/state" icon={<Icons.HistoryOutlined />}>
                      Status Arxivi
                      <NavLink to="/archive/state" />
                    </Menu.Item>
                  )}
                  {can('my_logs') && (
                    <Menu.Item key="/logs" icon={<Icons.FileSearchOutlined />}>
                      Əməliyyat Arxivi
                      <NavLink to="/logs" />
                    </Menu.Item>
                  )}
                  {can('news') && (
                    <Menu.Item key="/news" icon={<Icons.ReadOutlined />}>
                      Xəbərlər
                      <NavLink to="/news" />
                    </Menu.Item>
                  )}
                  {can('faq') && (
                    <Menu.Item key="/faq" icon={<Icons.QuestionCircleOutlined />}>
                      Tez-tez verilən suallar
                      <NavLink to="/faq" />
                    </Menu.Item>
                  )}
                  {can('shops') && (
                    <Menu.Item key="/shops" icon={<Icons.ShoppingOutlined />}>
                      Mağazalar
                      <NavLink to="/shops" />
                    </Menu.Item>
                  )}
                  {can('about') && (
                    <Menu.Item key="/about" icon={<Icons.InfoCircleOutlined />}>
                      Haqqında
                      <NavLink to="/about" />
                    </Menu.Item>
                  )}
                  {can('transportation_conditions') && (
                    <Menu.Item key="/transportation_conditions" icon={<Icons.CarOutlined />}>
                      Daşınma şərtləri
                      <NavLink to="/transportation_conditions" />
                    </Menu.Item>
                  )}
                  {can('banners') && (
                    <Menu.Item key="/banners" icon={<Icons.PictureOutlined />}>
                      Bannerlər
                      <NavLink to="/banners" />
                    </Menu.Item>
                  )}
                  {can('popups') && (
                    <Menu.Item key="/popups" icon={<Icons.NotificationOutlined />}>
                      Popuplar
                      <NavLink to="/popups" />
                    </Menu.Item>
                  )}
                  {can('delivery_proof') && (
                    <Menu.Item key="/delivery-proofs" icon={<Icons.FileProtectOutlined />}>
                      Təhvil sənədləri
                      <NavLink to="/delivery-proofs" />
                    </Menu.Item>
                  )}
                  {can('telegram_grant') && (
                    <Menu.Item key="/telegram-bot-users" icon={<Icons.RobotOutlined />}>
                      Telegram bot istifadəçiləri
                      <NavLink to="/telegram-bot-users" />
                    </Menu.Item>
                  )}
                </Menu.ItemGroup>
              )}
              {hasAnyPermission('settings') && (
                <Menu.ItemGroup title="Proqram ayarları">
                  {can('system_settings') && (
                    <Menu.Item key="/settings" icon={<Icons.SettingOutlined />}>
                      Sistem ayarları
                      <NavLink to="/settings" />
                    </Menu.Item>
                  )}
                  {can('coupons') && (
                    <Menu.Item key="/coupons" icon={<Icons.GiftOutlined />}>
                      Kuponlar
                      <NavLink to="/coupons" />
                    </Menu.Item>
                  )}
                  {can('returns') && (
                    <Menu.Item key="/refunds" icon={<Icons.RollbackOutlined />}>
                      İadələr
                      <NavLink to="/refunds" />
                    </Menu.Item>
                  )}
                  {can('cashback') && (
                    <Menu.Item key="/cashback" icon={<Icons.SketchOutlined />}>
                      Kəşbəklər
                      <NavLink to="/cashback" />
                    </Menu.Item>
                  )}
                  {can('foreign_cargoes') && (
                    <Menu.Item key="/cargoes" icon={<Icons.CodeSandboxOutlined />}>
                      Xarici karqolar
                      <NavLink to="/cargoes" />
                    </Menu.Item>
                  )}
                  {can('containers') && (
                    <Menu.Item key="/boxes" icon={<Icons.InboxOutlined />}>
                      Yeşiklər
                      <NavLink to="/boxes" />
                    </Menu.Item>
                  )}
                  {can('shop_names') && (
                    <Menu.Item key="/shop-names" icon={<Icons.ShopOutlined />}>
                      Xarici mağazalar
                      <NavLink to="/shop-names" />
                    </Menu.Item>
                  )}
                  {can('return_reasons') && (
                    <Menu.Item key="/return-types" icon={<Icons.RollbackOutlined />}>
                      İadə səbəbləri
                      <NavLink to="/return-types" />
                    </Menu.Item>
                  )}
                  {can('countries') && (
                    <Menu.Item key="/countries" icon={<Icons.GlobalOutlined />}>
                      Ölkələr
                      <NavLink to="/countries" />
                    </Menu.Item>
                  )}
                  {can('branches') && (
                    <Menu.Item key="/branches" icon={<Icons.BranchesOutlined />}>
                      Filiallar
                      <NavLink to="/branches" />
                    </Menu.Item>
                  )}
                  {can('companies') && (
                    <Menu.Item key="/branch-partners" icon={<Icons.BankOutlined />}>
                      Şirkətlər
                      <NavLink to="/branch-partners" />
                    </Menu.Item>
                  )}
                  {can('tarifs') && (
                    <Menu.Item key="/plans" icon={<Icons.TableOutlined />}>
                      Tariflər
                      <NavLink to="/plans" />
                    </Menu.Item>
                  )}
                  {can('producttypes') && (
                    <Menu.Item key="/product-types" icon={<Icons.AppstoreOutlined />}>
                      Məhsul tipləri
                      <NavLink to="/product-types" />
                    </Menu.Item>
                  )}
                  {can('regions') && (
                    <Menu.Item key="/regions" icon={<Icons.EnvironmentOutlined />}>
                      Rayonlar
                      <NavLink to="/regions" />
                    </Menu.Item>
                  )}
                  {can('models') && (
                    <Menu.Item key="/models" icon={<Icons.ApartmentOutlined />}>
                      Modellər
                      <NavLink to="/models" />
                    </Menu.Item>
                  )}
                  {can('states') && (
                    <Menu.Item key="/status" icon={<Icons.TagOutlined />}>
                      Statuslar
                      <NavLink to="/status" />
                    </Menu.Item>
                  )}
                </Menu.ItemGroup>
              )}
            </>
          )}
          {(canDisplay('*') || canDisplay('partner')) && (
            <Menu.ItemGroup title="Filial bölmələri">
              <Menu.Item key="/partner-boxes" icon={<Icons.InboxOutlined />}>
                Yeşiklər
                <NavLink to="/partner-boxes" />
              </Menu.Item>
              <Menu.Item key="/partner/acceptance/box" icon={<Icons.FileTextOutlined />}>
                Bağlama qəbulu
                <NavLink to="/partner/acceptance/box" />
              </Menu.Item>
              {can('branch_manager') && (
                <Menu.Item key="/statistics/branches-partner" icon={<Icons.LineChartOutlined />}>
                  Yerli anbar statistikası
                  <NavLink to="/statistics/branches-partner" />
                </Menu.Item>
              )}
            </Menu.ItemGroup>
          )}
        </Menu>
      </StyledSider>
      <SiderOverlay $visible={isOpen} onClick={toggleSidebar} />
    </React.Fragment>
  );
};
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors related to `src/modules/layout/containers/sidebar.tsx`. (Pre-existing unrelated errors in `node_modules/@ant-design/pro-form` are expected — ignore them.)

- [ ] **Step 3: Visual check**

Run `npm start`, log in as a user with `admin === 1` (full admin). Confirm:

- "Ümumi" shows Statistika, Müştəri qəbul, Anbardar təhvil (with handover badge), Cashflow, Yeşik köçürmələri (in that order, subject to permissions).
- "Əsas menyu" shows the 16 items in old's order (İstifadəçilər ... Gömrük tapşırıqları), with order/declarations/supports/couriers/unknown-declarations badges intact and the branch-inspection badge on "Filial yoxlamaları".
- "Bəyannamələr" shows only the 4 customs-declaration items.
- Each group disappears entirely if the logged-in user lacks all permissions in that group's `hasAnyPermission` set.
- If a partner (`admin === 4`) user is available, confirm "Filial bölmələri" still renders for them even though the rest of the menu is hidden.

If no test login is available, state explicitly that the visual check was skipped and rely on the `tsc` pass plus a side-by-side review against the spec's tables.

- [ ] **Step 4: Commit**

```bash
git add src/modules/layout/containers/sidebar.tsx
git commit -m "feat: reorder sidebar to match old grouping and add permission gating"
```
