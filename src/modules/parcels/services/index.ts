import { ApiResult, caller, urlMaker } from '@shared/utils';
import { IParcel } from '../interfaces';
import { ParcelMapper } from '../mappers';

export const ParcelsService = {
  getParcels: async (query: Record<string, any> = {}): Promise<ApiResult<200, IParcel[]> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/boxes/options', { page: 1, per_page: 10000, ...query });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        const list = Array.isArray(result) ? result : result.data || [];
        const data = list.map(ParcelMapper.toDomain);
        return new ApiResult(200, data, null);
      }
      return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },
};
