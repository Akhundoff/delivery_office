# Flights Module Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port the `flights` module from `delivery_management/src/@next/modules/flights/` into `delivery_management_new/src/modules/flights/` using the project's Context-based, no-DI architecture — establishing the reusable migration template for all 21 remaining missing modules.

**Architecture:** Static `FlightsService` (no Inversify) with `caller()` + `ApiResult`, one `FlightsTableContext` via `createNextTableContext()`, use-cases for table fetch, hooks in camelCase subfolders, route-based modals for create/edit via a separate `modal.router.tsx`.

**Tech Stack:** React 18, TypeScript, Ant Design 5, Formik, dayjs, react-query (for form data loading), React Router v6, react-table v7, styled-components.

**Reference files:**
- Source API logic: `delivery_management/src/@next/modules/flights/`
- Architecture pattern: `delivery_management_new/src/modules/boxes/`
- Main router to modify: `delivery_management_new/src/router/main.tsx`
- Home router to modify: `delivery_management_new/src/modules/home/router/index.tsx`

---

## File Map

| File | Action |
|------|--------|
| `src/modules/flights/interfaces/flight.interface.ts` | Create |
| `src/modules/flights/interfaces/index.ts` | Create |
| `src/modules/flights/mappers/index.ts` | Create |
| `src/modules/flights/services/index.ts` | Create |
| `src/modules/flights/context/index.ts` | Create |
| `src/modules/flights/use-cases/table-fetch.ts` | Create |
| `src/modules/flights/hooks/flights/use-flights-table-columns.tsx` | Create |
| `src/modules/flights/hooks/flights/use-flights-table.ts` | Create |
| `src/modules/flights/hooks/flights/use-flight-form.ts` | Create |
| `src/modules/flights/hooks/flights/index.ts` | Create |
| `src/modules/flights/hooks/index.ts` | Create |
| `src/modules/flights/containers/flights-table.tsx` | Create |
| `src/modules/flights/containers/flights-action-bar.tsx` | Create |
| `src/modules/flights/containers/create-flight.tsx` | Create |
| `src/modules/flights/containers/index.ts` | Create |
| `src/modules/flights/pages/flights.tsx` | Create |
| `src/modules/flights/pages/index.ts` | Create |
| `src/modules/flights/router/page.router.tsx` | Create |
| `src/modules/flights/router/modal.router.tsx` | Create |
| `src/modules/flights/index.ts` | Create |
| `src/modules/home/router/index.tsx` | Modify — add FlightsPageRouter |
| `src/router/main.tsx` | Modify — add FlightsModalRouter |

---

## Task 1: Interfaces

**Files:**
- Create: `src/modules/flights/interfaces/flight.interface.ts`
- Create: `src/modules/flights/interfaces/index.ts`

- [ ] **Step 1: Create the interfaces file**

```typescript
// src/modules/flights/interfaces/flight.interface.ts

export type IFlight = {
  id: number;
  name: string;
  startedAt: string;
  endedAt: string | null;
  declarationCount: number;
  deliveryPrice: number;
  productPrice: number;
  airwaybill: string;
  count: number;
  completedDeclarations: number;
  status: { id: number; name: string };
  country: { id: number; name: string };
  weight: number;
  trendyol?: number;
  flightProvider: string;
};

export type IFlightPersistence = {
  id: number;
  name: string;
  start_date: string;
  end_date: string | null;
  count: number;
  delivery_price: string;
  price: string;
  airwaybill: string;
  finished: number;
  state_id: number;
  state_name: string;
  country_id: number;
  country_name: string;
  total: number;
  weight: string;
  trendyol?: number;
  flight_provider: string;
};

export type IFlightById = {
  id: number;
  name: string;
  startedAt: string;
  endedAt: string | null;
  createdAt: string | null;
  total: number;
  status: { id: number; name: string };
  country: { id: number; name: string };
  completedDeclarations: number;
  airwaybill: string;
  trendyol: number;
  weight: number;
  volume: number;
  deliveryPrice: number;
  productPrice: number;
};

export type IFlightByIdPersistence = {
  id: number;
  name: string;
  price: number;
  delivery_price: number;
  start_date: string;
  end_date: string | null;
  state_id: number;
  state_name: string;
  created_at: string | null;
  total: number;
  finished: number;
  airwaybill: string;
  country_id: number;
  country_name: string;
  trendyol: number;
  weight: number;
  volume: number;
};

export type CreateFlightDto = {
  name: string;
  startedAt: import('dayjs').Dayjs;
  endedAt: import('dayjs').Dayjs | null;
  statusId: string;
  countryId: number | null;
};

export type CloseFlightDto = {
  id: string;
  airWaybillNumber: string;
  packagingLimit: string;
};
```

- [ ] **Step 2: Create the barrel**

```typescript
// src/modules/flights/interfaces/index.ts
export * from './flight.interface';
```

- [ ] **Step 3: Verify types compile**

```bash
cd /home/fared/Desktop/EASYSOFT/delivery_management_new
npx tsc --noEmit 2>&1 | grep "flights" | head -20
```

Expected: no errors referencing the flights interfaces.

- [ ] **Step 4: Commit**

```bash
git add src/modules/flights/interfaces/
git commit -m "feat(flights): add interfaces"
```

---

## Task 2: Mappers

**Files:**
- Create: `src/modules/flights/mappers/index.ts`

- [ ] **Step 1: Create mappers**

```typescript
// src/modules/flights/mappers/index.ts
import { IFlight, IFlightPersistence, IFlightById, IFlightByIdPersistence, CreateFlightDto, CloseFlightDto } from '../interfaces';
import { FormikErrors } from 'formik';

export class FlightMapper {
  public static toDomain(data: IFlightPersistence): IFlight {
    return {
      id: data.id,
      name: data.name,
      startedAt: data.start_date,
      endedAt: data.end_date,
      declarationCount: data.total,
      count: data.count,
      deliveryPrice: parseFloat(data.delivery_price),
      productPrice: parseFloat(data.price),
      airwaybill: data.airwaybill,
      completedDeclarations: data.finished,
      weight: parseFloat(data.weight),
      country: { id: data.country_id, name: data.country_name },
      status: { id: data.state_id, name: data.state_name },
      trendyol: data.trendyol,
      flightProvider: data.flight_provider,
    };
  }

  public static toDetailDomain(data: IFlightByIdPersistence): IFlightById {
    return {
      id: data.id,
      name: data.name,
      startedAt: data.start_date,
      endedAt: data.end_date,
      createdAt: data.created_at,
      total: data.total,
      status: { id: data.state_id, name: data.state_name },
      country: { id: data.country_id, name: data.country_name },
      completedDeclarations: data.finished,
      airwaybill: data.airwaybill,
      trendyol: data.trendyol,
      weight: data.weight,
      volume: data.volume,
      deliveryPrice: data.delivery_price,
      productPrice: data.price,
    };
  }
}

export class CreateFlightDtoMapper {
  public static toPersistence(dto: CreateFlightDto): Record<string, any> {
    return {
      name: dto.name,
      start_date: dto.startedAt.format('YYYY-MM-DD'),
      end_date: dto.endedAt?.format('YYYY-MM-DD') || '',
      state_id: dto.statusId,
      country_id: dto.countryId,
    };
  }

  public static errsToDomain(errors: Record<string, string[]>): FormikErrors<CreateFlightDto> {
    return {
      name: errors.name?.join('. '),
      startedAt: errors.start_date?.join('. '),
      endedAt: errors.end_date?.join('. '),
      statusId: errors.state_id?.join('. '),
      countryId: errors.country_id?.join('. '),
    };
  }
}

export class CloseFlightDtoMapper {
  public static toPersistence(dto: CloseFlightDto): Record<string, any> {
    return {
      flight_id: dto.id,
      airWaybill: dto.airWaybillNumber,
      limit: dto.packagingLimit,
    };
  }

  public static errsToDomain(errors: Record<string, string[]>): FormikErrors<CloseFlightDto> {
    return {
      id: errors.flight_id?.join('. '),
      airWaybillNumber: errors.airWaybill?.join('. '),
      packagingLimit: errors.limit?.join('. '),
    };
  }
}
```

- [ ] **Step 2: Verify types compile**

```bash
npx tsc --noEmit 2>&1 | grep "flights" | head -20
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/modules/flights/mappers/
git commit -m "feat(flights): add mappers"
```

---

## Task 3: Service

**Files:**
- Create: `src/modules/flights/services/index.ts`

- [ ] **Step 1: Create FlightsService**

```typescript
// src/modules/flights/services/index.ts
import { ApiResult, caller, urlMaker } from '@shared/utils';
import { IFlight, IFlightById, CreateFlightDto, CloseFlightDto } from '../interfaces';
import { FlightMapper, CreateFlightDtoMapper, CloseFlightDtoMapper } from '../mappers';

export const FlightsService = {
  getList: async (query: Record<string, any> = {}): Promise<ApiResult<200, { data: IFlight[]; total: number }> | ApiResult<400 | 500, string>> => {
    const url = urlMaker('/api/admin/v2/flights/list', query);
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        const data: IFlight[] = (result.data || []).map((item: any) => FlightMapper.toDomain(item));
        return new ApiResult(200, { data, total: result.total || data.length }, null);
      }
      return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi.', null);
    } catch {
      return new ApiResult(500, 'Şəbəkə ilə əlaqə qurula bilmədi.', null);
    }
  },

  getById: async (id: string | number): Promise<ApiResult<200, IFlightById> | ApiResult<400 | 500, string>> => {
    const url = urlMaker('/api/admin/flights/detail', { flight_id: id });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        return new ApiResult(200, FlightMapper.toDetailDomain(result.data), null);
      }
      return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi.', null);
    } catch {
      return new ApiResult(500, 'Şəbəkə ilə əlaqə qurula bilmədi.', null);
    }
  },

  create: async (dto: CreateFlightDto): Promise<ApiResult<200, null> | ApiResult<422, Record<string, string>> | ApiResult<400 | 500, string>> => {
    const url = urlMaker('/api/admin/flights/create');
    const body = new FormData();
    const mapped = CreateFlightDtoMapper.toPersistence(dto);
    Object.entries(mapped).forEach(([k, v]) => body.append(k, v === null || v === undefined ? '' : String(v)));
    try {
      const response = await caller(url, { method: 'POST', body });
      if (response.ok) return new ApiResult(200, null, null);
      const result = await response.json();
      // API returns HTTP 400 for validation errors (with errors field)
      if (response.status === 400 && result.errors) {
        return new ApiResult(422, CreateFlightDtoMapper.errsToDomain(result.errors) as Record<string, string>, null);
      }
      return new ApiResult(400, 'Əməliyyat aparıla bilmədi.', null);
    } catch {
      return new ApiResult(500, 'Şəbəkə ilə əlaqə qurula bilmədi.', null);
    }
  },

  close: async (dto: CloseFlightDto): Promise<ApiResult<200, null> | ApiResult<422, Record<string, string>> | ApiResult<400 | 500, string>> => {
    const url = urlMaker('/api/admin/flights/close', { close: true });
    const body = new FormData();
    const mapped = CloseFlightDtoMapper.toPersistence(dto);
    Object.entries(mapped).forEach(([k, v]) => body.append(k, v === null || v === undefined ? '' : String(v)));
    try {
      const response = await caller(url, { method: 'POST', body });
      if (response.ok) return new ApiResult(200, null, null);
      const result = await response.json();
      if (response.status === 400 && result.errors) {
        return new ApiResult(422, CloseFlightDtoMapper.errsToDomain(result.errors) as Record<string, string>, null);
      }
      return new ApiResult(400, 'Əməliyyat aparıla bilmədi.', null);
    } catch {
      return new ApiResult(500, 'Şəbəkə ilə əlaqə qurula bilmədi.', null);
    }
  },
};
```

- [ ] **Step 2: Verify types compile**

```bash
npx tsc --noEmit 2>&1 | grep "flights" | head -20
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/modules/flights/services/
git commit -m "feat(flights): add FlightsService"
```

---

## Task 4: Context + Use-Case

**Files:**
- Create: `src/modules/flights/context/index.ts`
- Create: `src/modules/flights/use-cases/table-fetch.ts`

- [ ] **Step 1: Create context**

```typescript
// src/modules/flights/context/index.ts
import { createNextTableContext } from '@shared/modules/next-table/context/context';

export const FlightsTableContext = createNextTableContext();
```

- [ ] **Step 2: Create use-case**

```typescript
// src/modules/flights/use-cases/table-fetch.ts
import { Dispatch } from 'react';
import { message } from 'antd';
import { nextTableFetchDataStartedAction, nextTableFetchDataSucceedAction, nextTableFetchDataFailedAction } from '@shared/modules/next-table/context/actions';
import { NextTableActions } from '@shared/modules/next-table/context/action-types';
import { NextTableFetchParams } from '@shared/modules/next-table/types';
import { tableQueryMaker } from '@shared/modules/next-table/utils';
import { FlightsService } from '../services';

export const flightsTableFetchUseCase = (params: NextTableFetchParams) => async (dispatch: Dispatch<NextTableActions>) => {
  dispatch(nextTableFetchDataStartedAction());
  const result = await FlightsService.getList(tableQueryMaker(params));
  if (result.status === 200) {
    dispatch(nextTableFetchDataSucceedAction({ data: result.data.data, total: result.data.total }));
  } else {
    dispatch(nextTableFetchDataFailedAction('Xəta baş verdi.'));
    message.error(result.data as string);
  }
};
```

- [ ] **Step 3: Verify types compile**

```bash
npx tsc --noEmit 2>&1 | grep "flights" | head -20
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/modules/flights/context/ src/modules/flights/use-cases/
git commit -m "feat(flights): add context and table fetch use-case"
```

---

## Task 5: Table Columns Hook

**Files:**
- Create: `src/modules/flights/hooks/flights/use-flights-table-columns.tsx`

> Note: hook lives inside `hooks/flights/` (camelCase subfolder). Import depth from here to module root is `../../`.

- [ ] **Step 1: Create columns hook**

```typescript
// src/modules/flights/hooks/flights/use-flights-table-columns.tsx
import React, { useCallback, useContext, useMemo } from 'react';
import { Button, Dropdown, MenuProps, Modal, message, Tag } from 'antd';
import * as Icons from '@ant-design/icons';
import { Column } from 'react-table';
import { StopPropagation } from '@shared/components/stop-propagation';
import { nextTableColumns } from '@shared/modules/next-table/helpers/next-table-columns';
import { useBackgroundNavigate } from '@shared/hooks';
import { IFlight } from '../../interfaces';
import { FlightsTableContext } from '../../context';
import { FlightsService } from '../../services';

export const useFlightsTableColumns = (): Column<IFlight>[] => {
  const { handleFetch } = useContext(FlightsTableContext);
  const navigate = useBackgroundNavigate();

  const actionsColumn = useMemo<Column<IFlight>>(
    () => ({
      ...nextTableColumns.actions,
      Cell: ({ row: { original } }: any) => {
        const items: MenuProps['items'] = [
          {
            key: 'edit',
            label: 'Düzəliş et',
            icon: <Icons.EditOutlined />,
            onClick: () => navigate(`/flights/${original.id}/update`, { withBackground: true }),
          },
          { type: 'divider' },
          {
            key: 'close',
            label: 'Bağla',
            icon: <Icons.LockOutlined />,
            onClick: () =>
              Modal.confirm({
                title: 'Diqqət',
                content: `"${original.name}" uçuşunu bağlamaq istədiyinizə əminsinizmi?`,
                okText: 'Bağla',
                okType: 'danger',
                cancelText: 'Ləğv et',
                onOk: async () => {
                  const result = await FlightsService.close({
                    id: String(original.id),
                    airWaybillNumber: original.airwaybill || '',
                    packagingLimit: '',
                  });
                  if (result.status === 200) {
                    message.success('Uçuş bağlandı.');
                    handleFetch();
                  } else {
                    message.error((result.data as string) || 'Xəta baş verdi.');
                  }
                },
              }),
          },
        ];

        return (
          <StopPropagation>
            <Dropdown menu={{ items }} trigger={['hover']}>
              <Button icon={<Icons.MoreOutlined />} size='small' />
            </Dropdown>
          </StopPropagation>
        );
      },
    }),
    [navigate, handleFetch],
  );

  const baseColumns = useMemo<Column<IFlight>[]>(
    () => [
      { ...nextTableColumns.small, Header: 'Kod', id: 'id', accessor: (r) => r.id },
      { accessor: (r) => r.name, id: 'name', Header: 'Ad' },
      { accessor: (r) => r.flightProvider || '—', id: 'flight_provider', Header: 'Provayder' },
      { accessor: (r) => r.airwaybill || '—', id: 'airwaybill', Header: 'Airwaybill' },
      { ...nextTableColumns.date, accessor: (r) => r.startedAt, id: 'start_date', Header: 'Başlama tarixi' },
      { ...nextTableColumns.date, accessor: (r) => r.endedAt || '—', id: 'end_date', Header: 'Bitmə tarixi' },
      { accessor: (r) => r.country?.name || '—', id: 'country_id', Header: 'Ölkə' },
      {
        accessor: (r) => r.status?.name || '—',
        id: 'state_id',
        Header: 'Status',
        Cell: ({ value }: any) => <Tag>{value}</Tag>,
      },
      { ...nextTableColumns.small, accessor: (r) => r.count, id: 'count', Header: 'Say', filterable: false },
      {
        ...nextTableColumns.small,
        accessor: (r) => `${r.completedDeclarations}/${r.declarationCount}`,
        id: 'finished',
        Header: 'Tamamlanma',
        filterable: false,
      },
      { ...nextTableColumns.small, accessor: (r) => r.weight, id: 'weight', Header: 'Çəki (kq)', filterable: false },
    ],
    [],
  );

  return useMemo(() => [actionsColumn, ...baseColumns], [actionsColumn, baseColumns]);
};
```

- [ ] **Step 2: Check StopPropagation import path**

```bash
find /home/fared/Desktop/EASYSOFT/delivery_management_new/src/shared/components -name "stop-propagation*" | head -3
```

If the file doesn't exist at `@shared/components/stop-propagation`, find its actual path and update the import in `use-flights-table-columns.tsx` accordingly.

- [ ] **Step 3: Verify types compile**

```bash
npx tsc --noEmit 2>&1 | grep "flights" | head -20
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/modules/flights/hooks/flights/use-flights-table-columns.tsx
git commit -m "feat(flights): add table columns hook"
```

---

## Task 6: Table Hook

**Files:**
- Create: `src/modules/flights/hooks/flights/use-flights-table.ts`
- Create: `src/modules/flights/hooks/flights/index.ts`

- [ ] **Step 1: Create table hook**

```typescript
// src/modules/flights/hooks/flights/use-flights-table.ts
import { useContext, useEffect } from 'react';
import { useSearchParams } from '@shared/hooks';
import { FlightsTableContext } from '../../context';
import { useFlightsTableColumns } from './use-flights-table-columns';

export const useFlightsTable = () => {
  const { handleFetch } = useContext(FlightsTableContext);
  const columns = useFlightsTableColumns();
  const { searchParams, remove } = useSearchParams<{ reFetchFlightsTable?: string }>();

  useEffect(() => {
    (async () => {
      if (searchParams.reFetchFlightsTable) {
        remove.current('reFetchFlightsTable');
        await handleFetch();
      }
    })();
  }, [handleFetch, remove, searchParams.reFetchFlightsTable]);

  return { columns };
};
```

- [ ] **Step 2: Create subfolder barrel**

```typescript
// src/modules/flights/hooks/flights/index.ts
export * from './use-flights-table-columns';
export * from './use-flights-table';
export * from './use-flight-form';
```

> Note: `use-flight-form` will be created in Task 7 — add it to the barrel now so the barrel is final.

- [ ] **Step 3: Verify types compile**

```bash
npx tsc --noEmit 2>&1 | grep "flights" | head -20
```

Expected: no errors (the missing `use-flight-form` export will error — that is expected until Task 7 is done; if it causes a blocking error, remove the `use-flight-form` export from the barrel for now and re-add it in Task 7).

- [ ] **Step 4: Commit**

```bash
git add src/modules/flights/hooks/flights/use-flights-table.ts src/modules/flights/hooks/flights/index.ts
git commit -m "feat(flights): add table hook"
```

---

## Task 7: Form Hook

**Files:**
- Create: `src/modules/flights/hooks/flights/use-flight-form.ts`

- [ ] **Step 1: Create form hook**

```typescript
// src/modules/flights/hooks/flights/use-flight-form.ts
import { useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { FormikHelpers } from 'formik';
import { message } from 'antd';
import dayjs from 'dayjs';
import { useBackgroundNavigate } from '@shared/hooks';
import { localURLMaker } from '@shared/utils';
import { FlightsService } from '../../services';
import { CreateFlightDto } from '../../interfaces';

export const useFlightForm = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useBackgroundNavigate();

  const detail = useQuery(
    ['flights', id],
    async () => {
      const result = await FlightsService.getById(id!);
      if (result.status === 200) return result.data;
      throw new Error(result.data as string);
    },
    { enabled: !!id },
  );

  const initialValues = useMemo<CreateFlightDto>(() => {
    if (id && detail.data) {
      return {
        name: detail.data.name,
        startedAt: dayjs(detail.data.startedAt),
        endedAt: detail.data.endedAt ? dayjs(detail.data.endedAt) : null,
        statusId: String(detail.data.status.id),
        countryId: detail.data.country.id,
      };
    }
    return {
      name: dayjs().format('LLLL'),
      startedAt: dayjs(),
      endedAt: null,
      statusId: '29',
      countryId: null,
    };
  }, [id, detail.data]);

  const onSubmit = useCallback(
    async (values: CreateFlightDto, helpers: FormikHelpers<CreateFlightDto>) => {
      const result = await FlightsService.create(values);

      if (result.status === 200) {
        message.success(id ? 'Dəyişikliklər saxlanıldı.' : 'Uçuş yaradıldı.');
        navigate(localURLMaker('/flights', {}, { reFetchFlightsTable: '1' }));
      } else if (result.status === 422) {
        helpers.setErrors(result.data as any);
      } else {
        message.error((result.data as string) || 'Xəta baş verdi.');
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

- [ ] **Step 2: Ensure subfolder barrel exports it**

Open `src/modules/flights/hooks/flights/index.ts` and confirm it contains:
```typescript
export * from './use-flight-form';
```
(Added in Task 6 Step 2 — verify it is present.)

- [ ] **Step 3: Verify types compile**

```bash
npx tsc --noEmit 2>&1 | grep "flights" | head -20
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/modules/flights/hooks/flights/use-flight-form.ts
git commit -m "feat(flights): add flight form hook"
```

---

## Task 8: Hooks Barrel

**Files:**
- Create: `src/modules/flights/hooks/index.ts`

- [ ] **Step 1: Create module-level hooks barrel**

```typescript
// src/modules/flights/hooks/index.ts
export * from './flights';
```

- [ ] **Step 2: Commit**

```bash
git add src/modules/flights/hooks/index.ts
git commit -m "feat(flights): add hooks barrel"
```

---

## Task 9: Table Container

**Files:**
- Create: `src/modules/flights/containers/flights-table.tsx`

- [ ] **Step 1: Create table container**

```typescript
// src/modules/flights/containers/flights-table.tsx
import { FC } from 'react';
import { NextTable } from '@shared/modules/next-table/containers';
import { FlightsTableContext } from '../context';
import { useFlightsTable } from '../hooks';

export const FlightsTable: FC = () => {
  const { columns } = useFlightsTable();
  return <NextTable context={FlightsTableContext} columns={columns} />;
};
```

- [ ] **Step 2: Verify types compile**

```bash
npx tsc --noEmit 2>&1 | grep "flights" | head -20
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/modules/flights/containers/flights-table.tsx
git commit -m "feat(flights): add FlightsTable container"
```

---

## Task 10: Action Bar Container

**Files:**
- Create: `src/modules/flights/containers/flights-action-bar.tsx`

- [ ] **Step 1: Create action bar**

```typescript
// src/modules/flights/containers/flights-action-bar.tsx
import { useContext } from 'react';
import { Space } from 'antd';
import * as Icons from '@ant-design/icons';
import { HeadPortal } from '@modules/layout/components/head-portal';
import { StyledHeaderButton } from '@modules/layout/styled';
import { StyledActionBar } from '@shared/styled/action-bar';
import { useBackgroundNavigate } from '@shared/hooks';
import { FlightsTableContext } from '../context';

export const FlightsActionBar = () => {
  const navigate = useBackgroundNavigate();
  const { handleFetch, handleReset } = useContext(FlightsTableContext);

  return (
    <HeadPortal>
      <StyledActionBar $flex={true}>
        <Space>
          <StyledHeaderButton type='text' onClick={() => navigate('/flights/create', { withBackground: true })} icon={<Icons.PlusCircleOutlined />}>
            Yeni
          </StyledHeaderButton>
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

- [ ] **Step 2: Verify imports — confirm StyledHeaderButton path**

```bash
grep -r "StyledHeaderButton" /home/fared/Desktop/EASYSOFT/delivery_management_new/src/modules/layout/styled/ 2>/dev/null | head -3
```

If `StyledHeaderButton` is not exported from `@modules/layout/styled`, find the correct export path and update the import.

- [ ] **Step 3: Verify types compile**

```bash
npx tsc --noEmit 2>&1 | grep "flights" | head -20
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/modules/flights/containers/flights-action-bar.tsx
git commit -m "feat(flights): add FlightsActionBar container"
```

---

## Task 11: Create Flight Container (Route-Based Modal)

**Files:**
- Create: `src/modules/flights/containers/create-flight.tsx`

- [ ] **Step 1: Create the container**

```typescript
// src/modules/flights/containers/create-flight.tsx
import { FC, useMemo } from 'react';
import { Form, Modal, Select, Spin } from 'antd';
import { Formik, FormikProps } from 'formik';
import { useQuery } from 'react-query';
import { TextField } from '@shared/modules/form/fields/text';
import { DateField } from '@shared/modules/form/fields/date';
import { SelectField } from '@shared/modules/form/fields/select';
import { useCloseModal } from '@shared/hooks';
import { CountriesService } from '@modules/countries/services';
import { StatusesService } from '@modules/statuses/services';
import { CreateFlightDto } from '../interfaces';
import { useFlightForm } from '../hooks';

const CreateFlightForm: FC<FormikProps<CreateFlightDto> & { id?: string }> = ({ handleSubmit, isSubmitting, id }) => {
  const [closeModal] = useCloseModal();

  const { data: countriesResult } = useQuery(['countries-for-flight'], () => CountriesService.getList({ per_page: 500 }));
  const { data: statusesResult } = useQuery(['statuses-for-flight'], () => StatusesService.getList({ per_page: 500 }));

  const countryOptions = useMemo(
    () => (countriesResult?.status === 200 ? countriesResult.data.data : []).map((c) => <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>),
    [countriesResult],
  );

  const statusOptions = useMemo(
    () => (statusesResult?.status === 200 ? statusesResult.data.data : []).map((s) => <Select.Option key={s.id} value={String(s.id)}>{s.name}</Select.Option>),
    [statusesResult],
  );

  return (
    <Modal
      open={true}
      onOk={() => handleSubmit()}
      onCancel={() => closeModal('/flights')}
      confirmLoading={isSubmitting}
      title={id ? 'Uçuşu düzəlt' : 'Yeni uçuş'}
      okText='Yadda saxla'
      cancelText='Ləğv et'
      width={520}
    >
      <Form layout='vertical' component='div' size='large'>
        <TextField name='name' item={{ label: 'Ad' }} input={{ placeholder: 'Uçuşun adını daxil edin...' }} />
        <DateField name='startedAt' item={{ label: 'Başlama tarixi' }} />
        <DateField name='endedAt' item={{ label: 'Bitmə tarixi' }} />
        <SelectField name='countryId' item={{ label: 'Ölkə' }} input={{ placeholder: 'Ölkə seçin' }}>
          {countryOptions}
        </SelectField>
        <SelectField name='statusId' item={{ label: 'Status' }} input={{ placeholder: 'Status seçin' }}>
          {statusOptions}
        </SelectField>
      </Form>
    </Modal>
  );
};

export const CreateFlight: FC = () => {
  const { initialValues, onSubmit, id, isLoading } = useFlightForm();

  if (isLoading) {
    return (
      <Modal open={true} footer={null} closable={false}>
        <Spin style={{ display: 'block', padding: '40px 0', textAlign: 'center' }} />
      </Modal>
    );
  }

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit} enableReinitialize={true}>
      {(f) => <CreateFlightForm {...f} id={id} />}
    </Formik>
  );
};
```

- [ ] **Step 2: Verify CountriesService and StatusesService import paths**

```bash
# Verify CountriesService exists
grep -r "export.*CountriesService\|export const CountriesService" /home/fared/Desktop/EASYSOFT/delivery_management_new/src/modules/countries/services/ | head -3

# Verify StatusesService exists  
grep -r "export.*StatusesService\|export const StatusesService" /home/fared/Desktop/EASYSOFT/delivery_management_new/src/modules/statuses/services/ | head -3
```

If import paths differ, update accordingly.

- [ ] **Step 3: Verify types compile**

```bash
npx tsc --noEmit 2>&1 | grep "flights" | head -20
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/modules/flights/containers/create-flight.tsx
git commit -m "feat(flights): add CreateFlight route-based modal container"
```

---

## Task 12: Containers Barrel

**Files:**
- Create: `src/modules/flights/containers/index.ts`

- [ ] **Step 1: Create barrel**

```typescript
// src/modules/flights/containers/index.ts
export * from './flights-table';
export * from './flights-action-bar';
export * from './create-flight';
```

- [ ] **Step 2: Commit**

```bash
git add src/modules/flights/containers/index.ts
git commit -m "feat(flights): add containers barrel"
```

---

## Task 13: Page

**Files:**
- Create: `src/modules/flights/pages/flights.tsx`
- Create: `src/modules/flights/pages/index.ts`

- [ ] **Step 1: Create the page**

```typescript
// src/modules/flights/pages/flights.tsx
import { FC } from 'react';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { PageContent } from '@shared/styled/page-content';
import { FlightsTableContext } from '../context';
import { flightsTableFetchUseCase } from '../use-cases/table-fetch';
import { FlightsTable, FlightsActionBar } from '../containers';

export const FlightsPage: FC = () => {
  return (
    <PageContent $contain={true}>
      <NextTableProvider context={FlightsTableContext} onFetch={flightsTableFetchUseCase} name='flights-table'>
        <FlightsActionBar />
        <FlightsTable />
      </NextTableProvider>
    </PageContent>
  );
};
```

- [ ] **Step 2: Create pages barrel**

```typescript
// src/modules/flights/pages/index.ts
export * from './flights';
```

- [ ] **Step 3: Verify types compile**

```bash
npx tsc --noEmit 2>&1 | grep "flights" | head -20
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/modules/flights/pages/
git commit -m "feat(flights): add FlightsPage"
```

---

## Task 14: Routers

**Files:**
- Create: `src/modules/flights/router/page.router.tsx`
- Create: `src/modules/flights/router/modal.router.tsx`

- [ ] **Step 1: Create page router**

```typescript
// src/modules/flights/router/page.router.tsx
import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import { FlightsPage } from '../pages';

export const FlightsPageRouter: FC = () => (
  <Routes>
    <Route index element={<FlightsPage />} />
  </Routes>
);

export default FlightsPageRouter;
```

- [ ] **Step 2: Create modal router**

```typescript
// src/modules/flights/router/modal.router.tsx
import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import { CreateFlight } from '../containers';

export const FlightsModalRouter: FC = () => (
  <Routes>
    <Route path='create' element={<CreateFlight />} />
    <Route path=':id/update' element={<CreateFlight />} />
  </Routes>
);

export default FlightsModalRouter;
```

- [ ] **Step 3: Verify types compile**

```bash
npx tsc --noEmit 2>&1 | grep "flights" | head -20
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/modules/flights/router/
git commit -m "feat(flights): add page and modal routers"
```

---

## Task 15: Module Barrel + Registration

**Files:**
- Create: `src/modules/flights/index.ts`
- Modify: `src/modules/home/router/index.tsx`
- Modify: `src/router/main.tsx`

- [ ] **Step 1: Create module barrel**

```typescript
// src/modules/flights/index.ts
export * from './hooks';
export * from './interfaces';
export * from './services';
export * from './context';
```

- [ ] **Step 2: Register page router in HomeRouter**

Open `src/modules/home/router/index.tsx`. Add `FlightsRouter` lazy import and route.

At the top, after the existing lazy imports, add:
```typescript
const FlightsRouter = lazy(() => import('../../flights/router/page.router'));
```

Inside the `<Routes>` block (before `<Route path='*' element={<Navigate to='/' replace />} />`), add:
```typescript
<Route path='/flights/*' element={<FlightsRouter />} />
```

- [ ] **Step 3: Register modal router in MainRouter**

Open `src/router/main.tsx`. Add `FlightsModalRouter` lazy import and route.

At the top, after the existing lazy modal imports (around line 29), add:
```typescript
const FlightsModalRouter = lazy(() => import('../modules/flights/router/modal.router'));
```

Inside the second `<Routes>` block (the modal Routes block, around line 56), add after `const UnitedQueuesModalRouter` route:
```typescript
<Route path='/flights/*' element={<FlightsModalRouter />} />
```

- [ ] **Step 4: Verify types compile**

```bash
npx tsc --noEmit 2>&1 | grep "flights\|home/router\|main.tsx" | head -20
```

Expected: no errors.

- [ ] **Step 5: Start dev server and verify the page loads**

```bash
npm start
```

Navigate to `http://localhost:3000/flights` in the browser.

Expected:
- Page loads without crashing
- FlightsTable renders (may show empty or loading state)
- Action bar appears with "Yeni", "Yenilə", "Sıfırla" buttons

- [ ] **Step 6: Test create modal**

Click "Yeni" in the action bar.

Expected:
- URL changes to `/flights/create` with background location state
- Modal opens over the flights list
- Form shows Ad, Başlama tarixi, Bitmə tarixi, Ölkə, Status fields
- Cancel closes modal and returns to `/flights`

- [ ] **Step 7: Commit**

```bash
git add src/modules/flights/index.ts src/modules/home/router/index.tsx src/router/main.tsx
git commit -m "feat(flights): register flights module — page and modal routers wired"
```

---

## Self-Review Checklist

Before marking this plan complete, verify:

- [ ] All `../../` import depths inside `hooks/flights/*.ts` (not `../`)
- [ ] `FlightMapper.toDomain` used in `FlightsService.getList` (not inline mapping)
- [ ] `FlightMapper.toDetailDomain` used in `FlightsService.getById`
- [ ] `useFlightsTable` correctly removes `reFetchFlightsTable` query param before re-fetching (prevents loop)
- [ ] `useFlightForm.onSubmit` calls `helpers.setSubmitting(false)` on all paths
- [ ] `CreateFlight` shows `<Spin />` while loading detail in update mode
- [ ] `FlightsModalRouter` registered in `src/router/main.tsx` (NOT inside HomeRouter)
- [ ] `FlightsPageRouter` registered in `src/modules/home/router/index.tsx` (NOT in main.tsx)

---

## Migration Template Summary

This plan establishes the pattern for all 21 remaining modules. For each new module:

1. Copy this plan structure
2. Replace `Flight`/`flights` with the new entity name
3. Adjust API endpoints from `delivery_management/src/@next/modules/{name}/repos/`
4. Adjust interfaces from `delivery_management/src/@next/modules/{name}/interfaces/`
5. Adjust mapper field names from `delivery_management/src/@next/modules/{name}/mappers/`
6. Add/remove form fields in the modal container
7. Register both routers in the same two files (`home/router/index.tsx` and `src/router/main.tsx`)
