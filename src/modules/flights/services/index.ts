import { ApiResult, caller, urlMaker } from '@shared/utils';
import { IFlight, IFlightById, IFlightPalet, IFlightAirWaybill, IFlightPackage, IFlightPackageExecution, CreateFlightDto, CloseFlightDto } from '../interfaces';
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

  update: async (id: string, dto: CreateFlightDto): Promise<ApiResult<200, null> | ApiResult<422, Record<string, string>> | ApiResult<400 | 500, string>> => {
    const url = urlMaker('/api/admin/flights/create');
    const body = new FormData();
    const mapped = CreateFlightDtoMapper.toPersistence(dto);
    body.append('flight_id', id);
    Object.entries(mapped).forEach(([k, v]) => body.append(k, v === null || v === undefined ? '' : String(v)));
    try {
      const response = await caller(url, { method: 'POST', body });
      if (response.ok) return new ApiResult(200, null, null);
      const result = await response.json();
      if (response.status === 400 && result.errors) {
        return new ApiResult(422, CreateFlightDtoMapper.errsToDomain(result.errors) as Record<string, string>, null);
      }
      return new ApiResult(400, 'Əməliyyat aparıla bilmədi.', null);
    } catch {
      return new ApiResult(500, 'Şəbəkə ilə əlaqə qurula bilmədi.', null);
    }
  },

  getExcel: async (flightId: number | string): Promise<ApiResult<200, Blob> | ApiResult<400 | 500, string>> => {
    const url = urlMaker('/api/admin/flights/export', { flight_id: flightId });
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

  getListExcel: async (query: Record<string, any> = {}): Promise<ApiResult<200, Blob> | ApiResult<400 | 500, string>> => {
    const url = urlMaker('/api/admin/flights/infoexport', query);
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

  getPalets: async (flightId?: string | number): Promise<ApiResult<200, IFlightPalet[]> | ApiResult<400 | 500, string>> => {
    const query = flightId !== undefined ? { flight_id: flightId } : {};
    const url = urlMaker('/api/admin/flights/boxes', query);
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        const data: IFlightPalet[] = (result.data || []).map((item: any) => ({
          id: item.id,
          box: item.box,
          totalCount: item.total_count,
          totalWeight: item.total_weight,
        }));
        return new ApiResult(200, data, null);
      }
      return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi.', null);
    } catch {
      return new ApiResult(500, 'Şəbəkə ilə əlaqə qurula bilmədi.', null);
    }
  },

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
          let parsedJSON: any[] = [];
          try { parsedJSON = JSON.parse(item.json || '[]'); } catch {}
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
      const msg = result.errors ? (Object.values(result.errors) as string[][]).flat().join('. ') : 'Əməliyyat aparıla bilmədi.';
      return new ApiResult(400, msg, null);
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
      const msg = result.errors ? (Object.values(result.errors) as string[][]).flat().join('. ') : 'Əməliyyat aparıla bilmədi.';
      return new ApiResult(400, msg, null);
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
      const msg = result.errors ? (Object.values(result.errors) as string[][]).flat().join('. ') : 'Əməliyyat aparıla bilmədi.';
      return new ApiResult(400, msg, null);
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
      const result = await response.json().catch(() => ({}));
      const msg = result.errors ? (Object.values(result.errors) as string[][]).flat().join('. ') : 'Əməliyyat aparıla bilmədi.';
      return new ApiResult(400, msg, null);
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
