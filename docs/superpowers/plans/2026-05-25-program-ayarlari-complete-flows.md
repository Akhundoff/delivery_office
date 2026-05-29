# Proqram ayarları — Complete Missing Flows

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add action columns (dropdown with edit/delete/status-change), "Yeni" action bar buttons, create/edit modals, and modal routers for the three incomplete Proqram ayarları modules: coupons, refunds, and statuses.

**Architecture:** Each module follows the warehouse pattern: service static methods → form hook (useQuery for getById + useCallback for submit) → Formik modal container → modal.router.tsx → registered in src/router/main.tsx. The action column uses Ant Design Dropdown + MenuProps items pattern (same as branches/cargoes).

**Tech Stack:** React 18, TypeScript, Formik, Ant Design 5, react-query, React Router v6, caller()/urlMaker() from @shared/utils.

---

## File Map

### Coupons
| Action | File |
|---|---|
| Modify | `src/modules/coupons/interfaces/index.ts` — add CouponType enum |
| Modify | `src/modules/coupons/services/index.ts` — add getById, create, update, changeStatus |
| Modify | `src/modules/coupons/hooks/coupons/use-coupons-table-columns.tsx` — add actionsColumn |
| Modify | `src/modules/coupons/containers/coupons-action-bar.tsx` — add "Yeni" button |
| Create | `src/modules/coupons/hooks/coupons/use-coupon-form.ts` |
| Create | `src/modules/coupons/containers/create-coupon.tsx` |
| Modify | `src/modules/coupons/containers/index.ts` — export CreateCoupon |
| Create | `src/modules/coupons/router/modal.router.tsx` |
| Modify | `src/router/main.tsx` — add CouponsModalRouter |

### Refunds
| Action | File |
|---|---|
| Create | `src/modules/cargoes/hooks/cargoes/use-cargoes.ts` — standalone select hook |
| Modify | `src/modules/cargoes/hooks/cargoes/index.ts` — export useCargoes |
| Modify | `src/modules/refunds/services/index.ts` — add getById, create, update, delete |
| Modify | `src/modules/refunds/hooks/refunds/use-refunds-table-columns.tsx` — add actionsColumn |
| Modify | `src/modules/refunds/containers/refunds-action-bar.tsx` — add "Yeni" button |
| Create | `src/modules/refunds/hooks/refunds/use-refund-form.ts` |
| Create | `src/modules/refunds/containers/create-refund.tsx` |
| Modify | `src/modules/refunds/containers/index.ts` — export CreateRefund |
| Create | `src/modules/refunds/router/modal.router.tsx` |
| Modify | `src/router/main.tsx` — add RefundsModalRouter |

### Statuses
| Action | File |
|---|---|
| Create | `src/modules/models/hooks/models/use-models.ts` — standalone list hook |
| Modify | `src/modules/models/hooks/models/index.ts` — export useModels |
| Create | `src/modules/statuses/hooks/statuses/use-statuses.ts` — standalone list hook |
| Modify | `src/modules/statuses/hooks/statuses/index.ts` — export useStatuses |
| Modify | `src/modules/statuses/services/index.ts` — add getById, create, update |
| Modify | `src/modules/statuses/hooks/statuses/use-statuses-table-columns.tsx` — add actionsColumn |
| Modify | `src/modules/statuses/containers/statuses-action-bar.tsx` — add "Yeni" button |
| Create | `src/modules/statuses/hooks/statuses/use-status-form.ts` |
| Create | `src/modules/statuses/containers/create-status.tsx` |
| Modify | `src/modules/statuses/containers/index.ts` — export CreateStatus |
| Create | `src/modules/statuses/router/modal.router.tsx` |
| Modify | `src/router/main.tsx` — add StatusesModalRouter |

---

## Task 1: Extend Coupons Service + Interface

**Files:**
- Modify: `src/modules/coupons/interfaces/index.ts`
- Modify: `src/modules/coupons/services/index.ts`

- [ ] **Step 1: Add CouponType enum and missing interface field**

Replace the entire contents of `src/modules/coupons/interfaces/index.ts` with:

```ts
export enum CouponType {
  BALANCE = 1,
  ORDER_SERVICE_PERCENT = 2,
  DELIVERY_DISCOUNT = 3,
  COURIER_DISCOUNT = 4,
}

export type ICoupon = {
  id: number;
  name: string;
  tag: string;
  couponType: number;
  amount: number;
  currency: string;
  count: number;
  description: string;
  createdAt: string;
  state: { id: number; name: string } | null;
  country: { id: number; name: string } | null;
  region: { id: number; name: string } | null;
};

export type ICouponFormValues = {
  name: string;
  tag: string;
  couponType: string;
  amount: string;
  currency: string;
  count: string;
  stateId: string;
  description: string;
};
```

- [ ] **Step 2: Add service methods to `src/modules/coupons/services/index.ts`**

Replace the entire file:

```ts
import { ApiResult, caller, urlMaker } from '@shared/utils';
import { ICoupon, ICouponFormValues } from '../interfaces';

const toDomain = (item: any): ICoupon => ({
  id: item.id,
  name: item.name,
  tag: item.tag || '',
  couponType: item.coupon_type,
  amount: item.amount,
  currency: item.currency || '',
  count: item.count || 0,
  description: item.descr || '',
  createdAt: item.created_at,
  state: item.state_id ? { id: item.state_id, name: item.state_name || '' } : null,
  country: item.country_id ? { id: item.country_id, name: item.country_name || '' } : null,
  region: item.region_id ? { id: item.region_id, name: item.region_name || '' } : null,
});

export const CouponsService = {
  getList: async (query: Record<string, any> = {}): Promise<ApiResult<200, { data: ICoupon[]; total: number }> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/coupons', { page: 1, per_page: 20, ...query });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        const data = (result.data || []).map(toDomain);
        return new ApiResult(200, { data, total: result.total || data.length }, null);
      }
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },

  getById: async (id: string | number): Promise<ApiResult<200, ICoupon> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/coupons/info', { coupon_id: id });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        return new ApiResult(200, toDomain(result.data), null);
      }
      return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },

  create: async (values: ICouponFormValues): Promise<ApiResult<200, null> | ApiResult<400 | 422, any>> => {
    const url = urlMaker('/api/admin/coupons/create');
    const body = new FormData();
    body.append('name', values.name);
    body.append('tag', values.tag);
    body.append('coupon_type', values.couponType);
    body.append('amount', values.amount);
    if (values.currency) body.append('currency', values.currency);
    body.append('count', values.count);
    if (values.stateId) body.append('state_id', values.stateId);
    body.append('descr', values.description);
    try {
      const response = await caller(url, { method: 'POST', body });
      if (response.ok) return new ApiResult(200, null, null);
      const result = await response.json();
      if (response.status === 400) return new ApiResult(422, result.errors || {}, null);
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },

  update: async (id: string | number, values: ICouponFormValues): Promise<ApiResult<200, null> | ApiResult<400 | 422, any>> => {
    const url = urlMaker('/api/admin/coupons/edit');
    const body = new FormData();
    body.append('coupon_id', String(id));
    body.append('name', values.name);
    body.append('tag', values.tag);
    body.append('coupon_type', values.couponType);
    body.append('amount', values.amount);
    if (values.currency) body.append('currency', values.currency);
    body.append('count', values.count);
    if (values.stateId) body.append('state_id', values.stateId);
    body.append('descr', values.description);
    try {
      const response = await caller(url, { method: 'POST', body });
      if (response.ok) return new ApiResult(200, null, null);
      const result = await response.json();
      if (response.status === 400) return new ApiResult(422, result.errors || {}, null);
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },

  changeStatus: async (id: string | number, stateId: number): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/coupons/editstatus', { coupon_id: id, state_id: stateId });
    try {
      const response = await caller(url, { method: 'POST' });
      if (response.ok) return new ApiResult(200, null, null);
      const result = await response.json();
      return new ApiResult(400, Object.values(result.errors || {}).flat().join('. ') || 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },
};
```

- [ ] **Step 3: Commit**

```bash
git add src/modules/coupons/interfaces/index.ts src/modules/coupons/services/index.ts
git commit -m "feat(coupons): extend interface with CouponType enum and service with CRUD + changeStatus"
```

---

## Task 2: Coupons Action Column + Action Bar "Yeni" Button

**Files:**
- Modify: `src/modules/coupons/hooks/coupons/use-coupons-table-columns.tsx`
- Modify: `src/modules/coupons/containers/coupons-action-bar.tsx`

- [ ] **Step 1: Replace `use-coupons-table-columns.tsx`**

```tsx
import { useContext, useMemo } from 'react';
import { Column } from 'react-table';
import { Button, Dropdown, MenuProps, Modal, Tag, message } from 'antd';
import * as Icons from '@ant-design/icons';

import { StopPropagation } from '@shared/components/stop-propagation';
import { nextTableColumns } from '@shared/modules/next-table/helpers/next-table-columns';
import { useBackgroundNavigate } from '@shared/hooks';

import { CouponsService } from '../../services';
import { ICoupon } from '../../interfaces';
import { CouponsTableContext } from '../../context';

export const useCouponsTableColumns = (): Column<ICoupon>[] => {
  const { handleFetch } = useContext(CouponsTableContext);
  const navigate = useBackgroundNavigate();

  const actionsColumn = useMemo<Column<ICoupon>>(
    () => ({
      ...nextTableColumns.actions,
      Cell: ({ row: { original } }: any) => {
        const isDeactivated = original.state?.id === 50;
        const items: MenuProps['items'] = [
          {
            key: 'edit',
            label: 'Düzəliş et',
            icon: <Icons.EditOutlined />,
            onClick: () => navigate(`/coupons/${original.id}/update`, { withBackground: true }),
          },
          { type: 'divider' },
          isDeactivated
            ? {
                key: 'activate',
                label: 'Aktivləşdir',
                icon: <Icons.CheckCircleOutlined />,
                onClick: () => {
                  Modal.confirm({
                    title: 'Kuponun statusunu dəyişməyə əminsinizmi?',
                    okText: 'Bəli',
                    cancelText: 'Xeyr',
                    onOk: async () => {
                      const result = await CouponsService.changeStatus(original.id, 49);
                      if (result.status === 200) {
                        handleFetch();
                      } else {
                        message.error(result.data as string);
                      }
                    },
                  });
                },
              }
            : {
                key: 'deactivate',
                label: 'Deaktivləşdir',
                icon: <Icons.CloseCircleOutlined />,
                onClick: () => {
                  Modal.confirm({
                    title: 'Kuponun statusunu dəyişməyə əminsinizmi?',
                    okText: 'Bəli',
                    cancelText: 'Xeyr',
                    onOk: async () => {
                      const result = await CouponsService.changeStatus(original.id, 50);
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

        return (
          <StopPropagation>
            <Dropdown menu={{ items }} trigger={['hover']}>
              <Button icon={<Icons.MoreOutlined />} size="small" />
            </Dropdown>
          </StopPropagation>
        );
      },
    }),
    [navigate, handleFetch],
  );

  const baseColumns = useMemo<Column<ICoupon>[]>(
    () => [
      { ...nextTableColumns.small, Header: 'Kod', id: 'id', accessor: (r) => r.id },
      { accessor: (r) => r.name, id: 'name', Header: 'Ad' },
      { accessor: (r) => r.tag, id: 'tag', Header: 'Teq' },
      { accessor: (r) => `${r.amount} ${r.currency}`, id: 'amount', Header: 'Məbləğ' },
      { accessor: (r) => r.count, id: 'count', Header: 'Limit' },
      { accessor: (r) => r.country?.name, id: 'country_name', Header: 'Ölkə' },
      {
        accessor: (r) => r.state?.name,
        id: 'state_name',
        Header: 'Status',
        Cell: ({ value }: any) => (value ? <Tag color="blue">{value}</Tag> : null),
      },
      {
        ...nextTableColumns.date,
        accessor: (r) => r.createdAt,
        id: 'created_at',
        Header: 'Tarix',
      },
    ],
    [],
  );

  return useMemo(() => [actionsColumn, ...baseColumns], [actionsColumn, baseColumns]);
};
```

- [ ] **Step 2: Replace `coupons-action-bar.tsx`**

```tsx
import { useContext } from 'react';
import { Space } from 'antd';
import * as Icons from '@ant-design/icons';
import { HeadPortal } from '@modules/layout/components/head-portal';
import { StyledHeaderButton } from '@modules/layout/styled';
import { StyledActionBar } from '@shared/styled/action-bar';
import { useBackgroundNavigate } from '@shared/hooks';
import { CouponsTableContext } from '../context';

export const CouponsActionBar = () => {
  const navigate = useBackgroundNavigate();
  const { handleFetch, handleReset } = useContext(CouponsTableContext);

  return (
    <HeadPortal>
      <StyledActionBar $flex={true}>
        <Space>
          <StyledHeaderButton
            type="text"
            onClick={() => navigate('/coupons/create', { withBackground: true })}
            icon={<Icons.PlusCircleOutlined />}
          >
            Yeni
          </StyledHeaderButton>
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

- [ ] **Step 3: Commit**

```bash
git add src/modules/coupons/hooks/coupons/use-coupons-table-columns.tsx src/modules/coupons/containers/coupons-action-bar.tsx
git commit -m "feat(coupons): add action column with edit/status-change and Yeni button"
```

---

## Task 3: Coupons Create/Edit Modal

**Files:**
- Create: `src/modules/coupons/hooks/coupons/use-coupon-form.ts`
- Create: `src/modules/coupons/containers/create-coupon.tsx`
- Modify: `src/modules/coupons/containers/index.ts`

- [ ] **Step 1: Create `src/modules/coupons/hooks/coupons/use-coupon-form.ts`**

```ts
import { useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { FormikHelpers } from 'formik';
import { message } from 'antd';

import { useBackgroundNavigate } from '@shared/hooks';
import { localURLMaker } from '@shared/utils';
import { CouponsService } from '../../services';
import { ICouponFormValues } from '../../interfaces';

const emptyValues: ICouponFormValues = {
  name: '',
  tag: '',
  couponType: '',
  amount: '',
  currency: '',
  count: '',
  stateId: '',
  description: '',
};

export const useCouponForm = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useBackgroundNavigate();

  const detail = useQuery(
    ['coupons', id],
    async () => {
      const result = await CouponsService.getById(id!);
      if (result.status === 200) return result.data;
      throw new Error(result.data as string);
    },
    { enabled: !!id },
  );

  const initialValues = useMemo<ICouponFormValues>(() => {
    if (id && detail.data) {
      const d = detail.data;
      return {
        name: d.name,
        tag: d.tag,
        couponType: String(d.couponType),
        amount: String(d.amount),
        currency: d.currency,
        count: String(d.count),
        stateId: d.state ? String(d.state.id) : '',
        description: d.description,
      };
    }
    return emptyValues;
  }, [id, detail.data]);

  const onSubmit = useCallback(
    async (values: ICouponFormValues, helpers: FormikHelpers<ICouponFormValues>) => {
      const result = id
        ? await CouponsService.update(id, values)
        : await CouponsService.create(values);

      if (result.status === 200) {
        message.success(id ? 'Dəyişikliklər saxlanıldı' : 'Kupon yaradıldı');
        navigate(localURLMaker('/coupons', {}, { reFetchCouponsTable: '1' }));
      } else if (result.status === 422) {
        const raw = result.data as Record<string, string[]>;
        const errors: Record<string, string> = {};
        Object.entries(raw).forEach(([k, v]) => {
          errors[k] = Array.isArray(v) ? v.join(', ') : String(v);
        });
        helpers.setErrors(errors);
      } else {
        message.error((result.data as string) || 'Xəta baş verdi');
      }
      helpers.setSubmitting(false);
    },
    [id, navigate],
  );

  return {
    initialValues,
    onSubmit,
    id,
    isLoading: !!id && (detail.isLoading || !detail.data),
  };
};
```

- [ ] **Step 2: Create `src/modules/coupons/containers/create-coupon.tsx`**

```tsx
import { FC } from 'react';
import { Col, Form, Modal, Row, Select, Spin } from 'antd';
import { Formik, FormikProps } from 'formik';

import { TextField, SelectField, TextAreaField } from '@shared/modules/form';
import { useCloseModal } from '@shared/hooks';

import { ICouponFormValues, CouponType } from '../interfaces';
import { useCouponForm } from '../hooks';

const CreateCouponForm: FC<FormikProps<ICouponFormValues> & { id?: string }> = ({ handleSubmit, isSubmitting, values, id }) => {
  const [closeModal] = useCloseModal();

  return (
    <Modal
      open={true}
      onOk={() => handleSubmit()}
      onCancel={() => closeModal('/coupons')}
      confirmLoading={isSubmitting}
      title={!id ? 'Yeni kupon' : 'Kuponu düzəlt'}
      okText="Yadda saxla"
      cancelText="Ləğv et"
      width={700}
    >
      <Form layout="vertical" component="div" size="large">
        <Row gutter={16}>
          <Col span={12}>
            <TextField name="name" item={{ label: 'Ad' }} input={{ placeholder: 'Kuponun adını daxil edin...' }} />
          </Col>
          <Col span={12}>
            <TextField name="tag" item={{ label: 'Teq' }} input={{ placeholder: 'Kuponu etiketi daxil edin...' }} />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <SelectField name="couponType" item={{ label: 'Kupon tipi' }} input={{ placeholder: 'Kupon tipini seçin...' }}>
              <Select.Option value={String(CouponType.BALANCE)}>Balans artımı</Select.Option>
              <Select.Option value={String(CouponType.ORDER_SERVICE_PERCENT)}>Sifariş xidmətində əlavə faiz</Select.Option>
              <Select.Option value={String(CouponType.DELIVERY_DISCOUNT)}>Çatdırılma xidmətinə endirim</Select.Option>
              <Select.Option value={String(CouponType.COURIER_DISCOUNT)}>Kuryer xidmətinə endirim</Select.Option>
            </SelectField>
          </Col>
          <Col span={12}>
            <TextField name="amount" item={{ label: 'Məbləğ / Faiz' }} input={{ placeholder: '0' }} />
          </Col>
        </Row>
        {String(values.couponType) === String(CouponType.BALANCE) && (
          <SelectField name="currency" item={{ label: 'Valyuta' }} input={{ placeholder: 'Valyuta seçin...' }}>
            <Select.Option value="TRY">Türk lirəsi (TRY)</Select.Option>
            <Select.Option value="USD">ABŞ Dolları (USD)</Select.Option>
          </SelectField>
        )}
        <Row gutter={16}>
          <Col span={12}>
            <TextField name="count" item={{ label: 'İstifadə limiti' }} input={{ placeholder: '0' }} />
          </Col>
          <Col span={12}>
            <TextField name="stateId" item={{ label: 'Status ID' }} input={{ placeholder: 'Status ID daxil edin...' }} />
          </Col>
        </Row>
        <TextAreaField name="description" item={{ label: 'Açıqlama' }} input={{ placeholder: 'Açıqlama daxil edin...' }} />
      </Form>
    </Modal>
  );
};

export const CreateCoupon: FC = () => {
  const { initialValues, onSubmit, id, isLoading } = useCouponForm();

  if (isLoading) {
    return (
      <Modal open={true} footer={null} closable={false}>
        <Spin style={{ display: 'block', padding: '40px 0', textAlign: 'center' }} />
      </Modal>
    );
  }

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit} enableReinitialize={true}>
      {(f) => <CreateCouponForm {...f} id={id} />}
    </Formik>
  );
};
```

- [ ] **Step 3: Export CreateCoupon from containers index**

Replace `src/modules/coupons/containers/index.ts`:

```ts
export { CouponsTable } from './coupons-table';
export { CouponsActionBar } from './coupons-action-bar';
export { CreateCoupon } from './create-coupon';
```

- [ ] **Step 4: Commit**

```bash
git add src/modules/coupons/hooks/coupons/use-coupon-form.ts src/modules/coupons/containers/create-coupon.tsx src/modules/coupons/containers/index.ts
git commit -m "feat(coupons): add create/edit modal form"
```

---

## Task 4: Coupons Modal Router + Register in main.tsx

**Files:**
- Create: `src/modules/coupons/router/modal.router.tsx`
- Modify: `src/router/main.tsx`

- [ ] **Step 1: Create `src/modules/coupons/router/modal.router.tsx`**

```tsx
import { Route, Routes } from 'react-router-dom';
import { CreateCoupon } from '../containers';

const CouponsModalRouter = () => (
  <Routes>
    <Route path="create" element={<CreateCoupon />} />
    <Route path=":id/update" element={<CreateCoupon />} />
  </Routes>
);

export default CouponsModalRouter;
```

- [ ] **Step 2: Register CouponsModalRouter in `src/router/main.tsx`**

Add at the top of the file with other lazy imports:
```tsx
const CouponsModalRouter = lazy(() => import('../modules/coupons/router/modal.router'));
```

Add inside the second `<Routes>` block (the modal routes section), after the `UsersModalRouter` line:
```tsx
<Route path='/coupons/*' element={<CouponsModalRouter />} />
```

- [ ] **Step 3: Commit**

```bash
git add src/modules/coupons/router/modal.router.tsx src/router/main.tsx
git commit -m "feat(coupons): add modal router and register in main router"
```

---

## Task 5: Add Standalone useCargoes Hook

**Files:**
- Create: `src/modules/cargoes/hooks/cargoes/use-cargoes.ts`
- Modify: `src/modules/cargoes/hooks/cargoes/index.ts`

- [ ] **Step 1: Create `src/modules/cargoes/hooks/cargoes/use-cargoes.ts`**

```ts
import { useQuery } from 'react-query';
import { caller, urlMaker } from '@shared/utils';

export type ICargoDrop = { id: number; name: string };

const fetchCargoes = async (): Promise<ICargoDrop[]> => {
  const url = urlMaker('/api/admin/cargoes', { page: 1, per_page: 200 });
  const response = await caller(url);
  if (!response.ok) throw new Error('Kargolar əldə edilə bilmədi');
  const result = await response.json();
  return (result.data || []).map((c: any) => ({ id: c.id, name: c.cargo_name || c.name || '' }));
};

export const useCargoes = () => {
  return useQuery<ICargoDrop[], Error>(['cargoes-select'], fetchCargoes, {
    staleTime: 5 * 60 * 1000,
  });
};
```

- [ ] **Step 2: Export from `src/modules/cargoes/hooks/cargoes/index.ts`**

Read the current file contents first, then add the export. The current file should already export `useCargoesTable` and `useCargoesTableColumns`. Append:

```ts
export { useCargoes } from './use-cargoes';
```

- [ ] **Step 3: Commit**

```bash
git add src/modules/cargoes/hooks/cargoes/use-cargoes.ts src/modules/cargoes/hooks/cargoes/index.ts
git commit -m "feat(cargoes): add standalone useCargoes hook for dropdown usage"
```

---

## Task 6: Extend Refunds Service + Add IRefundFormValues

**Files:**
- Modify: `src/modules/refunds/interfaces/index.ts`
- Modify: `src/modules/refunds/services/index.ts`

- [ ] **Step 1: Add IRefundFormValues to `src/modules/refunds/interfaces/index.ts`**

Append to the file (preserve existing `IRefund` type):

```ts
export type IRefundFormValues = {
  userId: string;
  trackCode: string;
  cargoId: string;
  direction: string;
  refundNumber: string;
  productTypeName: string;
  shopName: string;
  quantity: string;
  price: string;
  description: string;
};
```

- [ ] **Step 2: Replace `src/modules/refunds/services/index.ts`**

```ts
import { ApiResult, caller, urlMaker } from '@shared/utils';
import { IRefund, IRefundFormValues } from '../interfaces';

const toDomain = (item: any): IRefund => ({
  id: item.id,
  shopName: item.shop_name || '',
  trackCode: item.track_code || '',
  refundNumber: item.return_number || null,
  cargo: item.cargo_id && item.cargo_name ? { id: item.cargo_id, name: item.cargo_name } : null,
  user: item.user_id && item.user_name ? { id: item.user_id, name: item.user_name } : null,
  state: item.state_id && item.state_name ? { id: item.state_id, name: item.state_name } : null,
  productType: item.product_type_name ? { name: item.product_type_name } : null,
  price: item.price || null,
  quantity: item.quantity || null,
  description: item.descr || '',
  direction: item.direction || '',
  file: item.document_file || null,
  createdAt: item.created_at,
});

export const RefundsService = {
  getList: async (query: Record<string, any> = {}): Promise<ApiResult<200, { data: IRefund[]; total: number }> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/returns', { page: 1, per_page: 20, ...query });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        const data = (result.data || []).map(toDomain);
        return new ApiResult(200, { data, total: result.total || data.length }, null);
      }
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },

  getById: async (id: string | number): Promise<ApiResult<200, IRefund> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/returns/info', { return_id: id });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        return new ApiResult(200, toDomain(result.data), null);
      }
      return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },

  create: async (values: IRefundFormValues): Promise<ApiResult<200, null> | ApiResult<400 | 422, any>> => {
    const url = urlMaker('/api/admin/returns/create');
    const body = new FormData();
    if (values.userId) body.append('user_id', values.userId);
    body.append('track_code', values.trackCode);
    if (values.cargoId) body.append('cargo_id', values.cargoId);
    if (values.direction) body.append('direction', values.direction);
    if (values.refundNumber) body.append('return_number', values.refundNumber);
    if (values.productTypeName) body.append('product_type_name', values.productTypeName);
    if (values.shopName) body.append('shop_name', values.shopName);
    if (values.quantity) body.append('quantity', values.quantity);
    if (values.price) body.append('price', values.price);
    body.append('descr', values.description);
    try {
      const response = await caller(url, { method: 'POST', body });
      if (response.ok) return new ApiResult(200, null, null);
      const result = await response.json();
      if (response.status === 400) return new ApiResult(422, result.errors || {}, null);
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },

  update: async (id: string | number, values: IRefundFormValues): Promise<ApiResult<200, null> | ApiResult<400 | 422, any>> => {
    const url = urlMaker('/api/admin/returns/edit');
    const body = new FormData();
    body.append('return_id', String(id));
    if (values.userId) body.append('user_id', values.userId);
    body.append('track_code', values.trackCode);
    if (values.cargoId) body.append('cargo_id', values.cargoId);
    if (values.direction) body.append('direction', values.direction);
    if (values.refundNumber) body.append('return_number', values.refundNumber);
    if (values.productTypeName) body.append('product_type_name', values.productTypeName);
    if (values.shopName) body.append('shop_name', values.shopName);
    if (values.quantity) body.append('quantity', values.quantity);
    if (values.price) body.append('price', values.price);
    body.append('descr', values.description);
    try {
      const response = await caller(url, { method: 'POST', body });
      if (response.ok) return new ApiResult(200, null, null);
      const result = await response.json();
      if (response.status === 400) return new ApiResult(422, result.errors || {}, null);
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },

  delete: async (id: string | number): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/returns/cancel', { return_id: id });
    try {
      const response = await caller(url, { method: 'POST' });
      if (response.ok) return new ApiResult(200, null, null);
      return new ApiResult(400, 'Silinmə zamanı xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },
};
```

- [ ] **Step 3: Commit**

```bash
git add src/modules/refunds/interfaces/index.ts src/modules/refunds/services/index.ts
git commit -m "feat(refunds): add IRefundFormValues and extend service with CRUD + delete"
```

---

## Task 7: Refunds Action Column + Action Bar "Yeni" Button

**Files:**
- Modify: `src/modules/refunds/hooks/refunds/use-refunds-table-columns.tsx`
- Modify: `src/modules/refunds/containers/refunds-action-bar.tsx`

- [ ] **Step 1: Replace `use-refunds-table-columns.tsx`**

```tsx
import { useContext, useMemo } from 'react';
import { Column } from 'react-table';
import { Button, Dropdown, MenuProps, Modal, Tag, message } from 'antd';
import * as Icons from '@ant-design/icons';

import { StopPropagation } from '@shared/components/stop-propagation';
import { nextTableColumns } from '@shared/modules/next-table/helpers/next-table-columns';
import { useBackgroundNavigate } from '@shared/hooks';

import { RefundsService } from '../../services';
import { IRefund } from '../../interfaces';
import { RefundsTableContext } from '../../context';

export const useRefundsTableColumns = (): Column<IRefund>[] => {
  const { handleFetch } = useContext(RefundsTableContext);
  const navigate = useBackgroundNavigate();

  const actionsColumn = useMemo<Column<IRefund>>(
    () => ({
      ...nextTableColumns.actions,
      Cell: ({ row: { original } }: any) => {
        const items: MenuProps['items'] = [
          {
            key: 'edit',
            label: 'Düzəliş et',
            icon: <Icons.EditOutlined />,
            onClick: () => navigate(`/refunds/${original.id}/update`, { withBackground: true }),
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
                content: 'İadəni silməyə əminsinizmi?',
                okText: 'Sil',
                okType: 'danger',
                cancelText: 'Ləğv et',
                onOk: async () => {
                  const result = await RefundsService.delete(original.id);
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

        return (
          <StopPropagation>
            <Dropdown menu={{ items }} trigger={['hover']}>
              <Button icon={<Icons.MoreOutlined />} size="small" />
            </Dropdown>
          </StopPropagation>
        );
      },
    }),
    [navigate, handleFetch],
  );

  const baseColumns = useMemo<Column<IRefund>[]>(
    () => [
      { ...nextTableColumns.small, Header: 'Kod', id: 'id', accessor: (r) => r.id },
      { accessor: (r) => r.trackCode, id: 'track_code', Header: 'İzləmə kodu' },
      { accessor: (r) => r.refundNumber, id: 'return_number', Header: 'İadə №' },
      { accessor: (r) => r.user?.name, id: 'user_name', Header: 'İstifadəçi' },
      { accessor: (r) => r.shopName, id: 'shop_name', Header: 'Mağaza' },
      { accessor: (r) => r.productType?.name, id: 'product_type', Header: 'Məhsul tipi' },
      {
        accessor: (r) => r.state?.name,
        id: 'state_name',
        Header: 'Status',
        Cell: ({ value }: any) => (value ? <Tag color="orange">{value}</Tag> : null),
      },
      {
        ...nextTableColumns.date,
        accessor: (r) => r.createdAt,
        id: 'created_at',
        Header: 'Tarix',
      },
    ],
    [],
  );

  return useMemo(() => [actionsColumn, ...baseColumns], [actionsColumn, baseColumns]);
};
```

- [ ] **Step 2: Replace `refunds-action-bar.tsx`**

```tsx
import { useContext } from 'react';
import { Space } from 'antd';
import * as Icons from '@ant-design/icons';
import { HeadPortal } from '@modules/layout/components/head-portal';
import { StyledHeaderButton } from '@modules/layout/styled';
import { StyledActionBar } from '@shared/styled/action-bar';
import { useBackgroundNavigate } from '@shared/hooks';
import { RefundsTableContext } from '../context';

export const RefundsActionBar = () => {
  const navigate = useBackgroundNavigate();
  const { handleFetch, handleReset } = useContext(RefundsTableContext);

  return (
    <HeadPortal>
      <StyledActionBar $flex={true}>
        <Space>
          <StyledHeaderButton
            type="text"
            onClick={() => navigate('/refunds/create', { withBackground: true })}
            icon={<Icons.PlusCircleOutlined />}
          >
            Yeni
          </StyledHeaderButton>
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

- [ ] **Step 3: Commit**

```bash
git add src/modules/refunds/hooks/refunds/use-refunds-table-columns.tsx src/modules/refunds/containers/refunds-action-bar.tsx
git commit -m "feat(refunds): add action column with edit/delete and Yeni button"
```

---

## Task 8: Refunds Create/Edit Modal

**Files:**
- Create: `src/modules/refunds/hooks/refunds/use-refund-form.ts`
- Create: `src/modules/refunds/containers/create-refund.tsx`
- Modify: `src/modules/refunds/containers/index.ts`

- [ ] **Step 1: Create `src/modules/refunds/hooks/refunds/use-refund-form.ts`**

```ts
import { useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { FormikHelpers } from 'formik';
import { message } from 'antd';

import { useBackgroundNavigate } from '@shared/hooks';
import { localURLMaker } from '@shared/utils';
import { RefundsService } from '../../services';
import { IRefundFormValues } from '../../interfaces';

const emptyValues: IRefundFormValues = {
  userId: '',
  trackCode: '',
  cargoId: '',
  direction: '',
  refundNumber: '',
  productTypeName: '',
  shopName: '',
  quantity: '',
  price: '',
  description: '',
};

export const useRefundForm = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useBackgroundNavigate();

  const detail = useQuery(
    ['refunds', id],
    async () => {
      const result = await RefundsService.getById(id!);
      if (result.status === 200) return result.data;
      throw new Error(result.data as string);
    },
    { enabled: !!id },
  );

  const initialValues = useMemo<IRefundFormValues>(() => {
    if (id && detail.data) {
      const d = detail.data;
      return {
        userId: d.user ? String(d.user.id) : '',
        trackCode: d.trackCode,
        cargoId: d.cargo ? String(d.cargo.id) : '',
        direction: d.direction,
        refundNumber: d.refundNumber ? String(d.refundNumber) : '',
        productTypeName: d.productType?.name || '',
        shopName: d.shopName,
        quantity: d.quantity ? String(d.quantity) : '',
        price: d.price ? String(d.price) : '',
        description: d.description,
      };
    }
    return emptyValues;
  }, [id, detail.data]);

  const onSubmit = useCallback(
    async (values: IRefundFormValues, helpers: FormikHelpers<IRefundFormValues>) => {
      const result = id
        ? await RefundsService.update(id, values)
        : await RefundsService.create(values);

      if (result.status === 200) {
        message.success(id ? 'Dəyişikliklər saxlanıldı' : 'İadə yaradıldı');
        navigate(localURLMaker('/refunds', {}, { reFetchRefundsTable: '1' }));
      } else if (result.status === 422) {
        const raw = result.data as Record<string, string[]>;
        const errors: Record<string, string> = {};
        Object.entries(raw).forEach(([k, v]) => {
          errors[k] = Array.isArray(v) ? v.join(', ') : String(v);
        });
        helpers.setErrors(errors);
      } else {
        message.error((result.data as string) || 'Xəta baş verdi');
      }
      helpers.setSubmitting(false);
    },
    [id, navigate],
  );

  return {
    initialValues,
    onSubmit,
    id,
    isLoading: !!id && (detail.isLoading || !detail.data),
  };
};
```

- [ ] **Step 2: Create `src/modules/refunds/containers/create-refund.tsx`**

```tsx
import { FC } from 'react';
import { Col, Form, Modal, Row, Select, Spin } from 'antd';
import { Formik, FormikProps } from 'formik';

import { TextField, SelectField, TextAreaField } from '@shared/modules/form';
import { useCloseModal } from '@shared/hooks';
import { useCargoes } from '@modules/cargoes/hooks';

import { IRefundFormValues } from '../interfaces';
import { useRefundForm } from '../hooks';

const CreateRefundForm: FC<FormikProps<IRefundFormValues> & { id?: string }> = ({ handleSubmit, isSubmitting, id }) => {
  const [closeModal] = useCloseModal();
  const cargoes = useCargoes();

  return (
    <Modal
      open={true}
      onOk={() => handleSubmit()}
      onCancel={() => closeModal('/refunds')}
      confirmLoading={isSubmitting}
      title={!id ? 'Yeni iadə' : 'İadəni düzəlt'}
      okText="Yadda saxla"
      cancelText="Ləğv et"
      width={700}
    >
      <Form layout="vertical" component="div" size="large">
        <Row gutter={16}>
          <Col span={12}>
            <TextField name="userId" item={{ label: 'İstifadəçi ID' }} input={{ placeholder: 'İstifadəçi ID daxil edin...' }} />
          </Col>
          <Col span={12}>
            <TextField name="trackCode" item={{ label: 'İzləmə kodu' }} input={{ placeholder: 'Track kodu daxil edin...' }} />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <SelectField name="cargoId" item={{ label: 'Kargo firması' }} input={{ placeholder: 'Kargo seçin...', loading: cargoes.isLoading }}>
              {(cargoes.data || []).map((c) => (
                <Select.Option key={c.id} value={String(c.id)}>
                  {c.name}
                </Select.Option>
              ))}
            </SelectField>
          </Col>
          <Col span={12}>
            <SelectField name="direction" item={{ label: 'İstiqamət' }} input={{ placeholder: 'İstiqamət seçin...' }}>
              <Select.Option value="Azerbaijan">Azərbaycan</Select.Option>
              <Select.Option value="Türkiyə">Türkiyə</Select.Option>
            </SelectField>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <TextField name="refundNumber" item={{ label: 'İadə nömrəsi' }} input={{ placeholder: 'İadə nömrəsini daxil edin...' }} />
          </Col>
          <Col span={12}>
            <TextField name="shopName" item={{ label: 'Mağaza' }} input={{ placeholder: 'Mağaza adını daxil edin...' }} />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <TextField name="productTypeName" item={{ label: 'Məhsul tipi' }} input={{ placeholder: 'Məhsul tipini daxil edin...' }} />
          </Col>
          <Col span={12}>
            <TextField name="quantity" item={{ label: 'Say' }} input={{ placeholder: '0' }} />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <TextField name="price" item={{ label: 'Qiymət (TRY)' }} input={{ placeholder: '0.00' }} />
          </Col>
        </Row>
        <TextAreaField name="description" item={{ label: 'Açıqlama' }} input={{ placeholder: 'Açıqlama daxil edin...' }} />
      </Form>
    </Modal>
  );
};

export const CreateRefund: FC = () => {
  const { initialValues, onSubmit, id, isLoading } = useRefundForm();

  if (isLoading) {
    return (
      <Modal open={true} footer={null} closable={false}>
        <Spin style={{ display: 'block', padding: '40px 0', textAlign: 'center' }} />
      </Modal>
    );
  }

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit} enableReinitialize={true}>
      {(f) => <CreateRefundForm {...f} id={id} />}
    </Formik>
  );
};
```

- [ ] **Step 3: Export CreateRefund from containers index**

Replace `src/modules/refunds/containers/index.ts`:

```ts
export { RefundsTable } from './refunds-table';
export { RefundsActionBar } from './refunds-action-bar';
export { CreateRefund } from './create-refund';
```

- [ ] **Step 4: Also export useRefundForm from hooks index — check `src/modules/refunds/hooks/refunds/index.ts` and add the new hook**

Read current `src/modules/refunds/hooks/refunds/index.ts` to see its current exports, then add:

```ts
export { useRefundForm } from './use-refund-form';
```

- [ ] **Step 5: Commit**

```bash
git add src/modules/refunds/hooks/refunds/use-refund-form.ts src/modules/refunds/containers/create-refund.tsx src/modules/refunds/containers/index.ts src/modules/refunds/hooks/refunds/index.ts
git commit -m "feat(refunds): add create/edit modal form"
```

---

## Task 9: Refunds Modal Router + Register in main.tsx

**Files:**
- Create: `src/modules/refunds/router/modal.router.tsx`
- Modify: `src/router/main.tsx`

- [ ] **Step 1: Create `src/modules/refunds/router/modal.router.tsx`**

```tsx
import { Route, Routes } from 'react-router-dom';
import { CreateRefund } from '../containers';

const RefundsModalRouter = () => (
  <Routes>
    <Route path="create" element={<CreateRefund />} />
    <Route path=":id/update" element={<CreateRefund />} />
  </Routes>
);

export default RefundsModalRouter;
```

- [ ] **Step 2: Register RefundsModalRouter in `src/router/main.tsx`**

Add lazy import:
```tsx
const RefundsModalRouter = lazy(() => import('../modules/refunds/router/modal.router'));
```

Add route inside the modal Routes block:
```tsx
<Route path='/refunds/*' element={<RefundsModalRouter />} />
```

- [ ] **Step 3: Commit**

```bash
git add src/modules/refunds/router/modal.router.tsx src/router/main.tsx
git commit -m "feat(refunds): add modal router and register in main router"
```

---

## Task 10: Add Standalone useModels + useStatuses Hooks

**Files:**
- Create: `src/modules/models/hooks/models/use-models.ts`
- Modify: `src/modules/models/hooks/models/index.ts`
- Create: `src/modules/statuses/hooks/statuses/use-statuses.ts`
- Modify: `src/modules/statuses/hooks/statuses/index.ts`

- [ ] **Step 1: Create `src/modules/models/hooks/models/use-models.ts`**

```ts
import { useQuery } from 'react-query';
import { ModelsService } from '../../services';
import { IModel } from '../../interfaces';

export const useModels = () => {
  return useQuery<IModel[], Error>(
    ['models-list'],
    async () => {
      const result = await ModelsService.getList({ per_page: 200 });
      if (result.status === 200) return result.data.data;
      throw new Error(result.data as string);
    },
    { staleTime: 10 * 60 * 1000 },
  );
};
```

- [ ] **Step 2: Export from `src/modules/models/hooks/models/index.ts`**

Read current file contents, then add:
```ts
export { useModels } from './use-models';
```

- [ ] **Step 3: Create `src/modules/statuses/hooks/statuses/use-statuses.ts`**

```ts
import { useQuery } from 'react-query';
import { StatusesService } from '../../services';
import { IStatus } from '../../interfaces';

export const useStatuses = (params?: Record<string, any>) => {
  return useQuery<IStatus[], Error>(
    ['statuses-list', params],
    async () => {
      const result = await StatusesService.getList({ per_page: 500, ...params });
      if (result.status === 200) return result.data.data;
      throw new Error(result.data as string);
    },
    { staleTime: 5 * 60 * 1000 },
  );
};
```

- [ ] **Step 4: Export from `src/modules/statuses/hooks/statuses/index.ts`**

Read current file contents, then add:
```ts
export { useStatuses } from './use-statuses';
```

- [ ] **Step 5: Commit**

```bash
git add src/modules/models/hooks/models/use-models.ts src/modules/models/hooks/models/index.ts src/modules/statuses/hooks/statuses/use-statuses.ts src/modules/statuses/hooks/statuses/index.ts
git commit -m "feat(models,statuses): add standalone list hooks for dropdown usage"
```

---

## Task 11: Extend Statuses Service + Add IStatusFormValues

**Files:**
- Modify: `src/modules/statuses/interfaces/index.ts`
- Modify: `src/modules/statuses/services/index.ts`

- [ ] **Step 1: Add IStatusFormValues to `src/modules/statuses/interfaces/index.ts`**

Append to the file (preserve existing `IStatus` type):

```ts
export type IStatusFormValues = {
  name: string;
  nameEn: string;
  modelId: string;
  parentId: string;
  description: string;
};
```

- [ ] **Step 2: Replace `src/modules/statuses/services/index.ts`**

```ts
import { ApiResult, caller, urlMaker } from '@shared/utils';
import { IStatus, IStatusFormValues } from '../interfaces';

const toDomain = (item: any): IStatus => ({
  id: item.id,
  name: item.name,
  nameEn: item.name_en || '',
  parentId: item.parent_id || null,
  model: item.model_id ? { id: item.model_id, name: item.model_name || '' } : null,
  createdAt: item.created_at,
  description: item.descr || '',
  freely: item.freely === 1,
});

export const StatusesService = {
  getList: async (query: Record<string, any> = {}): Promise<ApiResult<200, { data: IStatus[]; total: number }> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/states/list', { page: 1, per_page: 20, ...query });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        const data = (result.data || []).map(toDomain);
        return new ApiResult(200, { data, total: result.total || data.length }, null);
      }
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },

  getById: async (id: string | number): Promise<ApiResult<200, IStatus> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/states/getinfobystateid', { state_id: id });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        return new ApiResult(200, toDomain(result.data), null);
      }
      return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },

  create: async (values: IStatusFormValues): Promise<ApiResult<200, null> | ApiResult<400 | 422, any>> => {
    const url = urlMaker('/api/admin/states/create');
    const body = new FormData();
    body.append('name', values.name);
    body.append('name_en', values.nameEn);
    if (values.modelId) body.append('model_id', values.modelId);
    if (values.parentId) body.append('parent_id', values.parentId);
    body.append('descr', values.description);
    try {
      const response = await caller(url, { method: 'POST', body });
      if (response.ok) return new ApiResult(200, null, null);
      const result = await response.json();
      if (response.status === 400) return new ApiResult(422, result.errors || {}, null);
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },

  update: async (id: string | number, values: IStatusFormValues): Promise<ApiResult<200, null> | ApiResult<400 | 422, any>> => {
    const url = urlMaker('/api/admin/states/edit');
    const body = new FormData();
    body.append('state_id', String(id));
    body.append('name', values.name);
    body.append('name_en', values.nameEn);
    if (values.modelId) body.append('model_id', values.modelId);
    if (values.parentId) body.append('parent_id', values.parentId);
    body.append('descr', values.description);
    try {
      const response = await caller(url, { method: 'POST', body });
      if (response.ok) return new ApiResult(200, null, null);
      const result = await response.json();
      if (response.status === 400) return new ApiResult(422, result.errors || {}, null);
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },
};
```

- [ ] **Step 3: Commit**

```bash
git add src/modules/statuses/interfaces/index.ts src/modules/statuses/services/index.ts
git commit -m "feat(statuses): add IStatusFormValues and extend service with getById, create, update"
```

---

## Task 12: Statuses Action Column + Action Bar "Yeni" Button

**Files:**
- Modify: `src/modules/statuses/hooks/statuses/use-statuses-table-columns.tsx`
- Modify: `src/modules/statuses/containers/statuses-action-bar.tsx`

- [ ] **Step 1: Replace `use-statuses-table-columns.tsx`**

```tsx
import { useContext, useMemo } from 'react';
import { Column } from 'react-table';
import { Button, Dropdown, MenuProps, Tag } from 'antd';
import * as Icons from '@ant-design/icons';

import { StopPropagation } from '@shared/components/stop-propagation';
import { nextTableColumns } from '@shared/modules/next-table/helpers/next-table-columns';
import { useBackgroundNavigate } from '@shared/hooks';

import { IStatus } from '../../interfaces';
import { StatusesTableContext } from '../../context';

export const useStatusesTableColumns = (): Column<IStatus>[] => {
  const { handleFetch } = useContext(StatusesTableContext);
  const navigate = useBackgroundNavigate();

  const actionsColumn = useMemo<Column<IStatus>>(
    () => ({
      ...nextTableColumns.actions,
      Cell: ({ row: { original } }: any) => {
        const items: MenuProps['items'] = [
          {
            key: 'edit',
            label: 'Düzəliş et',
            icon: <Icons.EditOutlined />,
            onClick: () => navigate(`/status/${original.id}/update`, { withBackground: true }),
          },
        ];

        return (
          <StopPropagation>
            <Dropdown menu={{ items }} trigger={['hover']}>
              <Button icon={<Icons.MoreOutlined />} size="small" />
            </Dropdown>
          </StopPropagation>
        );
      },
    }),
    [navigate, handleFetch],
  );

  const baseColumns = useMemo<Column<IStatus>[]>(
    () => [
      { ...nextTableColumns.small, Header: 'Kod', id: 'id', accessor: (r) => r.id },
      { accessor: (r) => r.name, id: 'name', Header: 'Ad' },
      { accessor: (r) => r.nameEn, id: 'name_en', Header: 'Ad (EN)' },
      { accessor: (r) => r.model?.name, id: 'model_name', Header: 'Model' },
      {
        accessor: (r) => r.freely,
        id: 'freely',
        Header: 'Sərbəst',
        Cell: ({ value }: any) => (value ? <Tag color="green">Bəli</Tag> : <Tag>Xeyr</Tag>),
      },
      {
        ...nextTableColumns.date,
        accessor: (r) => r.createdAt,
        id: 'created_at',
        Header: 'Tarix',
      },
    ],
    [],
  );

  return useMemo(() => [actionsColumn, ...baseColumns], [actionsColumn, baseColumns]);
};
```

- [ ] **Step 2: Replace `statuses-action-bar.tsx`**

```tsx
import { useContext } from 'react';
import { Space } from 'antd';
import * as Icons from '@ant-design/icons';
import { HeadPortal } from '@modules/layout/components/head-portal';
import { StyledHeaderButton } from '@modules/layout/styled';
import { StyledActionBar } from '@shared/styled/action-bar';
import { useBackgroundNavigate } from '@shared/hooks';
import { StatusesTableContext } from '../context';

export const StatusesActionBar = () => {
  const navigate = useBackgroundNavigate();
  const { handleFetch, handleReset } = useContext(StatusesTableContext);

  return (
    <HeadPortal>
      <StyledActionBar $flex={true}>
        <Space>
          <StyledHeaderButton
            type="text"
            onClick={() => navigate('/status/create', { withBackground: true })}
            icon={<Icons.PlusCircleOutlined />}
          >
            Yeni
          </StyledHeaderButton>
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

- [ ] **Step 3: Commit**

```bash
git add src/modules/statuses/hooks/statuses/use-statuses-table-columns.tsx src/modules/statuses/containers/statuses-action-bar.tsx
git commit -m "feat(statuses): add action column with edit and Yeni button"
```

---

## Task 13: Statuses Create/Edit Modal

**Files:**
- Create: `src/modules/statuses/hooks/statuses/use-status-form.ts`
- Create: `src/modules/statuses/containers/create-status.tsx`
- Modify: `src/modules/statuses/containers/index.ts`

- [ ] **Step 1: Create `src/modules/statuses/hooks/statuses/use-status-form.ts`**

```ts
import { useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { FormikHelpers } from 'formik';
import { message } from 'antd';

import { useBackgroundNavigate } from '@shared/hooks';
import { localURLMaker } from '@shared/utils';
import { StatusesService } from '../../services';
import { IStatusFormValues } from '../../interfaces';

const emptyValues: IStatusFormValues = {
  name: '',
  nameEn: '',
  modelId: '',
  parentId: '',
  description: '',
};

export const useStatusForm = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useBackgroundNavigate();

  const detail = useQuery(
    ['statuses', id],
    async () => {
      const result = await StatusesService.getById(id!);
      if (result.status === 200) return result.data;
      throw new Error(result.data as string);
    },
    { enabled: !!id },
  );

  const initialValues = useMemo<IStatusFormValues>(() => {
    if (id && detail.data) {
      const d = detail.data;
      return {
        name: d.name,
        nameEn: d.nameEn,
        modelId: d.model ? String(d.model.id) : '',
        parentId: d.parentId ? String(d.parentId) : '',
        description: d.description,
      };
    }
    return emptyValues;
  }, [id, detail.data]);

  const onSubmit = useCallback(
    async (values: IStatusFormValues, helpers: FormikHelpers<IStatusFormValues>) => {
      const result = id
        ? await StatusesService.update(id, values)
        : await StatusesService.create(values);

      if (result.status === 200) {
        message.success(id ? 'Dəyişikliklər saxlanıldı' : 'Status yaradıldı');
        navigate(localURLMaker('/status', {}, { reFetchStatusesTable: '1' }));
      } else if (result.status === 422) {
        const raw = result.data as Record<string, string[]>;
        const errors: Record<string, string> = {};
        Object.entries(raw).forEach(([k, v]) => {
          errors[k] = Array.isArray(v) ? v.join(', ') : String(v);
        });
        helpers.setErrors(errors);
      } else {
        message.error((result.data as string) || 'Xəta baş verdi');
      }
      helpers.setSubmitting(false);
    },
    [id, navigate],
  );

  return {
    initialValues,
    onSubmit,
    id,
    isLoading: !!id && (detail.isLoading || !detail.data),
  };
};
```

- [ ] **Step 2: Create `src/modules/statuses/containers/create-status.tsx`**

```tsx
import { FC } from 'react';
import { Form, Modal, Select, Spin } from 'antd';
import { Formik, FormikProps } from 'formik';

import { TextField, SelectField, TextAreaField } from '@shared/modules/form';
import { useCloseModal } from '@shared/hooks';
import { useModels } from '@modules/models/hooks';
import { useStatuses } from '../hooks';

import { IStatusFormValues } from '../interfaces';
import { useStatusForm } from '../hooks';

const CreateStatusForm: FC<FormikProps<IStatusFormValues> & { id?: string }> = ({ handleSubmit, isSubmitting, id }) => {
  const [closeModal] = useCloseModal();
  const models = useModels();
  const statuses = useStatuses();

  return (
    <Modal
      open={true}
      onOk={() => handleSubmit()}
      onCancel={() => closeModal('/status')}
      confirmLoading={isSubmitting}
      title={!id ? 'Yeni status' : 'Statusu düzəlt'}
      okText="Yadda saxla"
      cancelText="Ləğv et"
      width={600}
    >
      <Form layout="vertical" component="div" size="large">
        <TextField name="name" item={{ label: 'Ad (AZ)' }} input={{ placeholder: 'Azərbaycanca adı daxil edin...' }} />
        <TextField name="nameEn" item={{ label: 'Ad (EN)' }} input={{ placeholder: 'İngilis dilində adı daxil edin...' }} />
        <SelectField name="modelId" item={{ label: 'Model' }} input={{ placeholder: 'Model seçin...', loading: models.isLoading }}>
          {(models.data || []).map((m) => (
            <Select.Option key={m.id} value={String(m.id)}>
              #{m.id} — {m.name}
            </Select.Option>
          ))}
        </SelectField>
        <SelectField name="parentId" item={{ label: 'Valideyn statusu' }} input={{ placeholder: 'Valideyn statusu seçin...', loading: statuses.isLoading }}>
          {(statuses.data || []).map((s) => (
            <Select.Option key={s.id} value={String(s.id)}>
              #{s.id} — {s.name}
            </Select.Option>
          ))}
        </SelectField>
        <TextAreaField name="description" item={{ label: 'Açıqlama' }} input={{ placeholder: 'Açıqlama daxil edin...' }} />
      </Form>
    </Modal>
  );
};

export const CreateStatus: FC = () => {
  const { initialValues, onSubmit, id, isLoading } = useStatusForm();

  if (isLoading) {
    return (
      <Modal open={true} footer={null} closable={false}>
        <Spin style={{ display: 'block', padding: '40px 0', textAlign: 'center' }} />
      </Modal>
    );
  }

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit} enableReinitialize={true}>
      {(f) => <CreateStatusForm {...f} id={id} />}
    </Formik>
  );
};
```

- [ ] **Step 3: Export CreateStatus from containers index**

Replace `src/modules/statuses/containers/index.ts`:

```ts
export { StatusesTable } from './statuses-table';
export { StatusesActionBar } from './statuses-action-bar';
export { CreateStatus } from './create-status';
```

- [ ] **Step 4: Export useStatusForm from hooks index — check `src/modules/statuses/hooks/statuses/index.ts` and add**

Read current contents, then add:
```ts
export { useStatusForm } from './use-status-form';
```

- [ ] **Step 5: Commit**

```bash
git add src/modules/statuses/hooks/statuses/use-status-form.ts src/modules/statuses/containers/create-status.tsx src/modules/statuses/containers/index.ts src/modules/statuses/hooks/statuses/index.ts
git commit -m "feat(statuses): add create/edit modal form"
```

---

## Task 14: Statuses Modal Router + Register in main.tsx

**Files:**
- Create: `src/modules/statuses/router/modal.router.tsx`
- Modify: `src/router/main.tsx`

- [ ] **Step 1: Create `src/modules/statuses/router/modal.router.tsx`**

```tsx
import { Route, Routes } from 'react-router-dom';
import { CreateStatus } from '../containers';

const StatusesModalRouter = () => (
  <Routes>
    <Route path="create" element={<CreateStatus />} />
    <Route path=":id/update" element={<CreateStatus />} />
  </Routes>
);

export default StatusesModalRouter;
```

- [ ] **Step 2: Register StatusesModalRouter in `src/router/main.tsx`**

Add lazy import:
```tsx
const StatusesModalRouter = lazy(() => import('../modules/statuses/router/modal.router'));
```

Add route inside the modal Routes block:
```tsx
<Route path='/status/*' element={<StatusesModalRouter />} />
```

- [ ] **Step 3: Commit**

```bash
git add src/modules/statuses/router/modal.router.tsx src/router/main.tsx
git commit -m "feat(statuses): add modal router and register in main router"
```

---

## Self-Review

**Spec coverage check:**
- ✅ Coupons: action column (edit + activate/deactivate), "Yeni" button, create/edit form, service CRUD + changeStatus, modal router, main.tsx
- ✅ Refunds: action column (edit + delete), "Yeni" button, create/edit form, service CRUD + delete, modal router, main.tsx
- ✅ Statuses: action column (edit), "Yeni" button, create/edit form, service CRUD, modal router, main.tsx
- ✅ Standalone hooks added for models and statuses (needed by create-status form)
- ✅ Standalone useCargoes hook added (needed by create-refund form)

**Placeholder scan:** No TBD/TODO/placeholder patterns found.

**Type consistency:**
- `ICouponFormValues` defined in Task 1 interfaces, used in Task 1 service, Task 3 hook and container ✅
- `IRefundFormValues` defined in Task 6 interfaces, used in Task 6 service, Task 8 hook and container ✅
- `IStatusFormValues` defined in Task 11 interfaces, used in Task 11 service, Task 13 hook and container ✅
- `useCouponForm` defined in Task 3, imported in `create-coupon.tsx` via `'../hooks'` barrel ✅
- `useRefundForm` defined in Task 8, imported in `create-refund.tsx` via `'../hooks'` barrel ✅
- `useStatusForm` defined in Task 13, imported in `create-status.tsx` via `'../hooks'` barrel ✅
- `useModels` imported in `create-status.tsx` as `@modules/models/hooks` — exported from `models/hooks/models/index.ts` → `models/hooks/index.ts` ✅
- `useStatuses` imported in `create-status.tsx` as `'../hooks'` (statuses barrel) ✅
- Route paths: coupons `/coupons/*`, refunds `/refunds/*`, statuses `/status/*` — matches home router ✅
