import { ApiResult, caller, urlMaker } from '@shared/utils';
import { ICoupon, ICouponFormValues } from '../interfaces';

const DATE_FORMAT = 'DD.MM.YYYY HH:mm';

const buildCouponBody = (values: ICouponFormValues): FormData => {
  const body = new FormData();
  body.append('name', values.name);
  body.append('tag', values.tag);
  body.append('coupon_type', values.couponType);
  body.append('amount', values.amount);
  if (values.currency) body.append('currency', values.currency);
  body.append('count', values.count);
  if (values.stateId) body.append('state_id', values.stateId);
  body.append('descr', values.description);
  if (values.platform) body.append('platform', values.platform);
  if (values.periodFrom) body.append('periodFrom', values.periodFrom.format(DATE_FORMAT));
  if (values.periodTo) body.append('periodTo', values.periodTo.format(DATE_FORMAT));
  if (values.userRegisterFrom) body.append('userRegisterFrom', values.userRegisterFrom.format(DATE_FORMAT));
  if (values.userRegisterTo) body.append('userRegisterTo', values.userRegisterTo.format(DATE_FORMAT));
  if (values.userGender) body.append('userGender', values.userGender);
  if (values.countryId) body.append('country_id', values.countryId);
  if (values.regionId) body.append('region_id', values.regionId);
  if (values.userIds?.length) values.userIds.forEach((uid) => body.append('user_id[]', uid));
  return body;
};

const toDomain = (item: any): ICoupon => ({
  id: item.id,
  name: item.name,
  tag: item.tag || '',
  couponType: item.coupon_type,
  amount: item.amount,
  currency: item.currency || '',
  count: item.count || 0,
  description: item.descr || '',
  platform: item.platform || '',
  createdAt: item.created_at,
  period: { from: item.periodFrom || '', to: item.periodTo || '' },
  userRegister: { from: item.userRegisterFrom || '', to: item.userRegisterTo || '', gender: item.userGender ?? 1 },
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
    const body = buildCouponBody(values);
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
    const body = buildCouponBody(values);
    body.append('coupon_id', String(id));
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
      return new ApiResult(
        400,
        Object.values(result.errors || {})
          .flat()
          .join('. ') || 'Xəta baş verdi.',
        null,
      );
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },
};
