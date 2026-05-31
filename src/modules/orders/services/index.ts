import { ApiResult, appendToFormData, caller, urlMaker } from '@shared/utils';
import { ICreateOrderValues, IDetailedOrder, IOrder, IOrderStateExecution } from '../interfaces';

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

// Reused by statistics drill-down modals to map getlist rows into IOrder.
export const orderRowToDomain = toDomain;

const toDetailedDomain = (p: any): IDetailedOrder => ({
  ...toDomain(p),
  detailedDebts: (p.debts || []).map((debt: any, index: number) => ({
    id: String(debt.id ?? index),
    param: debt.params,
    amount: { current: debt.current_amount, difference: debt.diff_amount },
    status: { id: debt.state_id, name: debt.state_name },
    description: debt.descr,
    createdAt: debt.created_at,
  })),
});

const stateToDomain = (p: any): IOrderStateExecution => ({
  id: p.id,
  ref: { id: p.state_id, name: p.state_name },
  executor: p.user_id ? { id: p.user_id, name: p.user_name } : null,
  isCurrent: !!p.current,
  createdAt: p.created_at || null,
});

const toPersistence = (values: ICreateOrderValues) => ({
  order_id: values.id,
  user_id: values.userId,
  product_type_id: values.product.typeId,
  url: values.product.url,
  shop_name: values.product.shop,
  size: values.product.size,
  quantity: values.product.quantity,
  price: values.product.price,
  cargo_price: values.product.internalShippingPrice,
  country_id: values.countryId,
  urgent: Number(values.isUrgent).toString(),
  color: values.product.color,
  descr: values.description,
});

const errorsToDomain = (errors: Record<string, string[]> = {}): Record<string, any> => ({
  userId: errors.user_id?.join(', '),
  countryId: errors.country_id?.join(', '),
  description: errors.descr?.join(', '),
  product: {
    url: errors.url?.join(', '),
    shop: errors.shop_name?.join(', '),
    typeId: errors.product_type_id?.join(', '),
    color: errors.color?.join(', '),
    size: errors.size?.join(', '),
    quantity: errors.quantity?.join(', '),
    price: errors.price?.join(', '),
    internalShippingPrice: errors.cargo_price?.join(', '),
  },
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

  getById: async (id: string | number): Promise<ApiResult<200, IDetailedOrder> | ApiResult<400 | 500, string>> => {
    const url = urlMaker('/api/admin/orders/info', { order_id: id });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        return new ApiResult(200, toDetailedDomain(result.data), null);
      }
      return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi', null);
    } catch {
      return new ApiResult(500, 'Şəbəkə ilə əlaqə qurula bilmədi', null);
    }
  },

  getStates: async (id: string | number): Promise<ApiResult<200, IOrderStateExecution[]> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/orders/getstates', { order_id: id });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        return new ApiResult(200, (result.data || []).map(stateToDomain), null);
      }
      return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası', null);
    }
  },

  save: async (values: ICreateOrderValues, id?: string): Promise<ApiResult<200, null> | ApiResult<422, Record<string, any>> | ApiResult<400, string>> => {
    const url = id ? urlMaker('/api/admin/orders/edit') : urlMaker('/api/admin/orders/create');
    const body = new FormData();
    appendToFormData(toPersistence(values), body);
    try {
      const response = await caller(url, { method: 'POST', body });
      if (response.ok) return new ApiResult(200, null, null);
      if (response.status === 400 || response.status === 422) {
        const result = await response.json().catch(() => ({}));
        return new ApiResult(422, errorsToDomain(result.errors || {}), null);
      }
      return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə ilə əlaqə qurula bilmədi', null);
    }
  },

  changeStatus: async (ids: (number | string)[], statusId: number | string, description?: string): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/orders/edit/state', { order_id: ids, state_id: statusId, client_descr: description });
    try {
      const response = await caller(url, { method: 'POST' });
      if (response.ok) return new ApiResult(200, null, null);
      const result = await response.json().catch(() => ({}));
      const reason = result.errors ? Object.values(result.errors).flat().join('. ') : 'Status dəyişdirilə bilmədi';
      return new ApiResult(400, reason, null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası', null);
    }
  },

  bulkChangeStatus: async (query: Record<string, any>, statusId: number | string, description?: string): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/v2/orders/edit/state', { ...query, new_state_id: statusId, new_client_descr: description });
    try {
      const response = await caller(url, { method: 'POST' });
      if (response.ok) return new ApiResult(200, null, null);
      const result = await response.json().catch(() => ({}));
      const reason = result.errors ? Object.values(result.errors).flat().join('. ') : 'Status dəyişdirilə bilmədi';
      return new ApiResult(400, reason, null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası', null);
    }
  },

  cancel: async (ids: (number | string)[]): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
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
