import { ApiResult, caller, urlMaker } from '@shared/utils';
import { ICoupon, ICouponFormValues } from '../interfaces';

const toDomain = (item: any): ICoupon => ({
  id: item.id,
  name: item.name,
  tag: item.tag || '',
  couponType: item.coupon_type,
  amount: item.amount,
  currency: item.currency || '',
  count: item.count || 0,
  description: item.descr || '',
  createdAt: item.created_at,
  state: item.state_id ? { id: item.state_id, name: item.state_name || '' } : null,
  country: item.country_id ? { id: item.country_id, name: item.country_name || '' } : null,
  region: item.region_id ? { id: item.region_id, name: item.region_name || '' } : null,
});

export const CouponsService = {
  getList: async (query: Record<string, any> = {}): Promise<ApiResult<200, { data: ICoupon[]; total: number }> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/coupons', { page: 1, per_page: 20, ...query });
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

  getById: async (id: string | number): Promise<ApiResult<200, ICoupon> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/coupons/info', { coupon_id: id });
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

  create: async (values: ICouponFormValues): Promise<ApiResult<200, null> | ApiResult<400 | 422, any>> => {
    const url = urlMaker('/api/admin/coupons/create');
    const body = new FormData();
    body.append('name', values.name);
    body.append('tag', values.tag);
    body.append('coupon_type', values.couponType);
    body.append('amount', values.amount);
    if (values.currency) body.append('currency', values.currency);
    body.append('count', values.count);
    if (values.stateId) body.append('state_id', values.stateId);
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

  update: async (id: string | number, values: ICouponFormValues): Promise<ApiResult<200, null> | ApiResult<400 | 422, any>> => {
    const url = urlMaker('/api/admin/coupons/edit');
    const body = new FormData();
    body.append('coupon_id', String(id));
    body.append('name', values.name);
    body.append('tag', values.tag);
    body.append('coupon_type', values.couponType);
    body.append('amount', values.amount);
    if (values.currency) body.append('currency', values.currency);
    body.append('count', values.count);
    if (values.stateId) body.append('state_id', values.stateId);
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

  changeStatus: async (id: string | number, stateId: number): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/coupons/editstatus', { coupon_id: id, state_id: stateId });
    try {
      const response = await caller(url, { method: 'POST' });
      if (response.ok) return new ApiResult(200, null, null);
      const result = await response.json();
      return new ApiResult(400, Object.values(result.errors || {}).flat().join('. ') || 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },
};
