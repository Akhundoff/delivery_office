import { ApiResult, caller, urlMaker } from '@shared/utils';
import { IStatus, IStatusFormValues, IStatusLog, IStatusMap } from '../interfaces';

const toStatusLog = (item: any): IStatusLog => ({
  id: item.id,
  status: { id: item.state_id, name: item.state_name },
  user: { id: item.user_id, name: item.user_name },
  createdAt: item.created_at,
});

const toStatusMap = (item: any): IStatusMap => ({
  id: item.id,
  descr: item.descr,
  createdAt: item.created_at,
  state: { id: item.state_id, name: item.state_name },
  user: { id: item.user_id, name: item.user_name },
});

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

  getByModelId: async (modelId: string | number): Promise<ApiResult<200, IStatus[]> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/states/getlistbymodelid', { model_id: modelId });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        const data = (result.data || []).map(toDomain);
        return new ApiResult(200, data, null);
      }
      return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },

  getHistory: async (params: { modelId: string | number; objectId: string | number }): Promise<ApiResult<200, IStatusLog[]> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/states/history', { model_id: params.modelId, objectId: params.objectId });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        const data = (result.data || []).map(toStatusLog);
        return new ApiResult(200, data, null);
      }
      return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },

  getStatusMap: async (params: { modelId: string | number; objectId: string | number }): Promise<ApiResult<200, IStatusMap[]> | ApiResult<400, string>> => {
    const url = urlMaker('/api/client/get_status_map', { model_id: params.modelId, object_id: params.objectId });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        const data = (result.data || result || []).map(toStatusMap);
        return new ApiResult(200, data, null);
      }
      return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },
};
