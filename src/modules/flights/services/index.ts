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
