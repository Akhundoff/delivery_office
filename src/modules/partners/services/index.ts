import { ApiResult, caller, urlMaker } from '@shared/utils';
import { IPartner } from '../interfaces';
import { PartnerMapper } from '../mappers';

export const PartnersService = {
  getPartners: async (): Promise<ApiResult<200, IPartner[]> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/partners');
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        const data = (result.data || []).map(PartnerMapper.toDomain);
        return new ApiResult(200, data, null);
      }
      return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },
};
