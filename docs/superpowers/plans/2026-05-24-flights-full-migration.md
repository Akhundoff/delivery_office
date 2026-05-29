# Flights Full Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate all flight-related features from delivery_management into delivery_management_new — interfaces, service methods, hooks, containers, pages, routes, and table column actions.

**Architecture:** Static-method service classes + useReducer context (no react-query, no DI). New interfaces/types inline in `interfaces/flight.interface.ts` or new files. Hooks in camelCase subfolders. Containers import from hooks barrel.

**Tech Stack:** React 18 + TypeScript, Ant Design 5, React Router v6, Formik, dayjs, caller/urlMaker utilities.

---

## File Map

### Create
- `src/modules/flights/interfaces/flight-air-waybill.interface.ts`
- `src/modules/flights/interfaces/flight-package.interface.ts`
- `src/modules/flights/hooks/flightById/use-flight-by-id.ts`
- `src/modules/flights/hooks/flightById/index.ts`
- `src/modules/flights/hooks/flightAirWaybills/use-flight-air-waybills.ts`
- `src/modules/flights/hooks/flightAirWaybills/index.ts`
- `src/modules/flights/hooks/flightPackages/use-flight-packages.ts`
- `src/modules/flights/hooks/flightPackages/index.ts`
- `src/modules/flights/containers/flight-details.tsx`
- `src/modules/flights/containers/flight-air-waybills.tsx`
- `src/modules/flights/containers/flight-packages.tsx`
- `src/modules/flights/containers/update-air-waybill-modal.tsx`
- `src/modules/flights/containers/update-current-month-modal.tsx`
- `src/modules/flights/containers/upload-manifest-modal.tsx`
- `src/modules/flights/pages/flight-details.tsx`
- `src/modules/flights/pages/flight-air-waybills.tsx`
- `src/modules/flights/pages/flight-packages.tsx`
- `src/modules/flights/pages/flight-palets-by-id.tsx`

### Modify
- `src/modules/flights/interfaces/index.ts` — re-export new interface files
- `src/modules/flights/interfaces/flight.interface.ts` — add UpdateAirWaybillDto, UpdateCurrentMonthDto
- `src/modules/flights/services/index.ts` — add 9 new methods
- `src/modules/flights/hooks/index.ts` — re-export new hook subfolders
- `src/modules/flights/containers/index.ts` — re-export new containers
- `src/modules/flights/pages/index.ts` — re-export new pages
- `src/modules/flights/router/page.router.tsx` — add 4 new page routes
- `src/modules/flights/router/modal.router.tsx` — add 3 new modal routes
- `src/modules/flights/hooks/flights/use-flights-table-columns.tsx` — add 9 dropdown items

---

### Task 1: Add interfaces

**Files:**
- Create: `src/modules/flights/interfaces/flight-air-waybill.interface.ts`
- Create: `src/modules/flights/interfaces/flight-package.interface.ts`
- Modify: `src/modules/flights/interfaces/flight.interface.ts`
- Modify: `src/modules/flights/interfaces/index.ts`

- [ ] Create `flight-air-waybill.interface.ts`:
```ts
export type IFlightAirWaybill = {
  trackingNumber: string;
  airWaybillNumber: string;
  dispatchNumber: string;
  createdAt: string;
};
```

- [ ] Create `flight-package.interface.ts`:
```ts
export type IFlightPackage = {
  id: number;
  executed: boolean;
  statusCode: string;
  input: { regNumber: string; trackingNumber: string; airWaybillNumber: string; dispatchNumber: string }[];
  output: { code: string; data: { trackingNumber: string; code: string }[] };
  elapsedTime: number;
  startedAt: string;
  endedAt: string;
  createdAt: string;
};

export type IFlightPackageExecution = {
  trackingNumber: string;
  code: string;
  codeText: string;
};
```

- [ ] Add DTOs to `flight.interface.ts` (after existing CloseFlightDto):
```ts
export type UpdateAirWaybillDto = {
  id: number;
  airWaybill: string;
};

export type UpdateCurrentMonthDto = {
  id: string;
  currentMonth: Dayjs | null;
};
```

- [ ] Update `interfaces/index.ts`:
```ts
export * from './flight.interface';
export * from './flight-palet.interface';
export * from './flight-air-waybill.interface';
export * from './flight-package.interface';
```

---

### Task 2: Add service methods

**Files:**
- Modify: `src/modules/flights/services/index.ts`

- [ ] Add 9 methods to `FlightsService` (after existing `getPalets`):

```ts
getAirWaybills: async (flightId: string | number): Promise<ApiResult<200, { packages: IFlightAirWaybill[]; totalWeight: number; count: number }> | ApiResult<400 | 500, string>> => {
  const url = urlMaker('/api/admin/flights/airwaybillpackages', { flight_id: flightId });
  try {
    const response = await caller(url);
    if (response.ok) {
      const result = await response.json();
      const packages: IFlightAirWaybill[] = (result.data?.packages || []).map((item: any) => ({
        trackingNumber: item.trackinG_NO,
        airWaybillNumber: item.airwaybill,
        dispatchNumber: item.depesH_NUMBER,
        createdAt: item.depesH_DATE,
      }));
      return new ApiResult(200, { packages, totalWeight: result.data?.totalWeight || 0, count: result.data?.count || 0 }, null);
    }
    return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi.', null);
  } catch {
    return new ApiResult(500, 'Şəbəkə ilə əlaqə qurula bilmədi.', null);
  }
},

getPackages: async (flightId: string | number): Promise<ApiResult<200, IFlightPackage[]> | ApiResult<400 | 500, string>> => {
  const url = urlMaker('/api/admin/flights/packages', { flight_id: flightId });
  try {
    const response = await caller(url);
    if (response.ok) {
      const result = await response.json();
      const data: IFlightPackage[] = (result.data || []).map((item: any) => {
        const parsedJSON = JSON.parse(item.json || '[]');
        const statusCode = parseInt(item.status_code || '500');
        let parsedResponse: any = { code: statusCode, data: {} };
        if (statusCode < 500 && item.response) {
          try { parsedResponse = JSON.parse(item.response) || parsedResponse; } catch {}
        }
        return {
          id: item.id,
          executed: !!item.executed,
          statusCode: item.status_code || 'Daxil edilməyib',
          input: parsedJSON.map((i: any) => ({ regNumber: i.regNumber, trackingNumber: i.trackingNumber, airWaybillNumber: i.airWaybillNumber, dispatchNumber: i.depeshNumber })),
          output: { code: String(parsedResponse.code || ''), data: Object.entries(parsedResponse.data || {}).map(([k, v]) => ({ trackingNumber: k, code: v as string })) },
          elapsedTime: item.elapsed_time || -1,
          startedAt: item.start_date || 'Növbədədir',
          endedAt: item.end_date || 'Növbədədir',
          createdAt: item.created_at || 'Növbədədir',
        };
      });
      return new ApiResult(200, data, null);
    }
    return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi.', null);
  } catch {
    return new ApiResult(500, 'Şəbəkə ilə əlaqə qurula bilmədi.', null);
  }
},

executePackage: async (packageId: string | number): Promise<ApiResult<200, IFlightPackageExecution[]> | ApiResult<400 | 500, string>> => {
  const url = urlMaker('/api/admin/flights/execute', { queue_id: packageId });
  try {
    const response = await caller(url, { method: 'POST' });
    if (response.ok) {
      const result = await response.json();
      const data: IFlightPackageExecution[] = (result.response || []).map((item: any) => ({ trackingNumber: item.track_code, code: item.code, codeText: item.codename }));
      return new ApiResult(200, data, null);
    }
    return new ApiResult(400, 'Əməliyyat aparıla bilmədi.', null);
  } catch {
    return new ApiResult(500, 'Şəbəkə ilə əlaqə qurula bilmədi.', null);
  }
},

changeStatus: async (flightId: string | number, stateId: string | number): Promise<ApiResult<200, null> | ApiResult<400 | 500, string>> => {
  const url = urlMaker('/api/admin/flights/state_change', { state_id: stateId });
  const body = new FormData();
  body.append('flight_id', String(flightId));
  try {
    const response = await caller(url, { method: 'POST', body });
    if (response.ok) return new ApiResult(200, null, null);
    const result = await response.json();
    const msg = result.errors ? Object.values(result.errors).flat().join('. ') : 'Əməliyyat aparıla bilmədi.';
    return new ApiResult(400, msg as string, null);
  } catch {
    return new ApiResult(500, 'Şəbəkə ilə əlaqə qurula bilmədi.', null);
  }
},

changeTrendyolStatus: async (flightId: string | number, stateId: string | number): Promise<ApiResult<200, null> | ApiResult<400 | 500, string>> => {
  const url = urlMaker('/api/admin/flights/trendyol/updateStates');
  const body = new FormData();
  body.append('flight_id', String(flightId));
  body.append('state_id', String(stateId));
  try {
    const response = await caller(url, { method: 'POST', body });
    if (response.ok) return new ApiResult(200, null, null);
    const result = await response.json();
    const msg = result.errors ? Object.values(result.errors).flat().join('. ') : 'Əməliyyat aparıla bilmədi.';
    return new ApiResult(400, msg as string, null);
  } catch {
    return new ApiResult(500, 'Şəbəkə ilə əlaqə qurula bilmədi.', null);
  }
},

updateAirWaybill: async (id: number | string, airWaybill: string): Promise<ApiResult<200, null> | ApiResult<400 | 500, string>> => {
  const url = urlMaker('/api/admin/flights/airwaybill');
  const body = new FormData();
  body.append('flight_id', String(id));
  body.append('airwaybill', airWaybill);
  try {
    const response = await caller(url, { method: 'POST', body });
    if (response.ok) return new ApiResult(200, null, null);
    const result = await response.json();
    const msg = result.errors ? Object.values(result.errors).flat().join('. ') : 'Əməliyyat aparıla bilmədi.';
    return new ApiResult(400, msg as string, null);
  } catch {
    return new ApiResult(500, 'Şəbəkə ilə əlaqə qurula bilmədi.', null);
  }
},

updateCurrentMonth: async (flightId: string | number, thisMonth: string): Promise<ApiResult<200, null> | ApiResult<400 | 500, string>> => {
  const url = urlMaker('/api/admin/this_month/change');
  const body = new FormData();
  body.append('flight_id', String(flightId));
  body.append('this_month', thisMonth);
  try {
    const response = await caller(url, { method: 'POST', body });
    if (response.ok) return new ApiResult(200, null, null);
    return new ApiResult(400, 'Əməliyyat aparıla bilmədi.', null);
  } catch {
    return new ApiResult(500, 'Şəbəkə ilə əlaqə qurula bilmədi.', null);
  }
},

uploadManifest: async (flightId: string | number, file: File): Promise<ApiResult<200, { file: string; bags: { empty: number; full: number; all: number }; declarations: { found: number; notFound: number } }> | ApiResult<400 | 500, string>> => {
  const url = urlMaker('/api/admin/flights/manifests');
  const body = new FormData();
  body.append('flight_id', String(flightId));
  body.append('document_file', file);
  try {
    const response = await caller(url, { method: 'POST', body });
    if (response.ok) {
      const result = await response.json();
      return new ApiResult(200, { file: result.data.zip_url, bags: { empty: result.data.empty_bags, full: result.data.archived_bags, all: result.data.bags }, declarations: { found: result.data.found, notFound: result.data.not_found } }, null);
    }
    const result = await response.json();
    const msg = result.errors ? Object.values(result.errors).flat().join('. ') : 'Əməliyyat aparıla bilmədi.';
    return new ApiResult(400, msg as string, null);
  } catch {
    return new ApiResult(500, 'Şəbəkə ilə əlaqə qurula bilmədi.', null);
  }
},

getXML: async (flightId: string | number, options: { onlyLiquids?: boolean; partnerId?: number } = {}): Promise<ApiResult<200, Blob> | ApiResult<400 | 500, string>> => {
  const url = urlMaker('/api/admin/declaration/get_xml', { flight_id: flightId, liquid: options.onlyLiquids, partner_id: options.partnerId });
  try {
    const response = await caller(url);
    if (response.ok) {
      const blob = await response.blob();
      return new ApiResult(200, blob, null);
    }
    return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi.', null);
  } catch {
    return new ApiResult(500, 'Şəbəkə ilə əlaqə qurula bilmədi.', null);
  }
},
```

---

### Task 3: Add hooks

**Files:**
- Create: `src/modules/flights/hooks/flightById/use-flight-by-id.ts`
- Create: `src/modules/flights/hooks/flightById/index.ts`
- Create: `src/modules/flights/hooks/flightAirWaybills/use-flight-air-waybills.ts`
- Create: `src/modules/flights/hooks/flightAirWaybills/index.ts`
- Create: `src/modules/flights/hooks/flightPackages/use-flight-packages.ts`
- Create: `src/modules/flights/hooks/flightPackages/index.ts`
- Modify: `src/modules/flights/hooks/index.ts`

- [ ] `hooks/flightById/use-flight-by-id.ts`:
```ts
import { useCallback, useEffect, useState } from 'react';
import { IFlightById } from '../../interfaces';
import { FlightsService } from '../../services';

export const useFlightById = (id: string) => {
  const [data, setData] = useState<IFlightById | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await FlightsService.getById(id);
    if (result.status === 200) {
      setData(result.data as IFlightById);
    } else {
      setError(result.data as string);
    }
    setLoading(false);
  }, [id]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, fetch };
};
```

- [ ] `hooks/flightById/index.ts`:
```ts
export * from './use-flight-by-id';
```

- [ ] `hooks/flightAirWaybills/use-flight-air-waybills.ts`:
```ts
import { useCallback, useEffect, useState } from 'react';
import { IFlightAirWaybill } from '../../interfaces';
import { FlightsService } from '../../services';

export const useFlightAirWaybills = (flightId: string) => {
  const [data, setData] = useState<{ packages: IFlightAirWaybill[]; totalWeight: number; count: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await FlightsService.getAirWaybills(flightId);
    if (result.status === 200) {
      setData(result.data as any);
    } else {
      setError(result.data as string);
    }
    setLoading(false);
  }, [flightId]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error };
};
```

- [ ] `hooks/flightAirWaybills/index.ts`:
```ts
export * from './use-flight-air-waybills';
```

- [ ] `hooks/flightPackages/use-flight-packages.ts`:
```ts
import { useCallback, useEffect, useState } from 'react';
import { IFlightPackage } from '../../interfaces';
import { FlightsService } from '../../services';

export const useFlightPackages = (flightId: string) => {
  const [data, setData] = useState<IFlightPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await FlightsService.getPackages(flightId);
    if (result.status === 200) {
      setData(result.data as IFlightPackage[]);
    } else {
      setError(result.data as string);
    }
    setLoading(false);
  }, [flightId]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, fetch };
};
```

- [ ] `hooks/flightPackages/index.ts`:
```ts
export * from './use-flight-packages';
```

- [ ] Update `hooks/index.ts`:
```ts
export * from './flights';
export * from './flightPalets';
export * from './flightById';
export * from './flightAirWaybills';
export * from './flightPackages';
```

---

### Task 4: Flight details container + page

**Files:**
- Create: `src/modules/flights/containers/flight-details.tsx`
- Create: `src/modules/flights/pages/flight-details.tsx`

- [ ] Create `containers/flight-details.tsx`:
```tsx
import { FC } from 'react';
import { Button, Descriptions, Dropdown, MenuProps, Result, Space, Spin, Tag } from 'antd';
import * as Icons from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { message, Modal } from 'antd';
import { DetailActions, DetailActionCol, DetailCard, DetailCol, DetailDescriptions, DetailHeader, DetailPage, DetailRow } from '@shared/styled/detail';
import { StatusesService } from '@modules/statuses/services';
import { useFlightById } from '../hooks';
import { FlightsService } from '../services';

export const FlightDetailsContainer: FC<{ id: string }> = ({ id }) => {
  const navigate = useNavigate();
  const { data, loading, error, fetch } = useFlightById(id);

  const { data: statusesResult } = useQuery(['statuses-for-flight-detail'], () => StatusesService.getList({ per_page: 500, model_id: 8 }));
  const { data: trendyolStatusesResult } = useQuery(['trendyol-statuses-for-flight-detail'], () => StatusesService.getList({ per_page: 500, model_id: 43 }));

  const statuses = statusesResult?.status === 200 ? statusesResult.data.data : [];
  const trendyolStatuses = trendyolStatusesResult?.status === 200 ? trendyolStatusesResult.data.data : [];

  const changeStatus = (statusId: number, statusName: string) => {
    Modal.confirm({
      title: 'Diqqət',
      content: `Statusu "${statusName}" olaraq dəyişmək istədiyinizdən əminsinizmi?`,
      onOk: async () => {
        const result = await FlightsService.changeStatus(id, statusId);
        if (result.status === 200) { message.success('Status dəyişdirildi'); fetch(); }
        else message.error(result.data as string);
      },
    });
  };

  const changeTrendyolStatus = (statusId: number, statusName: string) => {
    Modal.confirm({
      title: 'Diqqət',
      content: `Trendyol statusunu "${statusName}" olaraq dəyişmək istədiyinizdən əminsinizmi?`,
      onOk: async () => {
        const result = await FlightsService.changeTrendyolStatus(id, statusId);
        if (result.status === 200) { message.success('Status dəyişdirildi'); fetch(); }
        else message.error(result.data as string);
      },
    });
  };

  const statusMenuItems: MenuProps['items'] = statuses.map((s) => ({ key: s.id, label: s.name, onClick: () => changeStatus(s.id, s.name) }));
  const trendyolStatusMenuItems: MenuProps['items'] = trendyolStatuses.map((s) => ({ key: s.id, label: s.name, onClick: () => changeTrendyolStatus(s.id, s.name) }));

  if (loading) return <DetailPage><div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><Spin size='large' /></div></DetailPage>;
  if (error || !data) return <DetailPage><Result status='500' title='Xəta baş verdi' subTitle={error || 'Məlumatlar əldə edilə bilmədi'} /></DetailPage>;

  const title = (
    <Space size={8}>
      <Icons.LeftCircleOutlined style={{ cursor: 'pointer' }} onClick={() => navigate(-1)} />
      <span>#{data.id} — {data.name}</span>
    </Space>
  );

  return (
    <DetailPage>
      <DetailRow>
        <DetailCol xs={24}>
          <DetailHeader title={title} extra={[
            <Button key='airwaybills' type='text' icon={<Icons.FieldTimeOutlined />} onClick={() => navigate(`/flights/${id}/air-waybills`)}>Depeşlər</Button>,
            <Button key='packages' type='text' icon={<Icons.UnorderedListOutlined />} onClick={() => navigate(`/flights/${id}/packages`)}>Paketlər</Button>,
            data.trendyol === 1 ? <Button key='palets' type='text' icon={<Icons.AppstoreOutlined />} onClick={() => navigate(`/flights/${id}/palets`)}>Paletlər</Button> : null,
          ].filter(Boolean)} />
        </DetailCol>
        <DetailCol xs={24}>
          <DetailActions>
            <DetailActionCol>
              <Dropdown menu={{ items: statusMenuItems }}><Button type='primary' ghost icon={<Icons.EditFilled />}>Statusu dəyiş</Button></Dropdown>
              {data.trendyol === 1 && <Dropdown menu={{ items: trendyolStatusMenuItems }}><Button type='primary' ghost icon={<Icons.EditFilled />}>Trendyol Statusu dəyiş</Button></Dropdown>}
              <Button type='primary' ghost icon={<Icons.CalendarOutlined />} onClick={() => navigate(`/flights/${id}/current-month/update`)}>Cari ayı dəyiş</Button>
              <Button type='primary' ghost icon={<Icons.UploadOutlined />} onClick={() => navigate(`/flights/${id}/manifest/upload`)}>Manifest yüklə</Button>
              {data.status.id !== 29 && <Button type='primary' ghost icon={<Icons.EditOutlined />} onClick={() => navigate(`/flights/${id}/update`)}>Düzəliş et</Button>}
            </DetailActionCol>
          </DetailActions>
        </DetailCol>
        <DetailCol xs={24} lg={12}>
          <DetailCard title='Ümumi məlumat'>
            <DetailDescriptions>
              <Descriptions.Item label='Kod'>{data.id}</Descriptions.Item>
              <Descriptions.Item label='Ad'>{data.name}</Descriptions.Item>
              <Descriptions.Item label='Başlama tarixi'>{data.startedAt || '—'}</Descriptions.Item>
              <Descriptions.Item label='Bitmə tarixi'>{data.endedAt || '—'}</Descriptions.Item>
              <Descriptions.Item label='Yaradılma tarixi'>{data.createdAt || '—'}</Descriptions.Item>
              <Descriptions.Item label='Ölkə'>{data.country?.name || '—'}</Descriptions.Item>
              <Descriptions.Item label='Status'><Tag>{data.status.name}</Tag></Descriptions.Item>
              <Descriptions.Item label='Qaimə'>{data.airwaybill || '—'}</Descriptions.Item>
              <Descriptions.Item label='Provayder'>{data.trendyol === 1 ? 'Trendyol' : data.trendyol === 2 ? 'Temu' : 'Daxili'}</Descriptions.Item>
            </DetailDescriptions>
          </DetailCard>
        </DetailCol>
        <DetailCol xs={24} lg={12}>
          <DetailCard title='Statistika'>
            <DetailDescriptions>
              <Descriptions.Item label='Bağlama sayı'>{data.total}</Descriptions.Item>
              <Descriptions.Item label='Tamamlanma'>{data.completedDeclarations}/{data.total}</Descriptions.Item>
              <Descriptions.Item label='Çəki'>{data.weight} kg</Descriptions.Item>
              <Descriptions.Item label='Həcmi çəki'>{data.volume} kg</Descriptions.Item>
              <Descriptions.Item label='Məbləğ'>{data.productPrice} ₺</Descriptions.Item>
              <Descriptions.Item label='Çat. məbləği'>{data.deliveryPrice} $</Descriptions.Item>
            </DetailDescriptions>
          </DetailCard>
        </DetailCol>
      </DetailRow>
    </DetailPage>
  );
};
```

- [ ] Create `pages/flight-details.tsx`:
```tsx
import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { FlightDetailsContainer } from '../containers';

export const FlightDetailsPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  return <FlightDetailsContainer id={id!} />;
};
```

---

### Task 5: Air waybills container + page

**Files:**
- Create: `src/modules/flights/containers/flight-air-waybills.tsx`
- Create: `src/modules/flights/pages/flight-air-waybills.tsx`

- [ ] Create `containers/flight-air-waybills.tsx`:
```tsx
import { FC, Fragment } from 'react';
import { Button, Popover, Result, Spin, Table } from 'antd';
import * as Icons from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { PageContent } from '@shared/styled/page-content';
import { useFlightAirWaybills } from '../hooks';

export const FlightAirWaybillsContainer: FC<{ id: string }> = ({ id }) => {
  const navigate = useNavigate();
  const { data, loading, error } = useFlightAirWaybills(id);

  if (loading) return <Spin style={{ display: 'block', margin: '48px auto' }} />;
  if (error) return <Result status='500' title={error} />;

  const popoverContent = data ? (
    <Fragment>
      <p>Toplam depesh sayı: {data.count} ədəd</p>
      <p>Toplam çəki: {data.totalWeight} KG</p>
    </Fragment>
  ) : null;

  return (
    <PageContent>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <Button icon={<Icons.LeftCircleOutlined />} type='text' onClick={() => navigate(`/flights/${id}`)}>Geri</Button>
        <span style={{ fontWeight: 600 }}>Uçuş #{id} — Göndərilən depeşlər</span>
        {data && <Popover content={popoverContent}><Button icon={<Icons.InfoCircleFilled />} size='small' /></Popover>}
      </div>
      <Table size='small' pagination={{ pageSize: 20 }} bordered dataSource={data?.packages || []} rowKey='trackingNumber'>
        <Table.Column dataIndex='trackingNumber' title='Tracking number' />
        <Table.Column dataIndex='dispatchNumber' title='Depesh number' />
        <Table.Column dataIndex='airWaybillNumber' title='Air waybill number' />
        <Table.Column dataIndex='createdAt' title='Tarix' />
      </Table>
    </PageContent>
  );
};
```

- [ ] Create `pages/flight-air-waybills.tsx`:
```tsx
import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { FlightAirWaybillsContainer } from '../containers';

export const FlightAirWaybillsPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  return <FlightAirWaybillsContainer id={id!} />;
};
```

---

### Task 6: Packages container + page

**Files:**
- Create: `src/modules/flights/containers/flight-packages.tsx`
- Create: `src/modules/flights/pages/flight-packages.tsx`

- [ ] Create `containers/flight-packages.tsx`:
```tsx
import { FC, useState } from 'react';
import { Button, Card, Col, Descriptions, Modal, Result, Row, Spin, Table, Tag, message } from 'antd';
import * as Icons from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { PageContent } from '@shared/styled/page-content';
import { IFlightPackage } from '../interfaces';
import { FlightsService } from '../services';
import { useFlightPackages } from '../hooks';

export const FlightPackagesContainer: FC<{ id: string }> = ({ id }) => {
  const navigate = useNavigate();
  const { data, loading, error, fetch } = useFlightPackages(id);
  const [selectedPkg, setSelectedPkg] = useState<number | undefined>();
  const [sentModal, setSentModal] = useState(false);
  const [resultModal, setResultModal] = useState(false);

  const executePackage = async (pkgId: number) => {
    message.loading({ key: 'exec', content: 'Əməliyyat aparılır...', duration: 0 });
    const result = await FlightsService.executePackage(pkgId);
    message.destroy('exec');
    if (result.status === 200) {
      fetch();
      Modal.info({
        width: 768, title: `#${pkgId} nömrəli paket`, okText: 'Bağla',
        content: (
          <Descriptions size='small' bordered column={1} style={{ marginTop: 24 }}>
            {(result.data as any[]).map((item) => (
              <Descriptions.Item key={item.trackingNumber} label={item.trackingNumber}>{item.codeText || item.code}</Descriptions.Item>
            ))}
          </Descriptions>
        ),
      });
    } else {
      message.error(result.data as string);
    }
  };

  if (loading) return <Spin style={{ display: 'block', margin: '48px auto' }} />;
  if (error) return <Result status='500' title={error} />;
  if (!data.length) return <Result status='404' title='Məlumat tapılmadı' />;

  return (
    <PageContent>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <Button icon={<Icons.LeftCircleOutlined />} type='text' onClick={() => navigate(`/flights/${id}`)}>Geri</Button>
        <span style={{ fontWeight: 600 }}>Uçuş #{id} — Bağlanma prosesi ({data.length} paket)</span>
      </div>
      <Row gutter={[16, 16]}>
        {data.map((item: IFlightPackage) => (
          <Col key={item.id} span={24} lg={8}>
            <Card
              size='small'
              title={item.executed ? <Tag color='green'>#{item.id} - İcra edilib</Tag> : <Tag color='red'>#{item.id} - İcra edilməyib</Tag>}
              type='inner'
              bodyStyle={{ padding: 0 }}
              extra={<Button icon={<Icons.ReloadOutlined />} size='small' disabled={item.executed} onClick={() => executePackage(item.id)}>İcra et</Button>}
            >
              <Descriptions size='small' bordered column={1} style={{ margin: -1 }}>
                <Descriptions.Item label='Göndərilmiş'>
                  <Button size='small' type='link' style={{ padding: 0 }} disabled={!item.input.length} onClick={() => { setSelectedPkg(item.id); setSentModal(true); }}>{item.input.length} ədəd</Button>
                </Descriptions.Item>
                <Descriptions.Item label='Qəbul edilmiş'>
                  <Button size='small' type='link' style={{ padding: 0 }} disabled={!item.output.data.length} onClick={() => { setSelectedPkg(item.id); setResultModal(true); }}>{item.output.data.filter(({ code }) => code === '200' || code === '048').length} ədəd</Button>
                </Descriptions.Item>
                <Descriptions.Item label='İcra müddəti'>{item.elapsedTime > 0 ? `${item.elapsedTime.toFixed(2)} saniyə` : 'Növbədədir'}</Descriptions.Item>
                <Descriptions.Item label='Başlama'>{item.startedAt}</Descriptions.Item>
                <Descriptions.Item label='Bitmə'>{item.endedAt}</Descriptions.Item>
                <Descriptions.Item label='Yaradılma'>{item.createdAt}</Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        ))}
      </Row>
      <Modal title='Qəbul edilmiş bağlamalar' width={576} open={resultModal} onCancel={() => setResultModal(false)} footer={null}>
        <Descriptions size='small' bordered column={1} style={{ marginTop: 24 }}>
          {data.find((i) => i.id === selectedPkg)?.output.data.map((i) => <Descriptions.Item key={i.trackingNumber} label={i.trackingNumber}>{i.code}</Descriptions.Item>)}
        </Descriptions>
      </Modal>
      <Modal title='Göndərilmiş bağlamalar' width={768} open={sentModal} onCancel={() => setSentModal(false)} footer={null}>
        <Table size='small' bordered dataSource={data.find((i) => i.id === selectedPkg)?.input} rowKey='trackingNumber' style={{ marginTop: 24 }}>
          <Table.Column title='İzləmə kodu' dataIndex='trackingNumber' />
          <Table.Column title='Air waybill' dataIndex='airWaybillNumber' />
          <Table.Column title='Depesh' dataIndex='dispatchNumber' />
          <Table.Column title='Reg nömrəsi' dataIndex='regNumber' />
        </Table>
      </Modal>
    </PageContent>
  );
};
```

- [ ] Create `pages/flight-packages.tsx`:
```tsx
import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { FlightPackagesContainer } from '../containers';

export const FlightPackagesPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  return <FlightPackagesContainer id={id!} />;
};
```

---

### Task 7: Palets-by-id page

**Files:**
- Create: `src/modules/flights/pages/flight-palets-by-id.tsx`

- [ ] Create `pages/flight-palets-by-id.tsx`:
```tsx
import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { PageContent } from '@shared/styled/page-content';
import { FlightPaletsContainer } from '../containers';

export const FlightPaletsByIdPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <PageContent>
      <FlightPaletsContainer flightId={id} />
    </PageContent>
  );
};
```

---

### Task 8: Modal containers — update air waybill, current month, upload manifest

**Files:**
- Create: `src/modules/flights/containers/update-air-waybill-modal.tsx`
- Create: `src/modules/flights/containers/update-current-month-modal.tsx`
- Create: `src/modules/flights/containers/upload-manifest-modal.tsx`

- [ ] Create `containers/update-air-waybill-modal.tsx`:
```tsx
import { FC } from 'react';
import { Form, Input, Modal, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { FlightsService } from '../services';

export const UpdateAirWaybillModal: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const { data: flightData } = useQuery(['flight-for-airwaybill', id], async () => {
    const result = await FlightsService.getById(id!);
    if (result.status === 200) return result.data;
    return null;
  }, {
    onSuccess: (data) => { if (data) form.setFieldsValue({ airWaybill: data.airwaybill || '' }); },
  });

  const onOk = async () => {
    const values = form.getFieldsValue();
    const result = await FlightsService.updateAirWaybill(id!, values.airWaybill);
    if (result.status === 200) {
      message.success('Aviaqaimə nömrəsi yeniləndi.');
      navigate(`/flights/${id}`);
    } else {
      message.error(result.data as string);
    }
  };

  return (
    <Modal open={true} onCancel={() => navigate(`/flights/${id}`)} onOk={onOk} title='Aviaqaimə nömrəsini dəyiş' okText='Yadda saxla' cancelText='Ləğv et' width={520}>
      <Form form={form} layout='vertical'>
        <Form.Item name='airWaybill' label='Aviaqaimə nömrəsi'>
          <Input placeholder='Aviaqaimə nömrəsini daxil edin...' />
        </Form.Item>
      </Form>
    </Modal>
  );
};
```

- [ ] Create `containers/update-current-month-modal.tsx`:
```tsx
import { FC } from 'react';
import { DatePicker, Form, Modal, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { FlightsService } from '../services';

export const UpdateCurrentMonthModal: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onOk = async () => {
    const values = form.getFieldsValue();
    if (!values.currentMonth) { message.error('Ay seçin'); return; }
    const thisMonth = dayjs(values.currentMonth).format('YYYY-MM');
    const result = await FlightsService.updateCurrentMonth(id!, thisMonth);
    if (result.status === 200) {
      message.success('Cari ay yeniləndi.');
      navigate(`/flights/${id}`);
    } else {
      message.error(result.data as string);
    }
  };

  return (
    <Modal open={true} onCancel={() => navigate(`/flights/${id}`)} onOk={onOk} title='Cari ayı dəyiş' okText='Yadda saxla' cancelText='Ləğv et' width={520}>
      <Form form={form} layout='vertical' initialValues={{ currentMonth: dayjs() }}>
        <Form.Item name='currentMonth' label='Cari ay'>
          <DatePicker picker='month' format='YYYY-MM' style={{ width: '100%' }} allowClear={false} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
```

- [ ] Create `containers/upload-manifest-modal.tsx`:
```tsx
import { FC, useState } from 'react';
import { Alert, Button, Col, Descriptions, Modal, Row, Upload, message } from 'antd';
import * as Icons from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { FlightsService } from '../services';

export const UploadManifestModal: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ file: string; bags: { empty: number; full: number; all: number }; declarations: { found: number; notFound: number } } | null>(null);

  const handleUpload = async (file: File) => {
    setLoading(true);
    setError(null);
    setResult(null);
    const res = await FlightsService.uploadManifest(id!, file);
    setLoading(false);
    if (res.status === 200) {
      setResult(res.data as any);
    } else {
      setError(res.data as string);
    }
    return false;
  };

  return (
    <Modal open={true} onCancel={() => navigate(`/flights/${id}`)} footer={null} title='Kisələrlə toplu manifest' width={576}>
      <Row gutter={[16, 16]}>
        {error && <Col xs={24}><Alert message={error} type='error' showIcon /></Col>}
        <Col xs={24}>
          <Upload beforeUpload={handleUpload} fileList={[]} multiple={false} disabled={loading}>
            <Button disabled={loading} loading={loading} icon={<Icons.UploadOutlined />}>Sənədi yüklə</Button>
          </Upload>
        </Col>
        {result && (
          <Col xs={24}>
            <Descriptions column={1} size='small' bordered>
              <Descriptions.Item label='Ümumi kisələr'>{result.bags.all} ədəd</Descriptions.Item>
              <Descriptions.Item label='Dolu kisələr'>{result.bags.full} ədəd</Descriptions.Item>
              <Descriptions.Item label='Boş kisələr'>{result.bags.empty} ədəd</Descriptions.Item>
              <Descriptions.Item label='Tapılan bağlamalar'>{result.declarations.found} ədəd</Descriptions.Item>
              <Descriptions.Item label='Tapılmayan bağlamalar'>{result.declarations.notFound} ədəd</Descriptions.Item>
              <Descriptions.Item label='Manifest'>
                <a href={result.file} target='_blank' rel='noopener noreferrer'>
                  <Button icon={<Icons.CloudDownloadOutlined />}>Sənədi endir</Button>
                </a>
              </Descriptions.Item>
            </Descriptions>
          </Col>
        )}
      </Row>
    </Modal>
  );
};
```

---

### Task 9: Update barrels

**Files:**
- Modify: `src/modules/flights/containers/index.ts`
- Modify: `src/modules/flights/pages/index.ts`

- [ ] Update `containers/index.ts`:
```ts
export * from './flights-table';
export * from './flights-action-bar';
export * from './create-flight';
export * from './flight-palets';
export * from './flight-details';
export * from './flight-air-waybills';
export * from './flight-packages';
export * from './update-air-waybill-modal';
export * from './update-current-month-modal';
export * from './upload-manifest-modal';
```

- [ ] Update `pages/index.ts`:
```ts
export * from './flights';
export * from './flight-palets';
export * from './flight-details';
export * from './flight-air-waybills';
export * from './flight-packages';
export * from './flight-palets-by-id';
```

---

### Task 10: Update routers

**Files:**
- Modify: `src/modules/flights/router/page.router.tsx`
- Modify: `src/modules/flights/router/modal.router.tsx`

- [ ] Update `page.router.tsx`:
```tsx
import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import { FlightsPage, FlightPaletsPage, FlightDetailsPage, FlightAirWaybillsPage, FlightPackagesPage, FlightPaletsByIdPage } from '../pages';

export const FlightsPageRouter: FC = () => (
  <Routes>
    <Route path='trendyol-cari' element={<FlightPaletsPage />} />
    <Route path=':id/air-waybills' element={<FlightAirWaybillsPage />} />
    <Route path=':id/packages' element={<FlightPackagesPage />} />
    <Route path=':id/palets' element={<FlightPaletsByIdPage />} />
    <Route path=':id' element={<FlightDetailsPage />} />
    <Route index element={<FlightsPage />} />
  </Routes>
);

export default FlightsPageRouter;
```

- [ ] Update `modal.router.tsx`:
```tsx
import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import { CreateFlight, UpdateAirWaybillModal, UpdateCurrentMonthModal, UploadManifestModal } from '../containers';

export const FlightsModalRouter: FC = () => (
  <Routes>
    <Route path='create' element={<CreateFlight />} />
    <Route path=':id/update' element={<CreateFlight />} />
    <Route path=':id/air-waybills/update' element={<UpdateAirWaybillModal />} />
    <Route path=':id/current-month/update' element={<UpdateCurrentMonthModal />} />
    <Route path=':id/manifest/upload' element={<UploadManifestModal />} />
  </Routes>
);

export default FlightsModalRouter;
```

---

### Task 11: Update table columns

**Files:**
- Modify: `src/modules/flights/hooks/flights/use-flights-table-columns.tsx`

- [ ] Replace `actionsColumn` Cell's items array with the full dropdown including all actions. The final `items` array should be:

```tsx
const navigate = useNavigate();

// inside Cell component:
const items: MenuProps['items'] = [
  {
    key: 'details',
    label: 'Ətraflı bax',
    icon: <Icons.FileSearchOutlined />,
    onClick: () => navigate(`/flights/${original.id}`),
  },
  { type: 'divider' },
  {
    key: 'declarations',
    label: 'Depeşlər',
    icon: <Icons.FieldTimeOutlined />,
    onClick: () => navigate(`/flights/${original.id}/air-waybills`),
  },
  {
    key: 'packages',
    label: 'Bağlanma prosesi',
    icon: <Icons.UnorderedListOutlined />,
    onClick: () => navigate(`/flights/${original.id}/packages`),
  },
  ...(original.trendyol === 1 ? [{
    key: 'palets',
    label: 'Paletlər',
    icon: <Icons.AppstoreOutlined />,
    onClick: () => navigate(`/flights/${original.id}/palets`),
  }] : []),
  { type: 'divider' },
  {
    key: 'edit',
    label: 'Düzəliş et',
    icon: <Icons.EditOutlined />,
    onClick: () => navigate(`/flights/${original.id}/update`, { withBackground: true }),  // NOTE: use backgroundNavigate
  },
  {
    key: 'change-status',
    label: 'Statusu dəyiş',
    icon: <Icons.CheckCircleOutlined />,
    children: statusItems,
  },
  ...(original.trendyol === 1 ? [{
    key: 'change-trendyol-status',
    label: 'Trendyol Statusu dəyiş',
    icon: <Icons.CheckCircleOutlined />,
    children: trendyolStatusItems,
  }] : []),
  {
    key: 'update-airwaybill',
    label: 'Aviaqaimə nömrəsini dəyiş',
    icon: <Icons.EditOutlined />,
    onClick: () => navigate(`/flights/${original.id}/air-waybills/update`),  // NOTE: use backgroundNavigate
  },
  {
    key: 'update-current-month',
    label: 'Cari ayı dəyiş',
    icon: <Icons.CalendarOutlined />,
    onClick: () => navigate(`/flights/${original.id}/current-month/update`),  // NOTE: use backgroundNavigate
  },
  { type: 'divider' },
  {
    key: 'manifest',
    label: 'Manifest',
    icon: <Icons.FileExcelOutlined />,
    onClick: async () => { /* existing manifest download logic */ },
  },
  {
    key: 'upload-manifest',
    label: 'Kisələrlə toplu manifest',
    icon: <Icons.UploadOutlined />,
    onClick: () => navigate(`/flights/${original.id}/manifest/upload`),  // NOTE: use backgroundNavigate
  },
  {
    key: 'xml-export',
    label: 'XML export',
    icon: <Icons.FileOutlined />,
    children: [
      { key: 'xml-liquids', label: 'Yalnız maye məhsullar', onClick: () => exportXML({ onlyLiquids: true }) },
      { key: 'xml-non-liquids', label: 'Yalnız adi məhsullar', onClick: () => exportXML({ onlyLiquids: false }) },
      { key: 'xml-all', label: 'Bütün məhsullar', onClick: () => exportXML({}) },
    ],
  },
  { type: 'divider' },
  {
    key: 'close',
    label: 'Bağla',
    icon: <Icons.LockOutlined />,
    onClick: () => { /* existing close logic */ },
  },
];
```
