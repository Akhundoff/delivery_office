import { ApiResult, caller, urlMaker } from '@shared/utils';
import { IUnitedReturn, IUnitedReturnFormValues } from '../interfaces';

const toDomain = (r: any): IUnitedReturn => ({
  id: r.id,
  barcode: r.barcode || '',
  weight: r.weight || '',
  state: { id: r.state_id ?? r.state?.id ?? null, name: r.state?.name ?? r.state_name ?? '' },
  branch: { id: r.branch_id ?? r.branch?.id ?? null, name: r.branch?.name ?? r.branch_name ?? '' },
  labelUrl: r.label_url || '',
  note: r.note || '',
  createdAt: r.created_at || '',
});

export const UnitedReturnsService = {
  getList: async (query: Record<string, any> = {}): Promise<ApiResult<200, { data: IUnitedReturn[]; total: number }> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/united_returns', { page: 1, per_page: 20, ...query });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        return new ApiResult(200, { data: (result.data || []).map(toDomain), total: result.meta?.total ?? result.total ?? 0 }, null);
      }
      return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası', null);
    }
  },

  getById: async (id: string | number): Promise<ApiResult<200, IUnitedReturn> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/united_returns/info', { id });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        return new ApiResult(200, toDomain(result.data ?? {}), null);
      }
      return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası', null);
    }
  },

  create: async (values: IUnitedReturnFormValues, id?: string | number): Promise<ApiResult<200, { labelUrl: string; message: string }> | ApiResult<400 | 422, any>> => {
    const url = urlMaker(id ? `/api/admin/united_returns/${id}` : '/api/admin/united_returns');
    const body = new FormData();
    body.append('barcode', values.barcode);
    body.append('weight', values.weight);
    try {
      const response = await caller(url, { method: 'POST', body });
      const result = await response.json().catch(() => ({}));
      if (response.ok) return new ApiResult(200, { labelUrl: result.label_url || '', message: result.message || 'Əməliyyat uğurla tamamlandı' }, null);
      if (response.status === 422) return new ApiResult(422, result.errors || {}, null);
      return new ApiResult(400, result?.message || 'Məlumatlar əldə edilə bilmədi', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası', null);
    }
  },

  changeStatus: async (id: string, params: { stateId: string | number; transfer: '0' | '1' }): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
    const url = urlMaker(`/api/admin/united_returns/${id}/update-status`);
    const body = new FormData();
    body.append('state_id', String(params.stateId));
    body.append('transfer', params.transfer);
    try {
      const response = await caller(url, { method: 'POST', body });
      if (response.ok) return new ApiResult(200, null, null);
      const result = await response.json().catch(() => ({}));
      if (response.status === 422) return new ApiResult(400, Object.values(result.errors || {}).flat().join(', ') || 'Məlumatlar əldə edilə bilmədi', null);
      return new ApiResult(400, result?.message || 'Məlumatlar əldə edilə bilmədi', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası', null);
    }
  },

  finish: async (): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/united_returns/finish');
    try {
      const response = await caller(url, { method: 'POST' });
      if (response.ok) return new ApiResult(200, null, null);
      const result = await response.json().catch(() => ({}));
      return new ApiResult(400, result?.message || 'Məlumatlar əldə edilə bilmədi', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası', null);
    }
  },

  getExcel: async (query: Record<string, any> = {}): Promise<ApiResult<200, Blob> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/united_returns/export', query);
    try {
      const response = await caller(url);
      if (response.ok) {
        const blob = await response.blob();
        return new ApiResult(200, blob, null);
      }
      return new ApiResult(400, 'Export uğursuz oldu', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası', null);
    }
  },
};
