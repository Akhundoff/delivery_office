# Group 1: Missing Flows Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add six missing flows across customs, declarations, flights, and users modules: customs tasks page, unknown declarations page, partner declarations page, handover modals, close-flight modal, and user permissions modal.

**Architecture:** Each feature follows the warehouse pattern — static-method services with `ApiResult`, `createNextTableContext()` per table, use-case functions for fetching, hook subfolders (camelCase), containers, and pages with `NextTableProvider`. Modal routes live in each module's `modal.router.tsx`.

**Tech Stack:** React 18, TypeScript, Ant Design v5, react-query (for one-off fetches), Next-Table (paginated tables), React Router v6, Formik where needed.

---

## File Map

**Customs:**
- Create: `src/modules/customs/interfaces/customs-task.interface.ts`
- Modify: `src/modules/customs/services/index.ts`
- Modify: `src/modules/customs/context/index.ts`
- Create: `src/modules/customs/use-cases/customs-tasks-table-fetch.ts`
- Create: `src/modules/customs/hooks/customsTasks/use-customs-tasks-table-columns.tsx`
- Create: `src/modules/customs/hooks/customsTasks/use-customs-tasks-table.ts`
- Create: `src/modules/customs/hooks/customsTasks/index.ts`
- Modify: `src/modules/customs/hooks/index.ts`
- Create: `src/modules/customs/containers/customs-tasks-action-bar.tsx`
- Create: `src/modules/customs/containers/customs-tasks-table.tsx`
- Create: `src/modules/customs/containers/customs-task-detail.tsx`
- Modify: `src/modules/customs/containers/index.ts`
- Create: `src/modules/customs/pages/customs-tasks.tsx`
- Modify: `src/modules/customs/pages/index.ts`
- Modify: `src/modules/customs/router/page.router.tsx`
- Modify: `src/modules/customs/router/modal.router.tsx`

**Declarations:**
- Modify: `src/modules/declarations/services/index.ts`
- Modify: `src/modules/declarations/context/index.ts`
- Create: `src/modules/declarations/use-cases/unknown-declarations-table-fetch.ts`
- Create: `src/modules/declarations/use-cases/partner-declarations-table-fetch.ts`
- Create: `src/modules/declarations/interfaces/unknown-declaration.interface.ts`
- Create: `src/modules/declarations/interfaces/partner-declaration.interface.ts`
- Modify: `src/modules/declarations/interfaces/index.ts`
- Create: `src/modules/declarations/hooks/unknownDeclarations/use-unknown-declarations-table-columns.tsx`
- Create: `src/modules/declarations/hooks/unknownDeclarations/use-unknown-declarations-table.ts`
- Create: `src/modules/declarations/hooks/unknownDeclarations/index.ts`
- Create: `src/modules/declarations/hooks/partnerDeclarations/use-partner-declarations-table-columns.tsx`
- Create: `src/modules/declarations/hooks/partnerDeclarations/use-partner-declarations-table.ts`
- Create: `src/modules/declarations/hooks/partnerDeclarations/index.ts`
- Modify: `src/modules/declarations/hooks/index.ts`
- Create: `src/modules/declarations/containers/unknown-declarations-table.tsx`
- Create: `src/modules/declarations/containers/unknown-declarations-action-bar.tsx`
- Create: `src/modules/declarations/containers/unknown-declaration-detail.tsx`
- Create: `src/modules/declarations/containers/partner-declarations-table.tsx`
- Create: `src/modules/declarations/containers/partner-declarations-action-bar.tsx`
- Create: `src/modules/declarations/containers/pay-declaration-modal.tsx`
- Create: `src/modules/declarations/containers/bulk-handover-modal.tsx`
- Modify: `src/modules/declarations/containers/index.ts`
- Create: `src/modules/declarations/pages/unknown-declarations.tsx`
- Create: `src/modules/declarations/pages/partner-declarations.tsx`
- Modify: `src/modules/declarations/pages/index.ts`
- Modify: `src/modules/declarations/router/page.router.tsx`
- Modify: `src/modules/declarations/router/modal.router.tsx`
- Modify: `src/modules/declarations/containers/declarations-action-bar.tsx`

**Flights:**
- Modify: `src/modules/flights/interfaces/flight.interface.ts`
- Modify: `src/modules/flights/mappers/index.ts`
- Create: `src/modules/flights/containers/close-flight-modal.tsx`
- Modify: `src/modules/flights/containers/flight-details.tsx`
- Modify: `src/modules/flights/router/modal.router.tsx`

**Users:**
- Modify: `src/modules/users/services/index.ts`
- Create: `src/modules/users/interfaces/user-permissions.interface.ts`
- Modify: `src/modules/users/interfaces/index.ts`
- Create: `src/modules/users/hooks/userPermissions/use-user-permissions.ts`
- Create: `src/modules/users/hooks/userPermissions/index.ts`
- Modify: `src/modules/users/hooks/index.ts`
- Create: `src/modules/users/containers/update-user-permissions-modal.tsx`
- Modify: `src/modules/users/containers/index.ts`
- Modify: `src/modules/users/hooks/users/use-users-table-columns.tsx`
- Modify: `src/modules/users/router/modal.router.tsx`

---

## Task 1: Customs Tasks — Interface, Service, Context, Use-Case

**Files:**
- Create: `src/modules/customs/interfaces/customs-task.interface.ts`
- Modify: `src/modules/customs/services/index.ts`
- Modify: `src/modules/customs/context/index.ts`
- Create: `src/modules/customs/use-cases/customs-tasks-table-fetch.ts`

- [ ] **Step 1: Create customs task interface**

`src/modules/customs/interfaces/customs-task.interface.ts`:
```ts
export type ICustomsTask = {
  id: number;
  action: string;
  status: { id: number; name: string };
  createdAt: string;
  branch: { id: number; name: string };
  declaration: {
    id: number;
    trackCode: number;
    globalTrackCode: string;
    weight: number | null;
    quantity: number;
    user: { id: number; name: string };
    status: { id: number; name: string };
    productType: { id: number; name: string };
    country: { id: number; name: string } | null;
    updatedBy: { id: number; name: string } | null;
  };
};

export type ICustomsTaskPersistence = {
  id: number;
  action: string;
  user_id: number;
  user_name: string;
  branch_id: number;
  branch_name: string;
  country_id: number;
  country_name: string;
  track_code: number;
  global_track_code: string;
  state_id: number;
  state_name: string;
  declaration_id: number;
  declaration_state_id: number;
  declaration_state_name: string;
  weight: string | null;
  quantity: number;
  product_type_id: number;
  product_type_name: string;
  changer_id: number | null;
  changer_name: string | null;
  created_at: string;
};
```

- [ ] **Step 2: Add CustomsTasksService to the service file**

At the top of `src/modules/customs/services/index.ts` add this import alongside existing imports:
```ts
import { IDnsQueue, ICustomsDeclaration, ICustomsDeclarationPersistence, ICustomsPost, ICustomsPostPersistence, ICustomsTask, ICustomsTaskPersistence } from '../interfaces';
```

Add this mapper function before the existing `toDomain` function (for DnsQueues):
```ts
const customsTaskToDomain = (p: ICustomsTaskPersistence): ICustomsTask => ({
  id: p.id,
  action: p.action,
  status: { id: p.state_id, name: p.state_name },
  createdAt: p.created_at,
  branch: { id: p.branch_id, name: p.branch_name },
  declaration: {
    id: p.declaration_id,
    trackCode: p.track_code,
    globalTrackCode: p.global_track_code,
    weight: p.weight ? parseFloat(p.weight) : null,
    quantity: p.quantity,
    user: { id: p.user_id, name: p.user_name },
    status: { id: p.declaration_state_id, name: p.declaration_state_name },
    productType: { id: p.product_type_id, name: p.product_type_name },
    country: p.country_id ? { id: p.country_id, name: p.country_name } : null,
    updatedBy: p.changer_id && p.changer_name ? { id: p.changer_id, name: p.changer_name } : null,
  },
});
```

Append this service object at the bottom of `src/modules/customs/services/index.ts`:
```ts
export const CustomsTasksService = {
  getList: async (query: Record<string, any> = {}): Promise<ApiResult<200, { data: ICustomsTask[]; total: number }> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/customs_tasks', { page: 1, per_page: 20, ...query });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        const data = (result.data || []).map(customsTaskToDomain);
        return new ApiResult(200, { data, total: result.total ?? data.length }, null);
      }
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },

  getById: async (id: string | number): Promise<ApiResult<200, ICustomsTask> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/customs_tasks/info', { customs_task_id: id });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        return new ApiResult(200, customsTaskToDomain(result.data as ICustomsTaskPersistence), null);
      }
      return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },
};
```

- [ ] **Step 3: Add CustomsTasksTableContext to context**

Replace the entire content of `src/modules/customs/context/index.ts` with:
```ts
import { createNextTableContext } from '@shared/modules/next-table/context/context';

export const DnsQueuesTableContext = createNextTableContext();
export const CustomsDeclarationsTableContext = createNextTableContext();
export const CustomsPostsTableContext = createNextTableContext();
export const CustomsTasksTableContext = createNextTableContext();
```

- [ ] **Step 4: Create customs tasks table fetch use-case**

`src/modules/customs/use-cases/customs-tasks-table-fetch.ts`:
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
import { CustomsTasksService } from '../services';

export const customsTasksTableFetchUseCase = (params: NextTableFetchParams) => async (dispatch: Dispatch<NextTableActions>) => {
  dispatch(nextTableFetchDataStartedAction());
  const result = await CustomsTasksService.getList(tableQueryMaker(params));
  if (result.status === 200) {
    dispatch(nextTableFetchDataSucceedAction({ data: result.data.data, total: result.data.total }));
  } else {
    dispatch(nextTableFetchDataFailedAction('Xəta baş verdi.'));
  }
};
```

- [ ] **Step 5: Verify build**

```bash
cd /home/fared/Desktop/EASYSOFT/delivery_management_new && npx tsc --noEmit 2>&1 | head -30
```
Expected: no errors related to customs tasks interface or service.

- [ ] **Step 6: Commit**

```bash
git add src/modules/customs/interfaces/customs-task.interface.ts src/modules/customs/services/index.ts src/modules/customs/context/index.ts src/modules/customs/use-cases/customs-tasks-table-fetch.ts
git commit -m "feat(customs): add customs tasks service, context, use-case"
```

---

## Task 2: Customs Tasks — Hooks, Containers, Page, Router

**Files:**
- Create: `src/modules/customs/hooks/customsTasks/use-customs-tasks-table-columns.tsx`
- Create: `src/modules/customs/hooks/customsTasks/use-customs-tasks-table.ts`
- Create: `src/modules/customs/hooks/customsTasks/index.ts`
- Modify: `src/modules/customs/hooks/index.ts`
- Create: `src/modules/customs/containers/customs-tasks-action-bar.tsx`
- Create: `src/modules/customs/containers/customs-tasks-table.tsx`
- Create: `src/modules/customs/containers/customs-task-detail.tsx`
- Modify: `src/modules/customs/containers/index.ts`
- Create: `src/modules/customs/pages/customs-tasks.tsx`
- Modify: `src/modules/customs/router/page.router.tsx`
- Modify: `src/modules/customs/router/modal.router.tsx`

- [ ] **Step 1: Create table columns hook**

`src/modules/customs/hooks/customsTasks/use-customs-tasks-table-columns.tsx`:
```tsx
import { useMemo } from 'react';
import { Column } from 'react-table';
import { Button } from 'antd';
import * as Icons from '@ant-design/icons';
import { nextTableColumns } from '@shared/modules/next-table/helpers/next-table-columns';
import { StopPropagation } from '@shared/components/stop-propagation';
import { useBackgroundNavigate } from '@shared/hooks';
import { ICustomsTask } from '../../interfaces';

export const useCustomsTasksTableColumns = (): Column<ICustomsTask>[] => {
  const navigate = useBackgroundNavigate();

  return useMemo<Column<ICustomsTask>[]>(
    () => [
      {
        ...nextTableColumns.actions,
        Cell: ({ row: { original } }: any) => (
          <StopPropagation>
            <Button
              icon={<Icons.FileSearchOutlined />}
              size='small'
              onClick={() => navigate(`/customs/tasks/${original.id}`, { withBackground: true })}
            />
          </StopPropagation>
        ),
      },
      { ...nextTableColumns.small, Header: 'Kod', id: 'id', accessor: (r) => r.id },
      { accessor: (r) => r.action, id: 'action', Header: 'Əməliyyat' },
      { accessor: (r) => r.declaration.globalTrackCode, id: 'global_track_code', Header: 'İzləmə kodu' },
      { accessor: (r) => r.declaration.user.name, id: 'user_name', Header: 'İstifadəçi' },
      { accessor: (r) => r.branch.name, id: 'branch_name', Header: 'Filial' },
      { accessor: (r) => r.status.name, id: 'state_name', Header: 'Status' },
      { ...nextTableColumns.date, accessor: (r) => r.createdAt, id: 'created_at', Header: 'Yaradılma tarixi' },
    ],
    [navigate],
  );
};
```

- [ ] **Step 2: Create table hook**

`src/modules/customs/hooks/customsTasks/use-customs-tasks-table.ts`:
```ts
import { useCustomsTasksTableColumns } from './use-customs-tasks-table-columns';

export const useCustomsTasksTable = () => {
  const columns = useCustomsTasksTableColumns();
  return { columns };
};
```

- [ ] **Step 3: Create subfolder barrel**

`src/modules/customs/hooks/customsTasks/index.ts`:
```ts
export { useCustomsTasksTable } from './use-customs-tasks-table';
export { useCustomsTasksTableColumns } from './use-customs-tasks-table-columns';
```

- [ ] **Step 4: Add to hooks barrel**

Append to `src/modules/customs/hooks/index.ts`:
```ts
export * from './customsTasks';
```

- [ ] **Step 5: Create action bar container**

`src/modules/customs/containers/customs-tasks-action-bar.tsx`:
```tsx
import { useContext } from 'react';
import { Space } from 'antd';
import * as Icons from '@ant-design/icons';
import { HeadPortal } from '@modules/layout/components/head-portal';
import { StyledHeaderButton } from '@modules/layout/styled';
import { StyledActionBar } from '@shared/styled/action-bar';
import { CustomsTasksTableContext } from '../context';

export const CustomsTasksActionBar = () => {
  const { handleFetch, handleReset } = useContext(CustomsTasksTableContext);

  return (
    <HeadPortal>
      <StyledActionBar $flex={true}>
        <Space>
          <StyledHeaderButton type='text' onClick={handleFetch} icon={<Icons.ReloadOutlined />}>
            Yenilə
          </StyledHeaderButton>
          <StyledHeaderButton type='text' onClick={handleReset} icon={<Icons.ClearOutlined />}>
            Sıfırla
          </StyledHeaderButton>
        </Space>
      </StyledActionBar>
    </HeadPortal>
  );
};
```

- [ ] **Step 6: Create table container**

`src/modules/customs/containers/customs-tasks-table.tsx`:
```tsx
import { FC } from 'react';
import { NextTable } from '@shared/modules/next-table/containers';
import { CustomsTasksTableContext } from '../context';
import { useCustomsTasksTable } from '../hooks';

export const CustomsTasksTable: FC = () => {
  const { columns } = useCustomsTasksTable();
  return <NextTable context={CustomsTasksTableContext} columns={columns} />;
};
```

- [ ] **Step 7: Create task detail modal container**

`src/modules/customs/containers/customs-task-detail.tsx`:
```tsx
import { FC } from 'react';
import { Modal, Descriptions, Spin, Result } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { CustomsTasksService } from '../services';

export const CustomsTaskDetail: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const close = () => navigate(-1);

  const { data, isLoading, isError } = useQuery(
    ['customs-task', id],
    async () => {
      const result = await CustomsTasksService.getById(id!);
      if (result.status === 200) return result.data;
      throw new Error(result.data as string);
    },
    { enabled: !!id },
  );

  return (
    <Modal open={true} onCancel={close} footer={null} width={640} title={`Tapşırıq #${id}`}>
      {isLoading && <Spin />}
      {isError && <Result status='error' title='Xəta baş verdi' />}
      {data && (
        <Descriptions bordered column={1} size='small'>
          <Descriptions.Item label='Kod'>{data.id}</Descriptions.Item>
          <Descriptions.Item label='Əməliyyat'>{data.action}</Descriptions.Item>
          <Descriptions.Item label='Status'>{data.status.name}</Descriptions.Item>
          <Descriptions.Item label='Filial'>{data.branch.name}</Descriptions.Item>
          <Descriptions.Item label='İstifadəçi'>{data.declaration.user.name}</Descriptions.Item>
          <Descriptions.Item label='İzləmə kodu'>{data.declaration.globalTrackCode}</Descriptions.Item>
          <Descriptions.Item label='Bəyannamə statusu'>{data.declaration.status.name}</Descriptions.Item>
          <Descriptions.Item label='Məhsul növü'>{data.declaration.productType.name}</Descriptions.Item>
          <Descriptions.Item label='Çəki'>{data.declaration.weight ?? '—'} kg</Descriptions.Item>
          <Descriptions.Item label='Miqdar'>{data.declaration.quantity}</Descriptions.Item>
          {data.declaration.updatedBy && (
            <Descriptions.Item label='Dəyişdirən'>{data.declaration.updatedBy.name}</Descriptions.Item>
          )}
          <Descriptions.Item label='Yaradılma tarixi'>{data.createdAt}</Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
};
```

- [ ] **Step 8: Add to containers barrel**

Append to `src/modules/customs/containers/index.ts`:
```ts
export { CustomsTasksTable } from './customs-tasks-table';
export { CustomsTasksActionBar } from './customs-tasks-action-bar';
export { CustomsTaskDetail } from './customs-task-detail';
```

- [ ] **Step 9: Create page**

`src/modules/customs/pages/customs-tasks.tsx`:
```tsx
import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { PageContent } from '@shared/styled/page-content';
import { CustomsTasksTableContext } from '../context';
import { customsTasksTableFetchUseCase } from '../use-cases/customs-tasks-table-fetch';
import { CustomsTasksTable, CustomsTasksActionBar } from '../containers';

export const CustomsTasksPage: FC = () => {
  return (
    <PageContent $contain={true}>
      <NextTableProvider context={CustomsTasksTableContext} onFetch={customsTasksTableFetchUseCase} name='customs-tasks-table'>
        <CustomsTasksActionBar />
        <CustomsTasksTable />
      </NextTableProvider>
      <Outlet />
    </PageContent>
  );
};
```

- [ ] **Step 10: Update page router**

Replace the full content of `src/modules/customs/router/page.router.tsx`:
```tsx
import React, { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import { DnsQueuesPage } from '../pages';

const CustomsDeclarationsPage = React.lazy(() => import('../pages/customs-declarations').then((m) => ({ default: m.CustomsDeclarationsPage })));
const CustomsPostsPage = React.lazy(() => import('../pages/customs-posts').then((m) => ({ default: m.CustomsPostsPage })));
const CustomsTasksPage = React.lazy(() => import('../pages/customs-tasks').then((m) => ({ default: m.CustomsTasksPage })));

export const CustomsRouter: FC = () => (
  <Routes>
    <Route path='dns-queues' element={<DnsQueuesPage />} />
    <Route
      path='declarations'
      element={
        <React.Suspense fallback={null}>
          <CustomsDeclarationsPage />
        </React.Suspense>
      }
    />
    <Route
      path='posts'
      element={
        <React.Suspense fallback={null}>
          <CustomsPostsPage />
        </React.Suspense>
      }
    />
    <Route
      path='tasks/*'
      element={
        <React.Suspense fallback={null}>
          <CustomsTasksPage />
        </React.Suspense>
      }
    />
  </Routes>
);

export default CustomsRouter;
```

- [ ] **Step 11: Update modal router**

Replace the full content of `src/modules/customs/router/modal.router.tsx`:
```tsx
import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import { DnsQueuesQueryPreview } from '../containers/dns-queues-query-preview';
import { DnsQueuesResponsePreview } from '../containers/dns-queues-response-preview';
import { CustomsTaskDetail } from '../containers/customs-task-detail';

export const CustomsModalRouter: FC = () => (
  <Routes>
    <Route path='dns-queues/preview/query' element={<DnsQueuesQueryPreview />} />
    <Route path='dns-queues/preview/response' element={<DnsQueuesResponsePreview />} />
    <Route path='tasks/:id' element={<CustomsTaskDetail />} />
  </Routes>
);

export default CustomsModalRouter;
```

- [ ] **Step 12: Add sidebar link for customs tasks**

Open `src/modules/layout/containers/sidebar.tsx`. Find the customs section (search for `/customs/`). Add a menu item for tasks alongside existing customs items. The exact JSX depends on existing sidebar structure — find the group of customs items and add:
```tsx
<Menu.Item key='/customs/tasks' icon={<Icons.AuditOutlined />}>
  <NavLink to='/customs/tasks'>Gömrük tapşırıqları</NavLink>
</Menu.Item>
```

- [ ] **Step 13: Verify build**

```bash
cd /home/fared/Desktop/EASYSOFT/delivery_management_new && npx tsc --noEmit 2>&1 | head -30
```
Expected: no new TypeScript errors.

- [ ] **Step 14: Commit**

```bash
git add src/modules/customs/
git commit -m "feat(customs): add customs tasks page with list and detail modal"
```

---

## Task 3: Declarations — Unknown Declarations Page

**Files:**
- Create: `src/modules/declarations/interfaces/unknown-declaration.interface.ts`
- Modify: `src/modules/declarations/interfaces/index.ts`
- Modify: `src/modules/declarations/services/index.ts`
- Modify: `src/modules/declarations/context/index.ts`
- Create: `src/modules/declarations/use-cases/unknown-declarations-table-fetch.ts`
- Create: `src/modules/declarations/hooks/unknownDeclarations/use-unknown-declarations-table-columns.tsx`
- Create: `src/modules/declarations/hooks/unknownDeclarations/use-unknown-declarations-table.ts`
- Create: `src/modules/declarations/hooks/unknownDeclarations/index.ts`
- Modify: `src/modules/declarations/hooks/index.ts`
- Create: `src/modules/declarations/containers/unknown-declarations-table.tsx`
- Create: `src/modules/declarations/containers/unknown-declarations-action-bar.tsx`
- Create: `src/modules/declarations/containers/unknown-declaration-detail.tsx`
- Modify: `src/modules/declarations/containers/index.ts`
- Create: `src/modules/declarations/pages/unknown-declarations.tsx`
- Modify: `src/modules/declarations/router/page.router.tsx`
- Modify: `src/modules/declarations/router/modal.router.tsx`

- [ ] **Step 1: Create unknown declaration interface**

`src/modules/declarations/interfaces/unknown-declaration.interface.ts`:
```ts
export type IUnknownDeclaration = {
  id: number;
  globalTrackCode: string;
  trackCode: string;
  status: { id: number; name: string };
  user: { id: number; name: string } | null;
  weight: number | null;
  price: number | null;
  createdAt: string;
};

export type IUnknownDeclarationPersistence = {
  id: number;
  global_track_code: string;
  track_code: string;
  state_id: number;
  state_name: string;
  user_id: number | null;
  user_name: string | null;
  weight: string | null;
  price: string | null;
  created_at: string;
};
```

- [ ] **Step 2: Add to interfaces barrel**

Append to `src/modules/declarations/interfaces/index.ts`:
```ts
export * from './unknown-declaration.interface';
```

- [ ] **Step 3: Add unknown declarations service methods**

Add this mapper function near the top of `src/modules/declarations/services/index.ts`, after the existing `declarationPostToDomain` function:
```ts
const unknownDeclarationToDomain = (p: IUnknownDeclarationPersistence): IUnknownDeclaration => ({
  id: p.id,
  globalTrackCode: p.global_track_code,
  trackCode: p.track_code,
  status: { id: p.state_id, name: p.state_name },
  user: p.user_id ? { id: p.user_id, name: p.user_name ?? '' } : null,
  weight: p.weight ? parseFloat(p.weight) : null,
  price: p.price ? parseFloat(p.price) : null,
  createdAt: p.created_at,
});
```

Update the import at the top of `src/modules/declarations/services/index.ts` to include the new interface:
```ts
import { IDeclaration, IDeclarationPersistence, IDeclarationFormValues, IDeclarationPost, IDeclarationPostPersistence, IUnknownDeclaration, IUnknownDeclarationPersistence } from "../interfaces";
```

Add before the final closing brace of the file (after `PostDeclarationsService`):
```ts
export const UnknownDeclarationsService = {
  getList: async (query: Record<string, any> = {}): Promise<ApiResult<200, { data: IUnknownDeclaration[]; total: number }> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/v2/conflicted_declaration/list', { page: 1, per_page: 20, ...query });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        const data = (result.data || []).map(unknownDeclarationToDomain);
        return new ApiResult(200, { data, total: result.total ?? data.length }, null);
      }
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },

  getById: async (id: string | number): Promise<ApiResult<200, IUnknownDeclaration> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/conflicted_declaration/info', { conflicted_declaration_id: id });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        return new ApiResult(200, unknownDeclarationToDomain(result.data as IUnknownDeclarationPersistence), null);
      }
      return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },

  cancel: async (ids: (string | number)[]): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/conflicted_declaration/cancel', { conflicted_declaration_id: ids });
    try {
      const response = await caller(url, { method: 'POST' });
      if (response.ok) return new ApiResult(200, null, null);
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },

  accept: async (id: string | number): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/conflicted_declaration/accept');
    const body = new FormData();
    body.append('conflicted_declaration_id', String(id));
    try {
      const response = await caller(url, { method: 'POST', body });
      if (response.ok) return new ApiResult(200, null, null);
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },
};
```

- [ ] **Step 4: Add context**

Replace `src/modules/declarations/context/index.ts` with:
```ts
import { createNextTableContext } from '@shared/modules/next-table/context/context';

export const DeclarationsTableContext = createNextTableContext();
export const DeletedDeclarationsTableContext = createNextTableContext();
export const PostDeclarationsTableContext = createNextTableContext();
export const UnknownDeclarationsTableContext = createNextTableContext();
```

- [ ] **Step 5: Create use-case**

`src/modules/declarations/use-cases/unknown-declarations-table-fetch.ts`:
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
import { UnknownDeclarationsService } from '../services';

export const unknownDeclarationsTableFetchUseCase = (params: NextTableFetchParams) => async (dispatch: Dispatch<NextTableActions>) => {
  dispatch(nextTableFetchDataStartedAction());
  const result = await UnknownDeclarationsService.getList(tableQueryMaker(params));
  if (result.status === 200) {
    dispatch(nextTableFetchDataSucceedAction({ data: result.data.data, total: result.data.total }));
  } else {
    dispatch(nextTableFetchDataFailedAction('Xəta baş verdi.'));
  }
};
```

- [ ] **Step 6: Create table columns hook**

`src/modules/declarations/hooks/unknownDeclarations/use-unknown-declarations-table-columns.tsx`:
```tsx
import { useMemo } from 'react';
import { Column } from 'react-table';
import { Button, Modal, Space, message } from 'antd';
import * as Icons from '@ant-design/icons';
import { nextTableColumns } from '@shared/modules/next-table/helpers/next-table-columns';
import { StopPropagation } from '@shared/components/stop-propagation';
import { useBackgroundNavigate } from '@shared/hooks';
import { UnknownDeclarationsService } from '../../services';
import { IUnknownDeclaration } from '../../interfaces';
import { UnknownDeclarationsTableContext } from '../../context';
import { useContext } from 'react';

export const useUnknownDeclarationsTableColumns = (): Column<IUnknownDeclaration>[] => {
  const navigate = useBackgroundNavigate();
  const { handleFetch } = useContext(UnknownDeclarationsTableContext);

  return useMemo<Column<IUnknownDeclaration>[]>(
    () => [
      {
        ...nextTableColumns.actions,
        Cell: ({ row: { original } }: any) => (
          <StopPropagation>
            <Space size={4}>
              <Button
                icon={<Icons.FileSearchOutlined />}
                size='small'
                onClick={() => navigate(`/declarations/unknowns/${original.id}`, { withBackground: true })}
              />
              <Button
                icon={<Icons.CheckOutlined />}
                size='small'
                type='primary'
                ghost
                onClick={() => {
                  Modal.confirm({
                    title: 'Diqqət',
                    content: 'Bu bəyannaməni qəbul etmək istədiyinizdən əminsinizmi?',
                    onOk: async () => {
                      const result = await UnknownDeclarationsService.accept(original.id);
                      if (result.status === 200) { message.success('Qəbul edildi'); handleFetch(); }
                      else message.error(result.data as string);
                    },
                  });
                }}
              />
              <Button
                icon={<Icons.DeleteOutlined />}
                size='small'
                danger
                onClick={() => {
                  Modal.confirm({
                    title: 'Diqqət',
                    content: 'Ləğv etmək istədiyinizdən əminsinizmi?',
                    onOk: async () => {
                      const result = await UnknownDeclarationsService.cancel([original.id]);
                      if (result.status === 200) { message.success('Ləğv edildi'); handleFetch(); }
                      else message.error(result.data as string);
                    },
                  });
                }}
              />
            </Space>
          </StopPropagation>
        ),
      },
      { ...nextTableColumns.small, Header: 'Kod', id: 'id', accessor: (r) => r.id },
      { accessor: (r) => r.globalTrackCode, id: 'global_track_code', Header: 'Global izləmə kodu' },
      { accessor: (r) => r.trackCode, id: 'track_code', Header: 'İzləmə kodu' },
      { accessor: (r) => r.user?.name ?? '—', id: 'user_name', Header: 'İstifadəçi' },
      { accessor: (r) => r.status.name, id: 'state_name', Header: 'Status' },
      { ...nextTableColumns.date, accessor: (r) => r.createdAt, id: 'created_at', Header: 'Yaradılma tarixi' },
    ],
    [navigate, handleFetch],
  );
};
```

- [ ] **Step 7: Create table hook**

`src/modules/declarations/hooks/unknownDeclarations/use-unknown-declarations-table.ts`:
```ts
import { useUnknownDeclarationsTableColumns } from './use-unknown-declarations-table-columns';

export const useUnknownDeclarationsTable = () => {
  const columns = useUnknownDeclarationsTableColumns();
  return { columns };
};
```

- [ ] **Step 8: Create subfolder barrel**

`src/modules/declarations/hooks/unknownDeclarations/index.ts`:
```ts
export { useUnknownDeclarationsTable } from './use-unknown-declarations-table';
export { useUnknownDeclarationsTableColumns } from './use-unknown-declarations-table-columns';
```

- [ ] **Step 9: Add to hooks barrel**

Append to `src/modules/declarations/hooks/index.ts`:
```ts
export * from './unknownDeclarations';
```

- [ ] **Step 10: Create containers**

`src/modules/declarations/containers/unknown-declarations-action-bar.tsx`:
```tsx
import { useContext } from 'react';
import { Space } from 'antd';
import * as Icons from '@ant-design/icons';
import { HeadPortal } from '@modules/layout/components/head-portal';
import { StyledHeaderButton } from '@modules/layout/styled';
import { StyledActionBar } from '@shared/styled/action-bar';
import { UnknownDeclarationsTableContext } from '../context';

export const UnknownDeclarationsActionBar = () => {
  const { handleFetch, handleReset } = useContext(UnknownDeclarationsTableContext);

  return (
    <HeadPortal>
      <StyledActionBar $flex={true}>
        <Space>
          <StyledHeaderButton type='text' onClick={handleFetch} icon={<Icons.ReloadOutlined />}>
            Yenilə
          </StyledHeaderButton>
          <StyledHeaderButton type='text' onClick={handleReset} icon={<Icons.ClearOutlined />}>
            Sıfırla
          </StyledHeaderButton>
        </Space>
      </StyledActionBar>
    </HeadPortal>
  );
};
```

`src/modules/declarations/containers/unknown-declarations-table.tsx`:
```tsx
import { FC } from 'react';
import { NextTable } from '@shared/modules/next-table/containers';
import { UnknownDeclarationsTableContext } from '../context';
import { useUnknownDeclarationsTable } from '../hooks';

export const UnknownDeclarationsTable: FC = () => {
  const { columns } = useUnknownDeclarationsTable();
  return <NextTable context={UnknownDeclarationsTableContext} columns={columns} />;
};
```

`src/modules/declarations/containers/unknown-declaration-detail.tsx`:
```tsx
import { FC } from 'react';
import { Modal, Descriptions, Spin, Result } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { UnknownDeclarationsService } from '../services';

export const UnknownDeclarationDetail: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const close = () => navigate(-1);

  const { data, isLoading, isError } = useQuery(
    ['unknown-declaration', id],
    async () => {
      const result = await UnknownDeclarationsService.getById(id!);
      if (result.status === 200) return result.data;
      throw new Error(result.data as string);
    },
    { enabled: !!id },
  );

  return (
    <Modal open={true} onCancel={close} footer={null} width={520} title={`Naməlum bəyannamə #${id}`}>
      {isLoading && <Spin />}
      {isError && <Result status='error' title='Xəta baş verdi' />}
      {data && (
        <Descriptions bordered column={1} size='small'>
          <Descriptions.Item label='Kod'>{data.id}</Descriptions.Item>
          <Descriptions.Item label='Global izləmə kodu'>{data.globalTrackCode}</Descriptions.Item>
          <Descriptions.Item label='İzləmə kodu'>{data.trackCode}</Descriptions.Item>
          <Descriptions.Item label='Status'>{data.status.name}</Descriptions.Item>
          <Descriptions.Item label='İstifadəçi'>{data.user?.name ?? '—'}</Descriptions.Item>
          <Descriptions.Item label='Çəki'>{data.weight ?? '—'} kg</Descriptions.Item>
          <Descriptions.Item label='Qiymət'>{data.price ?? '—'}</Descriptions.Item>
          <Descriptions.Item label='Yaradılma tarixi'>{data.createdAt}</Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
};
```

- [ ] **Step 11: Add to containers barrel**

Append to `src/modules/declarations/containers/index.ts`:
```ts
export { UnknownDeclarationsTable } from './unknown-declarations-table';
export { UnknownDeclarationsActionBar } from './unknown-declarations-action-bar';
export { UnknownDeclarationDetail } from './unknown-declaration-detail';
```

- [ ] **Step 12: Create page**

`src/modules/declarations/pages/unknown-declarations.tsx`:
```tsx
import { FC } from 'react';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { PageContent } from '@shared/styled/page-content';
import { UnknownDeclarationsTableContext } from '../context';
import { unknownDeclarationsTableFetchUseCase } from '../use-cases/unknown-declarations-table-fetch';
import { UnknownDeclarationsTable, UnknownDeclarationsActionBar } from '../containers';

export const UnknownDeclarationsPage: FC = () => {
  return (
    <PageContent $contain={true}>
      <NextTableProvider context={UnknownDeclarationsTableContext} onFetch={unknownDeclarationsTableFetchUseCase} name='unknown-declarations-table'>
        <UnknownDeclarationsActionBar />
        <UnknownDeclarationsTable />
      </NextTableProvider>
    </PageContent>
  );
};
```

- [ ] **Step 13: Update declarations page router**

Replace `src/modules/declarations/router/page.router.tsx`:
```tsx
import React, { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import { DeclarationsPage } from '../pages';
import { DeclarationDetailPage } from '../pages/detail';

const DeletedDeclarationsPage = React.lazy(() => import('../pages/deleted-declarations').then((m) => ({ default: m.DeletedDeclarationsPage })));
const PostDeclarationsPage = React.lazy(() => import('../pages/post-declarations').then((m) => ({ default: m.PostDeclarationsPage })));
const UnknownDeclarationsPage = React.lazy(() => import('../pages/unknown-declarations').then((m) => ({ default: m.UnknownDeclarationsPage })));

const DeclarationsPageRouter: FC = () => {
  return (
    <Routes>
      <Route index element={<DeclarationsPage />} />
      <Route path=':id' element={<DeclarationDetailPage />} />
      <Route path='deleted' element={<React.Suspense fallback={null}><DeletedDeclarationsPage /></React.Suspense>} />
      <Route path='post' element={<React.Suspense fallback={null}><PostDeclarationsPage /></React.Suspense>} />
      <Route path='unknowns/*' element={<React.Suspense fallback={null}><UnknownDeclarationsPage /></React.Suspense>} />
    </Routes>
  );
};

export default DeclarationsPageRouter;
```

- [ ] **Step 14: Update declarations modal router**

Replace `src/modules/declarations/router/modal.router.tsx`:
```tsx
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { CreateDeclaration } from '../containers/create-declaration';
import { UnknownDeclarationDetail } from '../containers/unknown-declaration-detail';

const DeclarationsModalRouter = () => {
  return (
    <Routes>
      <Route path='create' element={<CreateDeclaration />} />
      <Route path=':id/update' element={<CreateDeclaration />} />
      <Route path='unknowns/:id' element={<UnknownDeclarationDetail />} />
    </Routes>
  );
};

export default DeclarationsModalRouter;
```

- [ ] **Step 15: Verify build**

```bash
cd /home/fared/Desktop/EASYSOFT/delivery_management_new && npx tsc --noEmit 2>&1 | head -30
```

- [ ] **Step 16: Commit**

```bash
git add src/modules/declarations/
git commit -m "feat(declarations): add unknown declarations page with list, detail, accept/cancel"
```

---

## Task 4: Declarations — Partner Declarations Page

**Files:**
- Create: `src/modules/declarations/interfaces/partner-declaration.interface.ts`
- Modify: `src/modules/declarations/interfaces/index.ts`
- Modify: `src/modules/declarations/services/index.ts`
- Modify: `src/modules/declarations/context/index.ts`
- Create: `src/modules/declarations/use-cases/partner-declarations-table-fetch.ts`
- Create: `src/modules/declarations/hooks/partnerDeclarations/` (3 files)
- Modify: `src/modules/declarations/hooks/index.ts`
- Create: `src/modules/declarations/containers/partner-declarations-table.tsx`
- Create: `src/modules/declarations/containers/partner-declarations-action-bar.tsx`
- Modify: `src/modules/declarations/containers/index.ts`
- Create: `src/modules/declarations/pages/partner-declarations.tsx`
- Modify: `src/modules/declarations/router/page.router.tsx`

- [ ] **Step 1: Create partner declaration interface**

`src/modules/declarations/interfaces/partner-declaration.interface.ts`:
```ts
export type IPartnerDeclaration = {
  id: number;
  trackCode: string;
  status: { id: number; name: string };
  user: { id: number; name: string } | null;
  partner: { id: number; name: string } | null;
  createdAt: string;
};

export type IPartnerDeclarationPersistence = {
  id: number;
  track_code: string;
  state_id: number;
  state_name: string;
  user_id: number | null;
  user_name: string | null;
  partner_id: number | null;
  partner_name: string | null;
  created_at: string;
};
```

- [ ] **Step 2: Add to interfaces barrel**

Append to `src/modules/declarations/interfaces/index.ts`:
```ts
export * from './partner-declaration.interface';
```

- [ ] **Step 3: Add service + context + use-case**

Add this mapper to `src/modules/declarations/services/index.ts` (after `unknownDeclarationToDomain`):
```ts
const partnerDeclarationToDomain = (p: IPartnerDeclarationPersistence): IPartnerDeclaration => ({
  id: p.id,
  trackCode: p.track_code,
  status: { id: p.state_id, name: p.state_name },
  user: p.user_id ? { id: p.user_id, name: p.user_name ?? '' } : null,
  partner: p.partner_id ? { id: p.partner_id, name: p.partner_name ?? '' } : null,
  createdAt: p.created_at,
});
```

Update the import at the top to include new interfaces:
```ts
import { IDeclaration, IDeclarationPersistence, IDeclarationFormValues, IDeclarationPost, IDeclarationPostPersistence, IUnknownDeclaration, IUnknownDeclarationPersistence, IPartnerDeclaration, IPartnerDeclarationPersistence } from "../interfaces";
```

Append to the end of `src/modules/declarations/services/index.ts`:
```ts
export const PartnerDeclarationsService = {
  getList: async (query: Record<string, any> = {}): Promise<ApiResult<200, { data: IPartnerDeclaration[]; total: number }> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/declaration/partner_declarations', { page: 1, per_page: 20, ...query });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        const data = (result.data || []).map(partnerDeclarationToDomain);
        return new ApiResult(200, { data, total: result.total ?? data.length }, null);
      }
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },
};
```

Add `PartnerDeclarationsTableContext` to `src/modules/declarations/context/index.ts`:
```ts
import { createNextTableContext } from '@shared/modules/next-table/context/context';

export const DeclarationsTableContext = createNextTableContext();
export const DeletedDeclarationsTableContext = createNextTableContext();
export const PostDeclarationsTableContext = createNextTableContext();
export const UnknownDeclarationsTableContext = createNextTableContext();
export const PartnerDeclarationsTableContext = createNextTableContext();
```

`src/modules/declarations/use-cases/partner-declarations-table-fetch.ts`:
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
import { PartnerDeclarationsService } from '../services';

export const partnerDeclarationsTableFetchUseCase = (params: NextTableFetchParams) => async (dispatch: Dispatch<NextTableActions>) => {
  dispatch(nextTableFetchDataStartedAction());
  const result = await PartnerDeclarationsService.getList(tableQueryMaker(params));
  if (result.status === 200) {
    dispatch(nextTableFetchDataSucceedAction({ data: result.data.data, total: result.data.total }));
  } else {
    dispatch(nextTableFetchDataFailedAction('Xəta baş verdi.'));
  }
};
```

- [ ] **Step 4: Create hook subfolder**

`src/modules/declarations/hooks/partnerDeclarations/use-partner-declarations-table-columns.tsx`:
```tsx
import { useMemo } from 'react';
import { Column } from 'react-table';
import { nextTableColumns } from '@shared/modules/next-table/helpers/next-table-columns';
import { IPartnerDeclaration } from '../../interfaces';

export const usePartnerDeclarationsTableColumns = (): Column<IPartnerDeclaration>[] => {
  return useMemo<Column<IPartnerDeclaration>[]>(
    () => [
      { ...nextTableColumns.small, Header: 'Kod', id: 'id', accessor: (r) => r.id },
      { accessor: (r) => r.trackCode, id: 'track_code', Header: 'İzləmə kodu' },
      { accessor: (r) => r.user?.name ?? '—', id: 'user_name', Header: 'İstifadəçi', filterable: false },
      { accessor: (r) => r.partner?.name ?? '—', id: 'partner_name', Header: 'Partner', filterable: false },
      { accessor: (r) => r.status.name, id: 'state_name', Header: 'Status' },
      { ...nextTableColumns.date, accessor: (r) => r.createdAt, id: 'created_at', Header: 'Yaradılma tarixi' },
    ],
    [],
  );
};
```

`src/modules/declarations/hooks/partnerDeclarations/use-partner-declarations-table.ts`:
```ts
import { usePartnerDeclarationsTableColumns } from './use-partner-declarations-table-columns';

export const usePartnerDeclarationsTable = () => {
  const columns = usePartnerDeclarationsTableColumns();
  return { columns };
};
```

`src/modules/declarations/hooks/partnerDeclarations/index.ts`:
```ts
export { usePartnerDeclarationsTable } from './use-partner-declarations-table';
export { usePartnerDeclarationsTableColumns } from './use-partner-declarations-table-columns';
```

Append to `src/modules/declarations/hooks/index.ts`:
```ts
export * from './partnerDeclarations';
```

- [ ] **Step 5: Create containers**

`src/modules/declarations/containers/partner-declarations-action-bar.tsx`:
```tsx
import { useContext } from 'react';
import { Space } from 'antd';
import * as Icons from '@ant-design/icons';
import { HeadPortal } from '@modules/layout/components/head-portal';
import { StyledHeaderButton } from '@modules/layout/styled';
import { StyledActionBar } from '@shared/styled/action-bar';
import { PartnerDeclarationsTableContext } from '../context';

export const PartnerDeclarationsActionBar = () => {
  const { handleFetch, handleReset } = useContext(PartnerDeclarationsTableContext);

  return (
    <HeadPortal>
      <StyledActionBar $flex={true}>
        <Space>
          <StyledHeaderButton type='text' onClick={handleFetch} icon={<Icons.ReloadOutlined />}>
            Yenilə
          </StyledHeaderButton>
          <StyledHeaderButton type='text' onClick={handleReset} icon={<Icons.ClearOutlined />}>
            Sıfırla
          </StyledHeaderButton>
        </Space>
      </StyledActionBar>
    </HeadPortal>
  );
};
```

`src/modules/declarations/containers/partner-declarations-table.tsx`:
```tsx
import { FC } from 'react';
import { NextTable } from '@shared/modules/next-table/containers';
import { PartnerDeclarationsTableContext } from '../context';
import { usePartnerDeclarationsTable } from '../hooks';

export const PartnerDeclarationsTable: FC = () => {
  const { columns } = usePartnerDeclarationsTable();
  return <NextTable context={PartnerDeclarationsTableContext} columns={columns} />;
};
```

Append to `src/modules/declarations/containers/index.ts`:
```ts
export { PartnerDeclarationsTable } from './partner-declarations-table';
export { PartnerDeclarationsActionBar } from './partner-declarations-action-bar';
```

- [ ] **Step 6: Create page**

`src/modules/declarations/pages/partner-declarations.tsx`:
```tsx
import { FC } from 'react';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { PageContent } from '@shared/styled/page-content';
import { PartnerDeclarationsTableContext } from '../context';
import { partnerDeclarationsTableFetchUseCase } from '../use-cases/partner-declarations-table-fetch';
import { PartnerDeclarationsTable, PartnerDeclarationsActionBar } from '../containers';

export const PartnerDeclarationsPage: FC = () => {
  return (
    <PageContent $contain={true}>
      <NextTableProvider context={PartnerDeclarationsTableContext} onFetch={partnerDeclarationsTableFetchUseCase} name='partner-declarations-table'>
        <PartnerDeclarationsActionBar />
        <PartnerDeclarationsTable />
      </NextTableProvider>
    </PageContent>
  );
};
```

- [ ] **Step 7: Update page router**

Replace `src/modules/declarations/router/page.router.tsx`:
```tsx
import React, { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import { DeclarationsPage } from '../pages';
import { DeclarationDetailPage } from '../pages/detail';

const DeletedDeclarationsPage = React.lazy(() => import('../pages/deleted-declarations').then((m) => ({ default: m.DeletedDeclarationsPage })));
const PostDeclarationsPage = React.lazy(() => import('../pages/post-declarations').then((m) => ({ default: m.PostDeclarationsPage })));
const UnknownDeclarationsPage = React.lazy(() => import('../pages/unknown-declarations').then((m) => ({ default: m.UnknownDeclarationsPage })));
const PartnerDeclarationsPage = React.lazy(() => import('../pages/partner-declarations').then((m) => ({ default: m.PartnerDeclarationsPage })));

const DeclarationsPageRouter: FC = () => {
  return (
    <Routes>
      <Route index element={<DeclarationsPage />} />
      <Route path=':id' element={<DeclarationDetailPage />} />
      <Route path='deleted' element={<React.Suspense fallback={null}><DeletedDeclarationsPage /></React.Suspense>} />
      <Route path='post' element={<React.Suspense fallback={null}><PostDeclarationsPage /></React.Suspense>} />
      <Route path='unknowns/*' element={<React.Suspense fallback={null}><UnknownDeclarationsPage /></React.Suspense>} />
      <Route path='partners' element={<React.Suspense fallback={null}><PartnerDeclarationsPage /></React.Suspense>} />
    </Routes>
  );
};

export default DeclarationsPageRouter;
```

- [ ] **Step 8: Verify build**

```bash
cd /home/fared/Desktop/EASYSOFT/delivery_management_new && npx tsc --noEmit 2>&1 | head -30
```

- [ ] **Step 9: Commit**

```bash
git add src/modules/declarations/
git commit -m "feat(declarations): add partner declarations page"
```

---

## Task 5: Declarations — Handover Modals (Pay + Bulk Handover)

**Files:**
- Modify: `src/modules/declarations/services/index.ts`
- Create: `src/modules/declarations/containers/pay-declaration-modal.tsx`
- Create: `src/modules/declarations/containers/bulk-handover-modal.tsx`
- Modify: `src/modules/declarations/containers/index.ts`
- Modify: `src/modules/declarations/containers/declarations-action-bar.tsx`
- Modify: `src/modules/declarations/router/modal.router.tsx`

- [ ] **Step 1: Add handover service methods**

Append to `src/modules/declarations/services/index.ts` (in `DeclarationsService`), after `cancelDeclarations`:
```ts
  pay: async (ids: (string | number)[], amount: string, paymentTypeId: string, cashboxId: string): Promise<ApiResult<200, null> | ApiResult<400 | 422, any>> => {
    const url = urlMaker('/api/admin/declaration/pay');
    const body = new FormData();
    ids.forEach((id) => body.append('declaration_id[]', String(id)));
    body.append('amount', amount);
    body.append('payment_type_id', paymentTypeId);
    body.append('cashbox_id', cashboxId);
    try {
      const response = await caller(url, { method: 'POST', body });
      if (response.ok) return new ApiResult(200, null, null);
      const result = await response.json();
      if (response.status === 422) return new ApiResult(422, result.errors || {}, null);
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },

  bulkHandover: async (stateId: string, tariffCategoryId: string): Promise<ApiResult<200, null> | ApiResult<400 | 422, any>> => {
    const url = urlMaker('/api/admin/declaration/handover');
    const body = new FormData();
    body.append('state_id', stateId);
    body.append('tariff_category_id', tariffCategoryId);
    try {
      const response = await caller(url, { method: 'POST', body });
      if (response.ok) return new ApiResult(200, null, null);
      const result = await response.json();
      if (response.status === 422) return new ApiResult(422, result.errors || {}, null);
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },

  getPaymentTypes: async (): Promise<ApiResult<200, { id: number; name: string }[]> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/payment_types/list', { per_page: 1000 });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        return new ApiResult(200, (result.data || []).map((p: any) => ({ id: p.id, name: p.name })), null);
      }
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },
```

- [ ] **Step 2: Create pay declaration modal**

`src/modules/declarations/containers/pay-declaration-modal.tsx`:
```tsx
import { FC } from 'react';
import { Form, Input, Modal, Select, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { DeclarationsService } from '../services';

export const PayDeclarationModal: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const close = () => navigate(-1);

  const { data: paymentTypes } = useQuery('payment-types', async () => {
    const result = await DeclarationsService.getPaymentTypes();
    return result.status === 200 ? result.data : [];
  });

  const { data: cashboxes } = useQuery('cashboxes-for-pay', async () => {
    const { caller, urlMaker } = await import('@shared/utils');
    const response = await caller(urlMaker('/api/admin/cashboxes', { per_page: 1000 }));
    if (response.ok) {
      const result = await response.json();
      return (result.data || []).map((c: any) => ({ id: c.id, name: c.cashbox_name }));
    }
    return [];
  });

  const onOk = async () => {
    const values = await form.validateFields();
    const ids = id!.split(',');
    const result = await DeclarationsService.pay(ids, values.amount, values.paymentTypeId, values.cashboxId);
    if (result.status === 200) {
      message.success('Ödəniş uğurla tamamlandı.');
      close();
    } else {
      message.error('Xəta baş verdi.');
    }
  };

  return (
    <Modal open={true} onCancel={close} onOk={onOk} title='Ödəniş' okText='Ödə' cancelText='Ləğv et' width={480}>
      <Form form={form} layout='vertical'>
        <Form.Item name='amount' label='Məbləğ (₼)' rules={[{ required: true, message: 'Məbləği daxil edin' }]}>
          <Input placeholder='0.00' addonAfter='₼' />
        </Form.Item>
        <Form.Item name='paymentTypeId' label='Ödəniş növü' rules={[{ required: true, message: 'Ödəniş növünü seçin' }]}>
          <Select placeholder='Ödəniş növünü seçin...'>
            {(paymentTypes ?? []).map((pt) => (
              <Select.Option key={pt.id} value={String(pt.id)}>{pt.name}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name='cashboxId' label='Kassa' rules={[{ required: true, message: 'Kassanı seçin' }]}>
          <Select placeholder='Kassanı seçin...'>
            {(cashboxes ?? []).map((c: any) => (
              <Select.Option key={c.id} value={String(c.id)}>{c.name}</Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};
```

- [ ] **Step 3: Create bulk handover modal**

`src/modules/declarations/containers/bulk-handover-modal.tsx`:
```tsx
import { FC, useContext } from 'react';
import { Form, Modal, Select, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { DeclarationsService } from '../services';
import { DeclarationsTableContext } from '../context';
// handleFetch is used to refresh the table after handover completes

const STATE_OPTIONS = [
  { value: '5', label: 'Öncədən bəyan' },
  { value: '7', label: 'Xarici anbarda' },
  { value: '8', label: 'Yolda' },
  { value: '9', label: 'Yerli anbarda' },
  { value: '10', label: 'Təhvil verilib' },
];

export const BulkHandoverModal: FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const close = () => navigate(-1);
  const { handleFetch } = useContext(DeclarationsTableContext);

  const { data: planCategories } = useQuery('tariff-categories-handover', async () => {
    const result = await DeclarationsService.getPlanCategories();
    return result.status === 200 ? result.data : [];
  });

  const onOk = async () => {
    const values = await form.validateFields();
    const result = await DeclarationsService.bulkHandover(values.stateId, values.tariffCategoryId);
    if (result.status === 200) {
      message.success('Toplu təhvil uğurla tamamlandı.');
      handleFetch();
      close();
    } else {
      message.error('Xəta baş verdi.');
    }
  };

  return (
    <Modal open={true} onCancel={close} onOk={onOk} title='Toplu təhvil' okText='Təhvil et' cancelText='Ləğv et' width={480}>
      <Form form={form} layout='vertical'>
        <Form.Item name='stateId' label='Status' rules={[{ required: true, message: 'Status seçin' }]}>
          <Select placeholder='Status seçin...'>
            {STATE_OPTIONS.map((s) => (
              <Select.Option key={s.value} value={s.value}>{s.label}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name='tariffCategoryId' label='Tarif kateqoriyası' rules={[{ required: true, message: 'Tarif kateqoriyası seçin' }]}>
          <Select placeholder='Tarif kateqoriyasını seçin...'>
            {(planCategories ?? []).map((c) => (
              <Select.Option key={c.id} value={String(c.id)}>{c.name}</Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};
```

- [ ] **Step 4: Add to containers barrel**

Append to `src/modules/declarations/containers/index.ts`:
```ts
export { PayDeclarationModal } from './pay-declaration-modal';
export { BulkHandoverModal } from './bulk-handover-modal';
```

- [ ] **Step 5: Add buttons to declarations action bar**

Read `src/modules/declarations/containers/declarations-action-bar.tsx`. Find where the action bar renders buttons. Add these two buttons (they require useNavigate):

At the top of the file, ensure `useNavigate` is imported from `react-router-dom`. Then within the component function, add:
```tsx
const navigate = useNavigate();
```

Add these buttons to the action bar's Space (or wherever the existing "Yenilə" and "Sıfırla" buttons are):
```tsx
<StyledHeaderButton type='text' icon={<Icons.DollarOutlined />} onClick={() => navigate('/declarations/handover')}>
  Toplu təhvil
</StyledHeaderButton>
```

- [ ] **Step 6: Update modal router**

Replace `src/modules/declarations/router/modal.router.tsx`:
```tsx
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { CreateDeclaration } from '../containers/create-declaration';
import { UnknownDeclarationDetail } from '../containers/unknown-declaration-detail';
import { PayDeclarationModal } from '../containers/pay-declaration-modal';
import { BulkHandoverModal } from '../containers/bulk-handover-modal';

const DeclarationsModalRouter = () => {
  return (
    <Routes>
      <Route path='create' element={<CreateDeclaration />} />
      <Route path=':id/update' element={<CreateDeclaration />} />
      <Route path='unknowns/:id' element={<UnknownDeclarationDetail />} />
      <Route path=':id/pay' element={<PayDeclarationModal />} />
      <Route path='handover' element={<BulkHandoverModal />} />
    </Routes>
  );
};

export default DeclarationsModalRouter;
```

- [ ] **Step 7: Verify build**

```bash
cd /home/fared/Desktop/EASYSOFT/delivery_management_new && npx tsc --noEmit 2>&1 | head -30
```

- [ ] **Step 8: Commit**

```bash
git add src/modules/declarations/
git commit -m "feat(declarations): add pay and bulk handover modals"
```

---

## Task 6: Flights — Close Flight Modal

**Files:**
- Modify: `src/modules/flights/interfaces/flight.interface.ts`
- Modify: `src/modules/flights/mappers/index.ts`
- Create: `src/modules/flights/containers/close-flight-modal.tsx`
- Modify: `src/modules/flights/containers/flight-details.tsx`
- Modify: `src/modules/flights/router/modal.router.tsx`

- [ ] **Step 1: Update CloseFlightDto to include type**

In `src/modules/flights/interfaces/flight.interface.ts`, replace:
```ts
export type CloseFlightDto = {
  id: string;
  airWaybillNumber: string;
  packagingLimit: string;
};
```
with:
```ts
export type CloseFlightDto = {
  id: string;
  type: 'with-dispatch' | 'without-dispatch' | 'all';
  airWaybillNumber: string;
  packagingLimit: string;
};
```

- [ ] **Step 2: Update CloseFlightDtoMapper to include depesh**

In `src/modules/flights/mappers/index.ts`, replace the `CloseFlightDtoMapper.toPersistence` method:
```ts
  public static toPersistence(dto: CloseFlightDto): Record<string, any> {
    const depesh = dto.type === 'with-dispatch' ? 1 : dto.type === 'without-dispatch' ? 0 : 2;
    return {
      flight_id: dto.id,
      airWaybill: dto.airWaybillNumber,
      depesh,
      limit: dto.packagingLimit,
    };
  }
```

- [ ] **Step 3: Create close flight modal container**

`src/modules/flights/containers/close-flight-modal.tsx`:
```tsx
import { FC, useState } from 'react';
import { Form, Input, Modal, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { FlightsService } from '../services';
import { CloseFlightDto } from '../interfaces';

export const CloseFlightModal: FC = () => {
  const { id, type } = useParams<{ id: string; type: CloseFlightDto['type'] }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const close = () => navigate(`/flights/${id}`);

  const typeLabel = type === 'with-dispatch' ? 'Depeşli' : type === 'without-dispatch' ? 'Depeşsiz' : 'Hamısı';

  const onOk = async () => {
    const values = form.getFieldsValue();
    setSubmitting(true);
    const result = await FlightsService.close({
      id: id!,
      type: type as CloseFlightDto['type'],
      airWaybillNumber: values.airWaybillNumber || '',
      packagingLimit: values.packagingLimit || '100',
    });
    setSubmitting(false);
    if (result.status === 200) {
      message.success('Uçuş bağlandı.');
      close();
    } else {
      message.error(typeof result.data === 'string' ? result.data : 'Xəta baş verdi.');
    }
  };

  return (
    <Modal
      open={true}
      onCancel={close}
      onOk={onOk}
      confirmLoading={submitting}
      title={`Uçuşu bağla — ${typeLabel}`}
      okText='Bağla'
      cancelText='Ləğv et'
      width={480}
    >
      <Form form={form} layout='vertical' initialValues={{ packagingLimit: '100' }}>
        <Form.Item name='airWaybillNumber' label='Aviaqaimə nömrəsi'>
          <Input placeholder='Aviaqaimə nömrəsini daxil edin...' />
        </Form.Item>
        <Form.Item name='packagingLimit' label='Paketləmə limiti'>
          <Input placeholder='100' />
        </Form.Item>
      </Form>
    </Modal>
  );
};
```

- [ ] **Step 4: Add "Uçuşu bağla" dropdown to flight-details**

In `src/modules/flights/containers/flight-details.tsx`, find the `extra` array construction (around line 73). After the last existing button in the `DetailActions` block and before the `</DetailActionCol>` tag, add this dropdown (it must show only when `data.status.id === 29`):

Add `Dropdown` and `MenuProps` to antd imports if not already present. The `import` line already has `Dropdown, MenuProps`, so you just need to add the JSX.

In `flight-details.tsx`, after the Trendyol status Dropdown block (around line 95), add:
```tsx
{data.status.id === 29 && (
  <Dropdown
    menu={{
      items: [
        { key: 'with-dispatch', label: 'Depeşli', onClick: () => navigate(`/flights/${id}/close/with-dispatch`) },
        { key: 'without-dispatch', label: 'Depeşsiz', onClick: () => navigate(`/flights/${id}/close/without-dispatch`) },
        { key: 'all', label: 'Hamısı', onClick: () => navigate(`/flights/${id}/close/all`) },
      ],
    }}
  >
    <Button type='primary' ghost icon={<Icons.LockOutlined />}>Uçuşu bağla</Button>
  </Dropdown>
)}
```

- [ ] **Step 5: Update flights modal router**

Replace `src/modules/flights/router/modal.router.tsx`:
```tsx
import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import { CreateFlight, UpdateAirWaybillModal, UpdateCurrentMonthModal, UploadManifestModal, CloseFlightModal } from '../containers';

export const FlightsModalRouter: FC = () => (
  <Routes>
    <Route path='create' element={<CreateFlight />} />
    <Route path=':id/update' element={<CreateFlight />} />
    <Route path=':id/air-waybills/update' element={<UpdateAirWaybillModal />} />
    <Route path=':id/current-month/update' element={<UpdateCurrentMonthModal />} />
    <Route path=':id/manifest/upload' element={<UploadManifestModal />} />
    <Route path=':id/close/:type' element={<CloseFlightModal />} />
  </Routes>
);

export default FlightsModalRouter;
```

- [ ] **Step 6: Export CloseFlightModal from containers barrel**

Append to `src/modules/flights/containers/index.ts`:
```ts
export * from './close-flight-modal';
```

- [ ] **Step 7: Verify build**

```bash
cd /home/fared/Desktop/EASYSOFT/delivery_management_new && npx tsc --noEmit 2>&1 | head -30
```

- [ ] **Step 8: Commit**

```bash
git add src/modules/flights/
git commit -m "feat(flights): add close flight modal with dispatch type selection"
```

---

## Task 7: Users — Permissions Modal

**Files:**
- Create: `src/modules/users/interfaces/user-permissions.interface.ts`
- Modify: `src/modules/users/interfaces/index.ts`
- Modify: `src/modules/users/services/index.ts`
- Create: `src/modules/users/hooks/userPermissions/use-user-permissions.ts`
- Create: `src/modules/users/hooks/userPermissions/index.ts`
- Modify: `src/modules/users/hooks/index.ts`
- Create: `src/modules/users/containers/update-user-permissions-modal.tsx`
- Modify: `src/modules/users/containers/index.ts`
- Modify: `src/modules/users/hooks/users/use-users-table-columns.tsx`
- Modify: `src/modules/users/router/modal.router.tsx`

- [ ] **Step 1: Create permissions interface**

`src/modules/users/interfaces/user-permissions.interface.ts`:
```ts
export type IOperation = {
  id: number;
  name: string;
  codeName: string;
};

export type IOperationGroup = {
  id: number;
  name: string;
  operations: IOperation[];
};

export type IUserPermissions = {
  permissionIds: number[];
  companyId: number;
};
```

- [ ] **Step 2: Add to interfaces barrel**

Append to `src/modules/users/interfaces/index.ts`:
```ts
export * from './user-permissions.interface';
```

- [ ] **Step 3: Add service methods**

Append to `src/modules/users/services/index.ts` (inside `UsersService` object, after `createDiscount`):
```ts
  getOperations: async (): Promise<ApiResult<200, IOperationGroup[]> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/operations');
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        const items: any[] = result.data || [];
        const modelIds = [...new Set(items.map((i: any) => i.model_id))];
        const groups: IOperationGroup[] = modelIds.map((modelId) => {
          const group = items.find((i) => i.model_id === modelId);
          const operations = items
            .filter((i) => i.model_id === modelId)
            .map((i) => ({ id: i.id, name: i.name, codeName: i.code_name }));
          return { id: modelId as number, name: group.model_name, operations };
        }).reverse();
        return new ApiResult(200, groups, null);
      }
      return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },

  getUserPermissions: async (userId: string | number): Promise<ApiResult<200, IUserPermissions> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/permissions', { user_id: userId });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        const permissionIds: number[] = (result.data || []).map((item: any) => item.operation_id);
        return new ApiResult(200, { permissionIds, companyId: result.company_id ?? 0 }, null);
      }
      return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },

  updateUserPermissions: async (userId: string | number, operationIds: number[], cashboxId?: number, adminBranchId?: number): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/permissions/edit');
    const body = new FormData();
    body.append('user_id', String(userId));
    operationIds.forEach((id) => body.append('operation_id[]', String(id)));
    if (cashboxId) body.append('cashbox_id', String(cashboxId));
    if (adminBranchId) body.append('admin_branch_id', String(adminBranchId));
    try {
      const response = await caller(url, { method: 'POST', body });
      if (response.ok) return new ApiResult(200, null, null);
      const result = await response.json();
      const msg = result.errors ? (Object.values(result.errors) as string[][]).flat().join('. ') : 'Xəta baş verdi.';
      return new ApiResult(400, msg, null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },
```

Also add `IOperationGroup` and `IUserPermissions` to the import in `src/modules/users/services/index.ts`:
```ts
import { IUser, IUserPersistence, IDetailedUser, IDetailedUserPersistence, CreateUserDto, CreateDiscountDto, IOperationGroup, IUserPermissions } from "../interfaces";
```

- [ ] **Step 4: Create permissions hook**

`src/modules/users/hooks/userPermissions/use-user-permissions.ts`:
```ts
import { useState } from 'react';
import { useQuery } from 'react-query';
import { UsersService } from '../../services';

export const useUserPermissions = (userId: string) => {
  const [operationIds, setOperationIds] = useState<number[]>([]);
  const [cashboxId, setCashboxId] = useState<number | undefined>(undefined);
  const [adminBranchId, setAdminBranchId] = useState<number | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);

  const { data: operations, isLoading: operationsLoading } = useQuery(
    ['operations'],
    async () => {
      const result = await UsersService.getOperations();
      return result.status === 200 ? result.data : [];
    },
  );

  const { data: cashboxes } = useQuery('cashboxes-permissions', async () => {
    const { caller, urlMaker } = await import('@shared/utils');
    const response = await caller(urlMaker('/api/admin/cashboxes', { per_page: 1000 }));
    if (response.ok) {
      const result = await response.json();
      return (result.data || []).map((c: any) => ({ id: c.id, name: c.cashbox_name }));
    }
    return [];
  });

  const { data: branches } = useQuery('admin-branches-permissions', async () => {
    const { caller, urlMaker } = await import('@shared/utils');
    const response = await caller(urlMaker('/api/admin/admin_branches', { per_page: 1000 }));
    if (response.ok) {
      const result = await response.json();
      return (result.data || []).map((b: any) => ({ id: b.id, name: b.name }));
    }
    return [];
  });

  const { isLoading: permissionsLoading } = useQuery(
    ['user-permissions', userId],
    async () => {
      const result = await UsersService.getUserPermissions(userId);
      return result.status === 200 ? result.data : null;
    },
    {
      enabled: !!userId,
      onSuccess: (data) => {
        if (data) setOperationIds(data.permissionIds);
      },
    },
  );

  const toggleOperation = (id: number) => {
    setOperationIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const submit = async () => {
    setSubmitting(true);
    const result = await UsersService.updateUserPermissions(userId, operationIds, cashboxId, adminBranchId);
    setSubmitting(false);
    return result;
  };

  return {
    operations: operations ?? [],
    cashboxes: cashboxes ?? [],
    branches: branches ?? [],
    operationIds,
    cashboxId,
    adminBranchId,
    setCashboxId,
    setAdminBranchId,
    toggleOperation,
    submit,
    isLoading: operationsLoading || permissionsLoading,
    submitting,
  };
};
```

- [ ] **Step 5: Create subfolder barrel**

`src/modules/users/hooks/userPermissions/index.ts`:
```ts
export { useUserPermissions } from './use-user-permissions';
```

- [ ] **Step 6: Add to hooks barrel**

Append to `src/modules/users/hooks/index.ts`:
```ts
export * from './userPermissions';
```

- [ ] **Step 7: Create permissions modal container**

`src/modules/users/containers/update-user-permissions-modal.tsx`:
```tsx
import { FC } from 'react';
import { Card, Col, Form, Modal, Row, Select, Spin, Switch, Typography, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useUserPermissions } from '../hooks';

export const UpdateUserPermissionsModal: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const close = () => navigate(-1);

  const {
    operations, cashboxes, branches,
    operationIds, cashboxId, adminBranchId,
    setCashboxId, setAdminBranchId, toggleOperation,
    submit, isLoading, submitting,
  } = useUserPermissions(id!);

  const onOk = async () => {
    const result = await submit();
    if (result.status === 200) {
      message.success('İcazələr yadda saxlandı.');
      close();
    } else {
      message.error(result.data as string);
    }
  };

  return (
    <Modal
      open={true}
      onCancel={close}
      onOk={onOk}
      confirmLoading={submitting}
      title='İcazələr'
      width={768}
      okText='Yadda saxla'
      cancelText='Ləğv et'
    >
      {isLoading ? (
        <Spin />
      ) : (
        <Form layout='vertical' component='div'>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item label='Kassa'>
                <Select allowClear value={cashboxId} onChange={setCashboxId} placeholder='Kassa seçin...'>
                  {cashboxes.map((c: any) => (
                    <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label='Filial'>
                <Select allowClear value={adminBranchId} onChange={setAdminBranchId} placeholder='Filial seçin...'>
                  {branches.map((b: any) => (
                    <Select.Option key={b.id} value={b.id}>{b.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <div style={{ columns: 2, columnGap: 16 }}>
            {operations.map((group) => (
              <div key={group.id} style={{ breakInside: 'avoid', marginBottom: 16 }}>
                <Card size='small' title={group.name}>
                  {group.operations.map((op) => (
                    <div key={op.id} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                      <Typography.Text style={{ flex: 1 }}>{op.name}</Typography.Text>
                      <Switch
                        checked={operationIds.includes(op.id)}
                        onChange={() => toggleOperation(op.id)}
                        size='small'
                      />
                    </div>
                  ))}
                </Card>
              </div>
            ))}
          </div>
        </Form>
      )}
    </Modal>
  );
};
```

- [ ] **Step 8: Add to containers barrel**

Open `src/modules/users/containers/index.ts`. Append:
```ts
export { UpdateUserPermissionsModal } from './update-user-permissions-modal';
```

- [ ] **Step 9: Add "İcazələr" button to users table columns**

In `src/modules/users/hooks/users/use-users-table-columns.tsx`, find the dropdown `items` array in `actionsColumn`. Add a new item before the divider:
```ts
{
  key: 'permissions',
  label: 'İcazələr',
  icon: <Icons.SafetyOutlined />,
  onClick: () => navigate(`/users/${original.id}/permissions`, { withBackground: true }),
},
```

So the full items array becomes:
```ts
const items: MenuProps['items'] = [
  {
    key: 'details',
    label: 'Ətraflı bax',
    icon: <Icons.FileSearchOutlined />,
    onClick: () => navigate(`/users/${original.id}`),
  },
  {
    key: 'edit',
    label: 'Düzəliş et',
    icon: <Icons.EditOutlined />,
    onClick: () => navigate(`/users/${original.id}/update`, { withBackground: true }),
  },
  {
    key: 'permissions',
    label: 'İcazələr',
    icon: <Icons.SafetyOutlined />,
    onClick: () => navigate(`/users/${original.id}/permissions`, { withBackground: true }),
  },
  { type: 'divider' },
  {
    key: 'delete',
    label: 'Sil',
    icon: <Icons.DeleteOutlined />,
    danger: true,
    onClick: () => {
      Modal.confirm({
        title: 'Diqqət',
        content: 'İstifadəçini silməyə əminsinizmi?',
        okText: 'Sil',
        okType: 'danger',
        cancelText: 'Ləğv et',
        onOk: async () => {
          const result = await UsersService.deleteUser(original.id);
          if (result.status === 200) {
            handleFetch();
          } else {
            message.error(result.data as string);
          }
        },
      });
    },
  },
];
```

- [ ] **Step 10: Update users modal router**

Replace `src/modules/users/router/modal.router.tsx`:
```tsx
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { CreateUser } from '../containers/create-user';
import { UpdateUserPermissionsModal } from '../containers/update-user-permissions-modal';

const UsersModalRouter = () => {
  return (
    <Routes>
      <Route path='create' element={<CreateUser />} />
      <Route path=':id/update' element={<CreateUser />} />
      <Route path=':id/permissions' element={<UpdateUserPermissionsModal />} />
    </Routes>
  );
};

export default UsersModalRouter;
```

- [ ] **Step 11: Verify build**

```bash
cd /home/fared/Desktop/EASYSOFT/delivery_management_new && npx tsc --noEmit 2>&1 | head -30
```
Expected: no errors.

- [ ] **Step 12: Commit**

```bash
git add src/modules/users/
git commit -m "feat(users): add permissions modal with operations toggle, cashbox and branch selects"
```

---

## Final Verification

- [ ] **Run full build**

```bash
cd /home/fared/Desktop/EASYSOFT/delivery_management_new && npm run build 2>&1 | tail -20
```
Expected: Compiled successfully.

- [ ] **Check sidebar links exist for all new pages**

Navigate `src/modules/layout/containers/sidebar.tsx` and confirm sidebar items exist for:
- `/customs/tasks` (Gömrük tapşırıqları)
- `/declarations/unknowns` (Naməlum bəyannamələr)
- `/declarations/partners` (Partner bəyannamələr)

If any are missing, add them following the same pattern as other sidebar items in the file.

- [ ] **Final commit**

```bash
git add src/modules/layout/
git commit -m "feat(sidebar): add links for customs tasks, unknown/partner declarations"
```
