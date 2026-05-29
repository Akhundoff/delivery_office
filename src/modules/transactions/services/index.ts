import { ApiResult, caller, urlMaker } from '@shared/utils';
import { ITransaction, ITransactionPersistence, ITransactionsStats, ITransactionsStatsPersistence, CreateTransactionDto } from '../interfaces';

const toDomain = (item: ITransactionPersistence): ITransaction => ({
  id: item.id,
  user: { id: item.user_id, name: item.user_name },
  object: { id: item.object_id, model: { id: item.model_id, name: item.model_name } },
  amount: { value: parseFloat(item.amount), currency: item.currency.toLowerCase() },
  beforeBalance: item.before_balance?.toFixed(2) || '',
  cashback: item.cashback ? item.cashback : 0,
  paymentType: { id: item.payment_type, name: item.payment_type_name },
  type: { id: item.type, name: item.type_name },
  status: { id: item.state_id, name: item.state_name },
  confirmedBy: item.confirmed_by ? { id: 0, name: item.confirmed_by } : null,
  createdAt: item.created_at,
  description: item.descr || '',
});

export const TransactionsService = {
  getList: async (query: Record<string, any> = {}): Promise<ApiResult<200, { data: ITransaction[]; total: number }> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/v2/pay/getlist', { page: 1, per_page: 20, ...query });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        return new ApiResult(200, { data: (result.data || []).map((i: ITransactionPersistence) => toDomain(i)), total: result.total || 0 }, null);
      }
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },

  create: async (dto: CreateTransactionDto): Promise<ApiResult<200, null> | ApiResult<400 | 422 | 500, string>> => {
    const url = urlMaker('/api/admin/pay/balance');
    const body = new FormData();
    body.append('user_id', dto.userId);
    body.append('amount', dto.amount);
    body.append('currency', dto.currency);
    body.append('amount_azn', dto.amountAzn);
    body.append('type', dto.type);
    body.append('payment_type', dto.paymentType);
    body.append('descr', dto.description);
    try {
      const response = await caller(url, { method: 'POST', body });
      if (response.ok) return new ApiResult(200, null, null);
      const result = await response.json();
      if (response.status === 400 || response.status === 422) {
        const errors = result.errors || {};
        if (errors.not_selected_cashbox) return new ApiResult(400, errors.not_selected_cashbox.join(', '), null);
        if (errors.not_enough_amount) return new ApiResult(400, errors.not_enough_amount.join(', '), null);
        const messages = Object.values(errors).flat().join('. ');
        return new ApiResult(422, messages || 'Xəta baş verdi.', null);
      }
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(500, 'Şəbəkə ilə əlaqə qurula bilmədi.', null);
    }
  },

  cancel: async (ids: (number | string)[]): Promise<ApiResult<200, null> | ApiResult<400 | 500, string>> => {
    const params = ids.map((id) => `payment_id[]=${id}`).join('&');
    const url = `/api/admin/pay/cancel?${params}`;
    try {
      const response = await caller(url, { method: 'POST' });
      if (response.ok) return new ApiResult(200, null, null);
      const result = await response.json();
      const msg = Object.values(result.errors || {}).flat().join('. ');
      return new ApiResult(400, msg || 'Silinmə zamanı xəta baş verdi.', null);
    } catch {
      return new ApiResult(500, 'Şəbəkə ilə əlaqə qurula bilmədi.', null);
    }
  },

  changeStatus: async (ids: (number | string)[], statusId: number | string): Promise<ApiResult<200, null> | ApiResult<400 | 500, string>> => {
    const params = ids.map((id) => `payment_id[]=${id}`).join('&') + `&state_id=${statusId}`;
    const url = `/api/admin/pay/edit/state?${params}`;
    try {
      const response = await caller(url, { method: 'POST' });
      if (response.ok) return new ApiResult(200, null, null);
      const result = await response.json();
      const msg = Object.values(result.errors || {}).flat().join('. ');
      return new ApiResult(400, msg || 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(500, 'Şəbəkə ilə əlaqə qurula bilmədi.', null);
    }
  },

  getStats: async (query: Record<string, any> = {}): Promise<ApiResult<200, ITransactionsStats> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/pay/stats', query);
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        const s: ITransactionsStatsPersistence = result.data;
        const stats: ITransactionsStats = {
          try: { in: parseFloat(s.try_in), out: parseFloat(s.try_out), difference: parseFloat(s.try_in) - parseFloat(s.try_out) },
          usd: { in: s.usd_in, out: s.usd_out, difference: s.usd_in - s.usd_out },
        };
        return new ApiResult(200, stats, null);
      }
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },

  getExcel: async (query: Record<string, any> = {}): Promise<ApiResult<200, Blob> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/pay/export', query);
    try {
      const response = await caller(url);
      if (response.ok) return new ApiResult(200, await response.blob(), null);
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },

  getCurrencyRate: async (currency: string): Promise<ApiResult<200, number> | ApiResult<400, string>> => {
    const url = urlMaker('/api/client/cbar', { currency });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        return new ApiResult(200, parseFloat(result.data), null);
      }
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },
};
