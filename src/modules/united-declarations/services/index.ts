import { ApiResult, caller, urlMaker } from '@shared/utils';
import { IDeclaration, IDeclarationPersistence } from '@modules/declarations/interfaces';
import { DeclarationMapper } from '@modules/declarations/mappers';

export const UnitedDeclarationsService = {
  getList: async (query: Record<string, any> = {}): Promise<ApiResult<200, { data: IDeclaration[]; total: number }> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/declaration/trendyol', { page: 1, per_page: 20, ...query });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        return new ApiResult(200, { data: (result.data || []).map((d: IDeclarationPersistence) => DeclarationMapper.toDomain(d)), total: result.total || 0 }, null);
      }
      return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası', null);
    }
  },
};
