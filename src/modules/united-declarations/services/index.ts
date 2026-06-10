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

  bulkUpdateStatus: async (query: Record<string, any>, statusId: string | number): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/v2/declaration/edit/state', { ...query, new_state_id: statusId });
    try {
      const response = await caller(url, { method: 'POST' });
      if (response.ok) return new ApiResult(200, null, null);
      return new ApiResult(400, 'Əməliyyat uğursuz oldu', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası', null);
    }
  },

  updateStatus: async (ids: (string | number)[], statusId: string | number): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
    const params = ids.reduce<Record<string, any>>((acc, id) => ({ ...acc, 'declaration_id[]': [...(acc['declaration_id[]'] || []), id] }), {});
    const url = urlMaker('/api/admin/declaration/edit/state', { ...params, state_id: statusId });
    try {
      const response = await caller(url, { method: 'POST' });
      if (response.ok) return new ApiResult(200, null, null);
      return new ApiResult(400, 'Əməliyyat uğursuz oldu', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası', null);
    }
  },

  bulkUpdateTrendyolStatus: async (query: Record<string, any>, statusId: string | number): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/declaration/trendyol/updateState', { ...query, trendyol_state_id: statusId, filter: 1 });
    try {
      const response = await caller(url, { method: 'POST' });
      if (response.ok) return new ApiResult(200, null, null);
      return new ApiResult(400, 'Əməliyyat uğursuz oldu', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası', null);
    }
  },

  changeTrendyolStatus: async (ids: (string | number)[], statusId: string | number): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/declaration/trendyol/updateState');
    try {
      const formData = new FormData();
      ids.forEach((id) => formData.append('declaration_id[]', String(id)));
      formData.append('trendyol_state_id', String(statusId));
      formData.append('filter', '0');
      const response = await caller(url, { method: 'POST', body: formData });
      if (response.ok) return new ApiResult(200, null, null);
      return new ApiResult(400, 'Əməliyyat uğursuz oldu', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası', null);
    }
  },

  getExport: async (query: Record<string, any>): Promise<ApiResult<200, IDeclaration[]> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/declaration/trendyol', { ...query, per_page: 500 });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        return new ApiResult(200, (result.data || []).map((d: IDeclarationPersistence) => DeclarationMapper.toDomain(d)), null);
      }
      return new ApiResult(400, 'Export uğursuz oldu', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası', null);
    }
  },
};
