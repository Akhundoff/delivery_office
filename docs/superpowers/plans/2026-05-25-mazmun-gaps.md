# Məzmun Module Gaps Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fill 4 gaps in the Məzmun menu group so the new project matches the old delivery_management flows exactly.

**Architecture:** Four independent changes — shops details modal, logs export actions, archive-status selection buttons, and a full telegram-bot-users module with a navigation button from delivery-proofs.

**Tech Stack:** React 18, TypeScript, react-query v3, Ant Design 5, styled-components, dayjs, React Router v6.

---

## File Map

| File | Change |
|---|---|
| `src/modules/shops/pages/shop-details.tsx` | Create — details modal |
| `src/modules/shops/router/modal.router.tsx` | Modify — add `/:id/details` route |
| `src/modules/shops/hooks/shops/use-shops-table-columns.tsx` | Modify — add "Detay" dropdown item |
| `src/modules/logs/services/index.ts` | Modify — add `exportAsExcel`, `exportDeclarationChanges` |
| `src/modules/logs/containers/logs-action-bar.tsx` | Modify — add export buttons + declaration change modal |
| `src/modules/archive-status/containers/archive-status-action-bar.tsx` | Modify — add Hamısını seç / reset-selection |
| `src/modules/telegram-bot-users/interfaces/index.ts` | Create |
| `src/modules/telegram-bot-users/services/index.ts` | Create |
| `src/modules/telegram-bot-users/context/index.ts` | Create |
| `src/modules/telegram-bot-users/hooks/telegramBotUsers/use-telegram-bot-users-table-columns.tsx` | Create |
| `src/modules/telegram-bot-users/hooks/telegramBotUsers/index.ts` | Create |
| `src/modules/telegram-bot-users/hooks/index.ts` | Create |
| `src/modules/telegram-bot-users/containers/telegram-bot-users-action-bar.tsx` | Create |
| `src/modules/telegram-bot-users/containers/telegram-bot-users-table.tsx` | Create |
| `src/modules/telegram-bot-users/containers/index.ts` | Create |
| `src/modules/telegram-bot-users/pages/index.tsx` | Create |
| `src/modules/telegram-bot-users/use-cases/table-fetch.ts` | Create |
| `src/modules/telegram-bot-users/router/page.router.tsx` | Create |
| `src/modules/telegram-bot-users/index.ts` | Create |
| `src/modules/home/router/index.tsx` | Modify — add `/telegram-bot-users/*` route |
| `src/modules/delivery-proofs/containers/delivery-proofs-action-bar.tsx` | Modify — add Telegram bot users button |

---

### Task 1: Shops — details modal

**Files:**
- Create: `src/modules/shops/pages/shop-details.tsx`
- Modify: `src/modules/shops/router/modal.router.tsx`
- Modify: `src/modules/shops/hooks/shops/use-shops-table-columns.tsx`

- [ ] **Step 1: Create the shop-details page**

Create `src/modules/shops/pages/shop-details.tsx`:

```tsx
import { FC, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Descriptions, Modal, Spin } from 'antd';
import { useQuery } from 'react-query';
import { useCountries } from '@modules/countries';
import { useBackgroundNavigate, useCloseModal } from '@shared/hooks';
import { ShopsService } from '../services';
import { useShopTypes } from '../hooks';

export const ShopDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const [closeModal] = useCloseModal();
  const navigate = useBackgroundNavigate();

  const { data: shop, isLoading } = useQuery(
    ['shops', id],
    async () => {
      const result = await ShopsService.getById(id!);
      if (result.status === 200) return result.data;
      throw new Error(result.data as string);
    },
    { enabled: !!id },
  );

  const { data: countries = [] } = useCountries();
  const { data: shopTypes = [] } = useShopTypes();

  const countryName = useMemo(
    () => countries.find((c) => c.id === shop?.countryId)?.name ?? '',
    [countries, shop?.countryId],
  );

  const categoriesTitle = useMemo(
    () => shopTypes.filter((t) => shop?.categoryIds.includes(t.id)).map((t) => t.name).join(' / '),
    [shopTypes, shop?.categoryIds],
  );

  return (
    <Modal
      open={true}
      okText="Düzəliş et"
      cancelText="Bağla"
      onOk={() => navigate(`/shops/${id}/update`, { withBackground: true })}
      onCancel={() => closeModal('/shops')}
    >
      <Spin spinning={isLoading}>
        <Descriptions bordered column={1} size="small" style={{ marginTop: 16 }}>
          <Descriptions.Item label="Kod">{shop?.id}</Descriptions.Item>
          <Descriptions.Item label="Ad">{shop?.label}</Descriptions.Item>
          <Descriptions.Item label="Ölkə">{countryName}</Descriptions.Item>
          <Descriptions.Item label="Sayt">
            <a href={shop?.url} target="_blank" rel="noreferrer">{shop?.url}</a>
          </Descriptions.Item>
          <Descriptions.Item label="Logo">
            {shop?.logo ? <a href={shop.logo} target="_blank" rel="noreferrer">Bax</a> : '—'}
          </Descriptions.Item>
          <Descriptions.Item label="Kateqoriyalar">{categoriesTitle}</Descriptions.Item>
        </Descriptions>
      </Spin>
    </Modal>
  );
};
```

- [ ] **Step 2: Add the `:id/details` route to modal router**

Current `src/modules/shops/router/modal.router.tsx`:
```tsx
import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import { CreateShop } from "../containers";

export const ShopsModalRouter: FC = () => (
  <Routes>
    <Route path="create" element={<CreateShop />} />
    <Route path=":id/update" element={<CreateShop />} />
  </Routes>
);

export default ShopsModalRouter;
```

Replace with:
```tsx
import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import { CreateShop } from "../containers";
import { ShopDetails } from "../pages/shop-details";

export const ShopsModalRouter: FC = () => (
  <Routes>
    <Route path="create" element={<CreateShop />} />
    <Route path=":id/update" element={<CreateShop />} />
    <Route path=":id/details" element={<ShopDetails />} />
  </Routes>
);

export default ShopsModalRouter;
```

- [ ] **Step 3: Add "Detay" option to shops table columns**

In `src/modules/shops/hooks/shops/use-shops-table-columns.tsx`, the `items` array in the Dropdown currently has `edit` and `delete`. Add `details` as the first item:

Find the items array:
```tsx
items: [
  { key: "edit", label: "Düzəlt", icon: <Icons.EditOutlined />, onClick: () => navigate(`/shops/${row.original.id}/update`, { withBackground: true }) },
  { key: "delete", label: "Sil", icon: <Icons.DeleteOutlined />, danger: true, onClick: () => handleDelete(row.original.id) },
],
```

Replace with:
```tsx
items: [
  { key: "details", label: "Detay", icon: <Icons.EyeOutlined />, onClick: () => navigate(`/shops/${row.original.id}/details`, { withBackground: true }) },
  { key: "edit", label: "Düzəlt", icon: <Icons.EditOutlined />, onClick: () => navigate(`/shops/${row.original.id}/update`, { withBackground: true }) },
  { key: "delete", label: "Sil", icon: <Icons.DeleteOutlined />, danger: true, onClick: () => handleDelete(row.original.id) },
],
```

- [ ] **Step 4: TypeScript check**

```bash
cd /home/fared/Desktop/EASYSOFT/delivery_management_new && npx tsc --noEmit 2>&1 | grep "modules/shops" | head -10
```

Expected: no output.

- [ ] **Step 5: Commit**

```bash
cd /home/fared/Desktop/EASYSOFT/delivery_management_new && git add src/modules/shops/pages/shop-details.tsx src/modules/shops/router/modal.router.tsx src/modules/shops/hooks/shops/use-shops-table-columns.tsx && git commit -m "feat(shops): add details modal with descriptions"
```

---

### Task 2: Logs — export actions

**Files:**
- Modify: `src/modules/logs/services/index.ts`
- Modify: `src/modules/logs/containers/logs-action-bar.tsx`

- [ ] **Step 1: Add export methods to LogsService**

In `src/modules/logs/services/index.ts`, after the `getById` method (before the closing `};`), add:

```ts
  exportAsExcel: async (query: Record<string, any> = {}): Promise<ApiResult<200, Blob> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/logs/export', query);
    try {
      const response = await caller(url);
      if (response.ok) {
        const blob = await response.blob();
        return new ApiResult(200, blob, null);
      }
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },

  exportDeclarationChanges: async (startDate: string, endDate: string): Promise<ApiResult<200, Blob> | ApiResult<400, string>> => {
    const body = new FormData();
    body.append('start_date', startDate);
    body.append('end_date', endDate);
    try {
      const response = await caller('/api/admin/changedUserExport', { method: 'POST', body });
      if (response.ok) {
        const blob = await response.blob();
        return new ApiResult(200, blob, null);
      }
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },
```

- [ ] **Step 2: Rewrite the logs action bar**

Replace the entire contents of `src/modules/logs/containers/logs-action-bar.tsx` with:

```tsx
import { useCallback, useContext, useState } from 'react';
import { DatePicker, Dropdown, Modal, Space, message } from 'antd';
import * as Icons from '@ant-design/icons';
import dayjs from 'dayjs';
import { HeadPortal } from '@modules/layout/components/head-portal';
import { StyledHeaderButton } from '@modules/layout/styled';
import { StyledActionBar } from '@shared/styled/action-bar';
import { MeContext } from '@modules/me/context/context';
import { LogsTableContext } from '../context';
import { LogsService } from '../services';

export const LogsActionBar = () => {
  const { handleFetch, handleReset, handleSelectAll, handleResetSelection, state } = useContext(LogsTableContext);
  const { can } = useContext(MeContext);

  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(null);
  const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(null);
  const [exporting, setExporting] = useState(false);

  const selectionCount = Object.keys(state.selectedRowIds).length;
  const hasFilters = state.filters.length > 0;

  const handleExportAsExcel = useCallback(async () => {
    message.loading({ key: 'logs-export', content: 'Sənəd hazırlanır...', duration: 0 });
    const query = Object.fromEntries(state.filters.map((f) => [f.id, f.value]));
    const result = await LogsService.exportAsExcel(query);
    if (result.status === 200) {
      const url = URL.createObjectURL(result.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `logs_export_${Date.now()}.xls`;
      a.click();
      message.success({ key: 'logs-export', content: 'Sənəd yüklənir' });
    } else {
      message.error({ key: 'logs-export', content: result.data as string });
    }
  }, [state.filters]);

  const handleExportDeclarationChanges = useCallback(async () => {
    setExporting(true);
    const result = await LogsService.exportDeclarationChanges(
      startDate ? startDate.format('YYYY-MM-DD') : '',
      endDate ? endDate.format('YYYY-MM-DD') : '',
    );
    setExporting(false);
    if (result.status === 200) {
      const url = URL.createObjectURL(result.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `logs_declaration_changes_${Date.now()}.xls`;
      a.click();
      setExportModalOpen(false);
      setStartDate(null);
      setEndDate(null);
      message.success('Sənəd yüklənir');
    } else {
      message.error(result.data as string);
    }
  }, [startDate, endDate]);

  return (
    <HeadPortal>
      <StyledActionBar $flex={true}>
        <Space>
          {selectionCount === 0 ? (
            <StyledHeaderButton type="text" onClick={handleSelectAll} icon={<Icons.CheckCircleOutlined />}>
              Hamısını seç
            </StyledHeaderButton>
          ) : (
            <StyledHeaderButton type="text" onClick={handleResetSelection} icon={<Icons.CloseCircleOutlined />}>
              {selectionCount} sətir
            </StyledHeaderButton>
          )}
          <StyledHeaderButton type="text" onClick={handleFetch} icon={<Icons.ReloadOutlined />}>
            Yenilə
          </StyledHeaderButton>
          <StyledHeaderButton type="text" onClick={handleReset} icon={<Icons.ClearOutlined />}>
            Sıfırla
          </StyledHeaderButton>
        </Space>
        <Space>
          {can('declaration_transfer_export') && (
            <StyledHeaderButton type="text" onClick={() => setExportModalOpen(true)} icon={<Icons.FileExcelOutlined />}>
              Bağlama düzəliş export
            </StyledHeaderButton>
          )}
          {hasFilters && (
            <Dropdown
              trigger={['click']}
              menu={{
                items: [
                  { key: 'export', label: 'Export', icon: <Icons.FileExcelOutlined />, onClick: handleExportAsExcel },
                ],
              }}
            >
              <StyledHeaderButton type="text" icon={<Icons.DownCircleOutlined />}>Digər</StyledHeaderButton>
            </Dropdown>
          )}
        </Space>
      </StyledActionBar>

      <Modal
        open={exportModalOpen}
        title="Bağlama düzəliş export"
        okText="Export"
        cancelText="Ləğv et"
        onCancel={() => { setExportModalOpen(false); setStartDate(null); setEndDate(null); }}
        onOk={handleExportDeclarationChanges}
        confirmLoading={exporting}
      >
        <Space direction="vertical" style={{ width: '100%', paddingTop: 16 }}>
          <DatePicker
            style={{ width: '100%' }}
            placeholder="Başlanğıc tarixi"
            value={startDate}
            onChange={setStartDate}
            format="DD.MM.YYYY"
          />
          <DatePicker
            style={{ width: '100%' }}
            placeholder="Bitmə tarixi"
            value={endDate}
            onChange={setEndDate}
            format="DD.MM.YYYY"
          />
        </Space>
      </Modal>
    </HeadPortal>
  );
};
```

- [ ] **Step 3: TypeScript check**

```bash
cd /home/fared/Desktop/EASYSOFT/delivery_management_new && npx tsc --noEmit 2>&1 | grep "modules/logs" | head -10
```

Expected: no output.

- [ ] **Step 4: Commit**

```bash
cd /home/fared/Desktop/EASYSOFT/delivery_management_new && git add src/modules/logs/services/index.ts src/modules/logs/containers/logs-action-bar.tsx && git commit -m "feat(logs): add excel export and declaration change export"
```

---

### Task 3: Archive-status — select-all buttons

**Files:**
- Modify: `src/modules/archive-status/containers/archive-status-action-bar.tsx`

- [ ] **Step 1: Rewrite archive-status action bar**

Replace the entire contents of `src/modules/archive-status/containers/archive-status-action-bar.tsx` with:

```tsx
import { useContext } from 'react';
import { Space } from 'antd';
import * as Icons from '@ant-design/icons';
import { HeadPortal } from '@modules/layout/components/head-portal';
import { StyledHeaderButton } from '@modules/layout/styled';
import { StyledActionBar } from '@shared/styled/action-bar';
import { ArchiveStatusTableContext } from '../context';

export const ArchiveStatusActionBar = () => {
  const { handleFetch, handleReset, handleSelectAll, handleResetSelection, state } = useContext(ArchiveStatusTableContext);
  const selectionCount = Object.keys(state.selectedRowIds).length;

  return (
    <HeadPortal>
      <StyledActionBar $flex={true}>
        <Space>
          {selectionCount === 0 ? (
            <StyledHeaderButton type="text" onClick={handleSelectAll} icon={<Icons.CheckCircleOutlined />}>
              Hamısını seç
            </StyledHeaderButton>
          ) : (
            <StyledHeaderButton type="text" onClick={handleResetSelection} icon={<Icons.CloseCircleOutlined />}>
              {selectionCount} sətir seçilib
            </StyledHeaderButton>
          )}
          <StyledHeaderButton type="text" onClick={handleFetch} icon={<Icons.ReloadOutlined />}>
            Yenilə
          </StyledHeaderButton>
          <StyledHeaderButton type="text" onClick={handleReset} icon={<Icons.ClearOutlined />}>
            Sıfırla
          </StyledHeaderButton>
        </Space>
      </StyledActionBar>
    </HeadPortal>
  );
};
```

- [ ] **Step 2: TypeScript check**

```bash
cd /home/fared/Desktop/EASYSOFT/delivery_management_new && npx tsc --noEmit 2>&1 | grep "archive-status" | head -10
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
cd /home/fared/Desktop/EASYSOFT/delivery_management_new && git add src/modules/archive-status/containers/archive-status-action-bar.tsx && git commit -m "feat(archive-status): add select-all and reset-selection buttons"
```

---

### Task 4: Telegram bot users — full module

**Files:** Create the entire module from scratch.

- [ ] **Step 1: Create interfaces**

Create `src/modules/telegram-bot-users/interfaces/index.ts`:

```ts
export type ITelegramBotUser = {
  id: number;
  telegram: {
    id: number | null;
    name: string | null;
  };
  user: {
    id: number | null;
  };
  hasAccess: boolean;
  createdAt: string;
  updatedAt: string;
};
```

- [ ] **Step 2: Create service**

Create `src/modules/telegram-bot-users/services/index.ts`:

```ts
import { ApiResult, caller, urlMaker } from '@shared/utils';
import { ITelegramBotUser } from '../interfaces';

type ListResponse = { data: ITelegramBotUser[]; total: number };

const toDomain = (p: any): ITelegramBotUser => ({
  id: p.id,
  telegram: { id: p.telegram_id ?? null, name: p.telegram_name ?? null },
  user: { id: p.user_id ?? null },
  hasAccess: !!p.has_access,
  createdAt: p.created_at,
  updatedAt: p.updated_at,
});

export const TelegramBotUsersService = {
  getList: async (query: Record<string, any> = {}): Promise<ApiResult<200, ListResponse> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/telegram-users', { page: 1, per_page: 20, ...query });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        const data = (result.data || []).map(toDomain);
        return new ApiResult(200, { data, total: result.total ?? data.length }, null);
      }
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },

  grant: async (dto: { id: number; user_id: number; has_access: '1' | '0' }): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
    const body = new FormData();
    body.append('id', String(dto.id));
    body.append('user_id', String(dto.user_id));
    body.append('has_access', dto.has_access);
    try {
      const response = await caller('/api/admin/telegram-users/grant', { method: 'POST', body });
      if (response.ok) return new ApiResult(200, null, null);
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },
};
```

- [ ] **Step 3: Create context**

Create `src/modules/telegram-bot-users/context/index.ts`:

```ts
import { createNextTableContext } from '@shared/modules/next-table/context/context';

export const TelegramBotUsersTableContext = createNextTableContext();
```

- [ ] **Step 4: Create table fetch use-case**

Create `src/modules/telegram-bot-users/use-cases/table-fetch.ts`:

```ts
import { Dispatch } from 'react';
import {
  nextTableFetchDataFailedAction,
  nextTableFetchDataStartedAction,
  nextTableFetchDataSucceedAction,
} from '@shared/modules/next-table/context/actions';
import { NextTableActions } from '@shared/modules/next-table/context/action-types';
import { NextTableFetchParams } from '@shared/modules/next-table/types';
import { tableQueryMaker } from '@shared/modules/next-table/utils';
import { TelegramBotUsersService } from '../services';

export const telegramBotUsersTableFetchUseCase = (params: NextTableFetchParams) => async (dispatch: Dispatch<NextTableActions>) => {
  dispatch(nextTableFetchDataStartedAction());
  const result = await TelegramBotUsersService.getList(tableQueryMaker(params));
  if (result.status === 200) {
    dispatch(nextTableFetchDataSucceedAction({ data: result.data.data, total: result.data.total }));
  } else {
    dispatch(nextTableFetchDataFailedAction('Xəta baş verdi.'));
  }
};
```

- [ ] **Step 5: Create table columns hook**

Create `src/modules/telegram-bot-users/hooks/telegramBotUsers/use-telegram-bot-users-table-columns.tsx`:

```tsx
import { useCallback, useContext, useMemo } from 'react';
import { Column } from 'react-table';
import { Dropdown, InputNumber, Modal, Switch, Tag, message } from 'antd';
import * as Icons from '@ant-design/icons';
import { nextTableColumns } from '@shared/modules/next-table/helpers/next-table-columns';
import { ITelegramBotUser } from '../../interfaces';
import { TelegramBotUsersService } from '../../services';
import { TelegramBotUsersTableContext } from '../../context';

export const useTelegramBotUsersTableColumns = (): Column<ITelegramBotUser>[] => {
  const { handleFetch } = useContext(TelegramBotUsersTableContext);

  const handleGrant = useCallback((original: ITelegramBotUser) => {
    let inputValue: number | null = original.user.id;
    let hasAccess = original.hasAccess;

    Modal.confirm({
      title: `İstifadəçi${original.hasAccess ? 'ni' : 'yə'} ${original.hasAccess ? 'bloklamağa' : 'icazə verməyə'} əminsinizmi?`,
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 8 }}>
          <InputNumber
            defaultValue={original.user.id ?? undefined}
            style={{ width: '100%' }}
            placeholder="Müştəri kodu daxil edin"
            onChange={(value) => { inputValue = value as number | null; }}
          />
          <Switch
            onChange={(value) => { hasAccess = value; }}
            checkedChildren="İcazə verilsin"
            unCheckedChildren="İcazə verilməsin"
            defaultChecked={hasAccess}
          />
        </div>
      ),
      onOk: async () => {
        const result = await TelegramBotUsersService.grant({
          id: original.id,
          user_id: inputValue ?? 0,
          has_access: hasAccess ? '1' : '0',
        });
        if (result.status === 200) {
          message.success('Əməliyyat uğurla tamamlandı.');
          handleFetch();
        } else {
          message.error(result.data as string);
        }
      },
    });
  }, [handleFetch]);

  return useMemo<Column<ITelegramBotUser>[]>(
    () => [
      { ...nextTableColumns.actions, id: 'actions', Header: '',
        Cell: ({ row }: any) => (
          <Dropdown
            menu={{
              items: [
                { key: 'grant', label: 'Düzəliş etmək', icon: <Icons.EditOutlined />, onClick: () => handleGrant(row.original) },
              ],
            }}
          >
            <Icons.MoreOutlined />
          </Dropdown>
        ),
      },
      { ...nextTableColumns.small, id: 'id', Header: 'Kod', accessor: (r) => r.id },
      { id: 'telegram_name', Header: 'Telegram adı', accessor: (r) => r.telegram.name },
      { id: 'telegram_id', Header: 'Telegram kodu', accessor: (r) => r.telegram.id },
      { id: 'user_id', Header: 'İstifadəçi kodu', accessor: (r) => r.user.id },
      {
        id: 'has_access', Header: 'İcazə',
        accessor: (r) => r.hasAccess,
        Cell: ({ row }: any) => (
          <Tag color={row.original.hasAccess ? 'green' : 'red'}>
            {row.original.hasAccess ? 'İcazəli' : 'İcazəsiz'}
          </Tag>
        ),
      },
      { ...nextTableColumns.date, id: 'created_at', Header: 'Yaradılıb', accessor: (r) => r.createdAt },
    ],
    [handleGrant],
  );
};
```

- [ ] **Step 6: Create hooks barrel files**

Create `src/modules/telegram-bot-users/hooks/telegramBotUsers/index.ts`:

```ts
export * from './use-telegram-bot-users-table-columns';
```

Create `src/modules/telegram-bot-users/hooks/index.ts`:

```ts
export * from './telegramBotUsers';
```

- [ ] **Step 7: Create containers**

Create `src/modules/telegram-bot-users/containers/telegram-bot-users-table.tsx`:

```tsx
import { FC } from 'react';
import { NextTable } from '@shared/modules/next-table/containers';
import { TelegramBotUsersTableContext } from '../context';
import { useTelegramBotUsersTableColumns } from '../hooks';

export const TelegramBotUsersTable: FC = () => {
  const columns = useTelegramBotUsersTableColumns();
  return <NextTable context={TelegramBotUsersTableContext} columns={columns} />;
};
```

Create `src/modules/telegram-bot-users/containers/telegram-bot-users-action-bar.tsx`:

```tsx
import { useContext, useMemo } from 'react';
import { Popover, Space, Typography } from 'antd';
import * as Icons from '@ant-design/icons';
import { HeadPortal } from '@modules/layout/components/head-portal';
import { StyledHeaderButton } from '@modules/layout/styled';
import { StyledActionBar } from '@shared/styled/action-bar';
import { MeContext } from '@modules/me/context/context';
import { TelegramBotUsersTableContext } from '../context';

export const TelegramBotUsersActionBar = () => {
  const { handleFetch, handleReset } = useContext(TelegramBotUsersTableContext);
  const { can } = useContext(MeContext);

  const popoverContent = useMemo(
    () => (
      <Space direction="vertical">
        <Typography.Text>Telegram bota bu linkdən rahatlıqla keçə bilərsiniz:</Typography.Text>
        <Typography.Link href="https://t.me/findex_delivery_bot" target="_blank">
          @findex_delivery_bot
        </Typography.Link>
        <Typography.Text>Açılan Telegram pəncərəsində "Başla" düyməsinə tıklayaraq botla əlaqə qurun.</Typography.Text>
      </Space>
    ),
    [],
  );

  return (
    <HeadPortal>
      <StyledActionBar $flex={true}>
        <Space>
          <StyledHeaderButton type="text" onClick={handleFetch} icon={<Icons.ReloadOutlined />}>
            Yenilə
          </StyledHeaderButton>
          <StyledHeaderButton type="text" onClick={handleReset} icon={<Icons.ClearOutlined />}>
            Sıfırla
          </StyledHeaderButton>
          {can('telegram_grant') && (
            <Popover placement="bottom" content={popoverContent}>
              <StyledHeaderButton type="text" icon={<Icons.InfoCircleOutlined />} />
            </Popover>
          )}
        </Space>
      </StyledActionBar>
    </HeadPortal>
  );
};
```

Create `src/modules/telegram-bot-users/containers/index.ts`:

```ts
export * from './telegram-bot-users-table';
export * from './telegram-bot-users-action-bar';
```

- [ ] **Step 8: Create the page**

Create `src/modules/telegram-bot-users/pages/index.tsx`:

```tsx
import { FC } from 'react';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { PageContent } from '@shared/styled/page-content';
import { TelegramBotUsersTableContext } from '../context';
import { telegramBotUsersTableFetchUseCase } from '../use-cases/table-fetch';
import { TelegramBotUsersActionBar, TelegramBotUsersTable } from '../containers';

export const TelegramBotUsersPage: FC = () => (
  <PageContent $contain={true}>
    <NextTableProvider context={TelegramBotUsersTableContext} onFetch={telegramBotUsersTableFetchUseCase} name="telegram-bot-users-table">
      <TelegramBotUsersActionBar />
      <TelegramBotUsersTable />
    </NextTableProvider>
  </PageContent>
);
```

- [ ] **Step 9: Create router**

Create `src/modules/telegram-bot-users/router/page.router.tsx`:

```tsx
import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import { TelegramBotUsersPage } from '../pages';

export const TelegramBotUsersRouter: FC = () => (
  <Routes>
    <Route index element={<TelegramBotUsersPage />} />
  </Routes>
);

export default TelegramBotUsersRouter;
```

- [ ] **Step 10: Create module index**

Create `src/modules/telegram-bot-users/index.ts`:

```ts
export * from './pages';
export * from './hooks';
```

Create `src/modules/telegram-bot-users/pages/index.ts` (if needed as barrel):

Wait — the page component is in `src/modules/telegram-bot-users/pages/index.tsx` itself (named export `TelegramBotUsersPage`). The module `index.ts` re-exports from `'./pages'` which resolves to that file directly. No separate barrel needed.

Actually revise — the pages file is already `pages/index.tsx` so `export * from './pages'` in module index.ts will work correctly. ✓

- [ ] **Step 11: TypeScript check on the module**

```bash
cd /home/fared/Desktop/EASYSOFT/delivery_management_new && npx tsc --noEmit 2>&1 | grep "telegram-bot" | head -10
```

Expected: no output.

- [ ] **Step 12: Commit**

```bash
cd /home/fared/Desktop/EASYSOFT/delivery_management_new && git add src/modules/telegram-bot-users/ && git commit -m "feat(telegram-bot-users): add full module with table, grant action, and info popover"
```

---

### Task 5: Wire telegram-bot-users into routing + delivery-proofs button

**Files:**
- Modify: `src/modules/home/router/index.tsx`
- Modify: `src/modules/delivery-proofs/containers/delivery-proofs-action-bar.tsx`

- [ ] **Step 1: Add route to home router**

In `src/modules/home/router/index.tsx`, after the existing `PartnerStatisticsRouter` lazy import, add:

```tsx
const TelegramBotUsersRouter = lazy(() => import('../../telegram-bot-users/router/page.router'));
```

Then in the `<Routes>` block, after `/statistics/branches-partner/*`, add:

```tsx
<Route path='/telegram-bot-users/*' element={<TelegramBotUsersRouter />} />
```

- [ ] **Step 2: Add navigation button to delivery-proofs action bar**

Replace the entire contents of `src/modules/delivery-proofs/containers/delivery-proofs-action-bar.tsx` with:

```tsx
import { useContext } from 'react';
import { Space } from 'antd';
import * as Icons from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { HeadPortal } from '@modules/layout/components/head-portal';
import { StyledHeaderButton } from '@modules/layout/styled';
import { StyledActionBar } from '@shared/styled/action-bar';
import { DeliveryProofsTableContext } from '../context';

export const DeliveryProofsActionBar = () => {
  const { handleFetch, handleReset } = useContext(DeliveryProofsTableContext);
  const navigate = useNavigate();

  return (
    <HeadPortal>
      <StyledActionBar $flex={true}>
        <Space>
          <StyledHeaderButton type="text" onClick={handleFetch} icon={<Icons.ReloadOutlined />}>
            Yenilə
          </StyledHeaderButton>
          <StyledHeaderButton type="text" onClick={handleReset} icon={<Icons.ClearOutlined />}>
            Sıfırla
          </StyledHeaderButton>
          <StyledHeaderButton type="text" onClick={() => navigate('/telegram-bot-users')} icon={<Icons.RobotOutlined />}>
            Telegram bot istifadəçiləri
          </StyledHeaderButton>
        </Space>
      </StyledActionBar>
    </HeadPortal>
  );
};
```

- [ ] **Step 3: Full TypeScript check**

```bash
cd /home/fared/Desktop/EASYSOFT/delivery_management_new && npx tsc --noEmit 2>&1 | grep "src/" | head -20
```

Expected: no output (zero errors in src/).

- [ ] **Step 4: Commit**

```bash
cd /home/fared/Desktop/EASYSOFT/delivery_management_new && git add src/modules/home/router/index.tsx src/modules/delivery-proofs/containers/delivery-proofs-action-bar.tsx && git commit -m "feat(delivery-proofs): add telegram bot users navigation button and wire route"
```
