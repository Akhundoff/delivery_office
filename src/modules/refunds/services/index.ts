import { ApiResult, caller, urlMaker } from '@shared/utils';
import { IRefund, IRefundFormValues } from '../interfaces';

const toDomain = (item: any): IRefund => ({
  id: item.id,
  shopName: item.shop_name || '',
  trackCode: item.track_code || '',
  refundNumber: item.return_number || null,
  cargo: item.cargo_id && item.cargo_name ? { id: item.cargo_id, name: item.cargo_name } : null,
  user: item.user_id && item.user_name ? { id: item.user_id, name: item.user_name } : null,
  state: item.state_id && item.state_name ? { id: item.state_id, name: item.state_name } : null,
  productType: item.product_type_name ? { name: item.product_type_name } : null,
  price: item.price || null,
  quantity: item.quantity || null,
  description: item.descr || '',
  direction: item.direction || '',
  file: item.document_file || null,
  createdAt: item.created_at,
});

export const RefundsService = {
  getList: async (query: Record<string, any> = {}): Promise<ApiResult<200, { data: IRefund[]; total: number }> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/returns', { page: 1, per_page: 20, ...query });
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

  getById: async (id: string | number): Promise<ApiResult<200, IRefund> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/returns/info', { return_id: id });
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

  create: async (values: IRefundFormValues): Promise<ApiResult<200, null> | ApiResult<400 | 422, any>> => {
    const url = urlMaker('/api/admin/returns/create');
    const body = new FormData();
    if (values.userId) body.append('user_id', values.userId);
    body.append('track_code', values.trackCode);
    if (values.cargoId) body.append('cargo_id', values.cargoId);
    if (values.direction) body.append('direction', values.direction);
    if (values.refundNumber) body.append('return_number', values.refundNumber);
    if (values.productTypeName) body.append('product_type_name', values.productTypeName);
    if (values.shopName) body.append('shop_name', values.shopName);
    if (values.quantity) body.append('quantity', values.quantity);
    if (values.price) body.append('price', values.price);
    body.append('descr', values.description);
    if (values.file) body.append('document_file', values.file);
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

  update: async (id: string | number, values: IRefundFormValues): Promise<ApiResult<200, null> | ApiResult<400 | 422, any>> => {
    const url = urlMaker('/api/admin/returns/edit');
    const body = new FormData();
    body.append('return_id', String(id));
    if (values.userId) body.append('user_id', values.userId);
    body.append('track_code', values.trackCode);
    if (values.cargoId) body.append('cargo_id', values.cargoId);
    if (values.direction) body.append('direction', values.direction);
    if (values.refundNumber) body.append('return_number', values.refundNumber);
    if (values.productTypeName) body.append('product_type_name', values.productTypeName);
    if (values.shopName) body.append('shop_name', values.shopName);
    if (values.quantity) body.append('quantity', values.quantity);
    if (values.price) body.append('price', values.price);
    body.append('descr', values.description);
    if (values.file) body.append('document_file', values.file);
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

  delete: async (ids: (string | number)[]): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/returns/cancel', { return_id: ids });
    try {
      const response = await caller(url, { method: 'POST' });
      if (response.ok) return new ApiResult(200, null, null);
      return new ApiResult(400, 'Silinmə zamanı xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },

  changeStatus: async (refundId: string | number, stateId: number): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/returns/changestate', { return_id: refundId, state_id: stateId });
    try {
      const response = await caller(url, { method: 'POST' });
      if (response.ok) return new ApiResult(200, null, null);
      return new ApiResult(400, 'Status dəyişdirilə bilmədi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },

  getExcel: async (query: Record<string, any> = {}): Promise<ApiResult<200, Blob> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/returns/export', query);
    try {
      const response = await caller(url);
      if (response.ok) {
        const blob = await response.blob();
        return new ApiResult(200, blob, null);
      }
      return new ApiResult(400, 'Sənəd yüklənə bilmədi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },
};
