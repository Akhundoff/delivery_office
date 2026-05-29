import { ApiResult, caller, urlMaker } from '@shared/utils';
import { IOrder } from '../interfaces';

const toDomain = (p: any): IOrder => ({
  id: p.id,
  trackCode: p.track_code || '',
  user: { id: p.user_id, name: p.user_name || '' },
  status: { id: p.state_id, name: p.state_name || '' },
  paid: !!p.payed,
  returned: !!p.return,
  couponId: p.coupon_id || 0,
  product: {
    url: p.url || '',
    size: p.size || '',
    color: p.color || '',
    quantity: p.quantity || 0,
    price: parseFloat(p.price) || 0,
    internalShippingPrice: p.cargo_price ? parseFloat(p.cargo_price) : 0,
    shop: p.shop_name || '',
    type: p.product_type_id ? { id: p.product_type_id, name: p.product_type_name || '' } : null,
  },
  executor: p.executive && p.executive_id ? { id: p.executive_id, name: p.executive } : null,
  declaration: p.declaration_id && p.track_code_declaration ? { id: p.declaration_id, trackCode: p.track_code_declaration } : null,
  debts: { productPrice: p.diff_price || 0, internalShippingPrice: p.diff_cargo_price || 0 },
  read: !!p.is_new,
  isUrgent: !!p.urgent,
  rejectionReason: p.client_descr || '',
  countryId: p.country_id || 0,
  description: p.descr || '',
  expectedAt: p.waiting || null,
  updatedAt: p.updated_at || null,
  createdAt: p.created_at || '',
});

export const OrdersService = {
  getList: async (query: Record<string, any> = {}): Promise<ApiResult<200, { data: IOrder[]; total: number }> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/v2/orders/getlist', { page: 1, per_page: 20, ...query });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        return new ApiResult(200, { data: (result.data || []).map(toDomain), total: result.total || 0 }, null);
      }
      return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası', null);
    }
  },

  changeStatus: async (ids: number[], statusId: number): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/orders/edit/state', { order_id: ids, state_id: statusId });
    try {
      const response = await caller(url, { method: 'POST' });
      if (response.ok) return new ApiResult(200, null, null);
      return new ApiResult(400, 'Status dəyişdirilə bilmədi', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası', null);
    }
  },

  cancel: async (ids: number[]): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/orders/cancel', { order_id: ids });
    try {
      const response = await caller(url, { method: 'POST' });
      if (response.ok) return new ApiResult(200, null, null);
      return new ApiResult(400, 'Silmə uğursuz oldu', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası', null);
    }
  },

  getExcel: async (query: Record<string, any> = {}): Promise<ApiResult<200, Blob> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/orders/export', query);
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
