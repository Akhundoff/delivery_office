import { ApiResult, caller, urlMaker } from '@shared/utils';
import { ICashFlowAnalyticsResult, ICashFlowTransaction, ICashRegister, ICashRegisterOperationWithParent, ICashRegisterOperationWithSub, ICurrency } from '../interfaces';

export class CurrenciesService {
  public static async getList(query?: object): Promise<ApiResult<200, { data: ICurrency[]; total: number }> | ApiResult<400 | 500, string>> {
    const url = urlMaker('/api/client/currencies', { page: 1, per_page: 100, ...query });
    try {
      const response = await caller(url);
      if (response.ok) {
        const body = await response.json();
        const data: ICurrency[] = body.data.map((item: any) => ({
          id: item.id,
          name: item.currency_name,
          code: item.currency_code,
          rate: item.currency_rate,
          createdAt: item.created_at,
        }));
        return new ApiResult(200, { data, total: body.total }, null);
      }
      return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi', null);
    } catch {
      return new ApiResult(500, 'Şəbəkə ilə əlaqə qurula bilmədi', null);
    }
  }
}

export class CashRegistersService {
  public static async getBalance(): Promise<ApiResult<200, ICashRegister> | ApiResult<400 | 500, string>> {
    const url = urlMaker('/api/admin/cashboxes/balance');
    try {
      const response = await caller(url);
      if (response.ok) {
        const body = await response.json();
        const item = body.data;
        const data: ICashRegister = {
          id: item.id,
          name: item.cashbox_name,
          amount: parseFloat(item.amount),
          initialAmount: item.initial_amount ? parseFloat(item.initial_amount) : 0,
          currency: { id: item.currency_id, code: item.currency_code },
          createdAt: item.created_at,
        };
        return new ApiResult(200, data, null);
      }
      return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi', null);
    } catch {
      return new ApiResult(500, 'Şəbəkə ilə əlaqə qurula bilmədi', null);
    }
  }

  public static async getList(query?: object): Promise<ApiResult<200, { data: ICashRegister[]; total: number }> | ApiResult<400 | 500, string>> {
    const url = urlMaker('/api/admin/cashboxes', { page: 1, per_page: 100, ...query });
    try {
      const response = await caller(url);
      if (response.ok) {
        const body = await response.json();
        const data: ICashRegister[] = body.data.map((item: any) => ({
          id: item.id,
          name: item.cashbox_name,
          amount: parseFloat(item.amount),
          initialAmount: item.initial_amount ? parseFloat(item.initial_amount) : 0,
          currency: { id: item.currency_id, code: item.currency_code },
          createdAt: item.created_at,
        }));
        return new ApiResult(200, { data, total: body.total }, null);
      }
      return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi', null);
    } catch {
      return new ApiResult(500, 'Şəbəkə ilə əlaqə qurula bilmədi', null);
    }
  }

  public static async create(dto: {
    id?: string;
    name: string;
    amount: string;
    currencyId: string;
  }): Promise<ApiResult<200, null> | ApiResult<422, Record<string, string>> | ApiResult<400 | 500, string>> {
    const url = urlMaker(dto.id ? '/api/admin/cashboxes/edit' : '/api/admin/cashboxes/create');
    try {
      const body = new FormData();
      if (dto.id) body.append('cashbox_id', dto.id);
      body.append('cashbox_name', dto.name);
      body.append('amount', dto.amount);
      body.append('currency_id', dto.currencyId);
      const response = await caller(url, { method: 'POST', body });
      if (response.ok) return new ApiResult(200, null, null);
      const errBody = await response.json();
      if (response.status === 400 && errBody.errors) {
        const errors: Record<string, string> = {};
        Object.entries(errBody.errors).forEach(([k, v]) => {
          errors[k] = (v as string[]).join('. ');
        });
        return new ApiResult(422, errors, null);
      }
      return new ApiResult(400, 'Əməliyyat uğursuz oldu', null);
    } catch {
      return new ApiResult(500, 'Şəbəkə ilə əlaqə qurula bilmədi', null);
    }
  }

  public static async remove(id: number): Promise<ApiResult<200, null> | ApiResult<400 | 500, string>> {
    const url = urlMaker('/api/admin/cashboxes/remove', { cashbox_id: id });
    try {
      const response = await caller(url, { method: 'POST' });
      if (response.ok) return new ApiResult(200, null, null);
      return new ApiResult(400, 'Əməliyyat uğursuz oldu', null);
    } catch {
      return new ApiResult(500, 'Şəbəkə ilə əlaqə qurula bilmədi', null);
    }
  }
}

export class CashRegisterOperationsService {
  public static async getList(query?: object): Promise<ApiResult<200, { data: ICashRegisterOperationWithParent[]; total: number }> | ApiResult<400 | 500, string>> {
    const url = urlMaker('/api/admin/cash_categories/all', { page: 1, per_page: 200, ...query });
    try {
      const response = await caller(url);
      if (response.ok) {
        const body = await response.json();
        const data: ICashRegisterOperationWithParent[] = body.data.map((item: any) => ({
          id: item.id,
          name: item.category_name,
          parent: item.parent_id && item.parent_name ? { id: item.parent_id, name: item.parent_name } : null,
          createdAt: item.created_at,
        }));
        return new ApiResult(200, { data, total: body.total }, null);
      }
      return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi', null);
    } catch {
      return new ApiResult(500, 'Şəbəkə ilə əlaqə qurula bilmədi', null);
    }
  }

  public static async getListWithSub(): Promise<ApiResult<200, { data: ICashRegisterOperationWithSub[] }> | ApiResult<400 | 500, string>> {
    const url = urlMaker('/api/admin/cash_categories', { per_page: 200 });
    try {
      const response = await caller(url);
      if (response.ok) {
        const body = await response.json();
        const data: ICashRegisterOperationWithSub[] = body.data.map((item: any) => ({
          id: item.id,
          name: item.category_name,
          createdAt: item.created_at,
          children: (item.sub_categories || []).map((sub: any) => ({
            id: sub.id,
            name: sub.category_name,
            createdAt: sub.created_at,
          })),
        }));
        return new ApiResult(200, { data }, null);
      }
      return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi', null);
    } catch {
      return new ApiResult(500, 'Şəbəkə ilə əlaqə qurula bilmədi', null);
    }
  }

  public static async create(dto: { id?: string; name: string; parentId: string }): Promise<ApiResult<200, null> | ApiResult<422, Record<string, string>> | ApiResult<400 | 500, string>> {
    const url = urlMaker(dto.id ? '/api/admin/cash_categories/edit' : '/api/admin/cash_categories/create');
    try {
      const body = new FormData();
      if (dto.id) body.append('cash_category_id', dto.id);
      body.append('category_name', dto.name);
      body.append('parent_id', dto.parentId);
      const response = await caller(url, { method: 'POST', body });
      if (response.ok) return new ApiResult(200, null, null);
      const errBody = await response.json();
      if (response.status === 400 && errBody.errors) {
        const errors: Record<string, string> = {};
        Object.entries(errBody.errors).forEach(([k, v]) => {
          errors[k] = (v as string[]).join('. ');
        });
        return new ApiResult(422, errors, null);
      }
      return new ApiResult(400, 'Əməliyyat uğursuz oldu', null);
    } catch {
      return new ApiResult(500, 'Şəbəkə ilə əlaqə qurula bilmədi', null);
    }
  }

  public static async remove(id: number): Promise<ApiResult<200, null> | ApiResult<400 | 500, string>> {
    const url = urlMaker('/api/admin/cash_categories/remove', { cash_category_id: id });
    try {
      const response = await caller(url, { method: 'POST' });
      if (response.ok) return new ApiResult(200, null, null);
      return new ApiResult(400, 'Əməliyyat uğursuz oldu', null);
    } catch {
      return new ApiResult(500, 'Şəbəkə ilə əlaqə qurula bilmədi', null);
    }
  }
}

const toTransactionDomain = (item: any): ICashFlowTransaction => {
  const type: 'income' | 'expense' = item.operation === 1 ? 'income' : 'expense';
  return {
    id: item.id,
    executor: { id: item.user_id, name: item.user_name },
    cashRegister: { id: item.cashbox_id, name: item.cashbox_name, currency: { id: item.currency_id, code: item.currency_code } },
    target:
      item.transfer && item.transfer_cashbox_id
        ? {
            cashRegister: { id: item.transfer_cashbox_id, name: item.cashbox_name_transfer, currency: { id: item.transfer_cashbox_currency_id, code: item.transfer_cashbox_currency_code } },
            amount: item.transfer_cashbox_amount,
          }
        : null,
    amount: item.amount,
    balance: { previous: item.before_balance },
    transferBalance: { previous: item.transfer_before_balance },
    status: { id: item.state_id, name: item.state_name },
    operation: { id: item.cash_category_id_parent, name: item.category_name_parent, child: { id: item.cash_category_id, name: item.category_name } },
    isTransfer: !!item.transfer,
    type,
    paymentType: { id: item.payment_type, name: item.payment_type_name },
    description: item.descr,
    operatedAt: item.operation_date,
    createdAt: item.created_at,
  };
};

export class CashFlowTransactionsService {
  public static async getList(query?: object): Promise<ApiResult<200, { data: ICashFlowTransaction[]; total: number }> | ApiResult<400 | 500, string>> {
    const url = urlMaker('/api/admin/cashbox_operations', { page: 1, per_page: 20, ...query });
    try {
      const response = await caller(url);
      if (response.ok) {
        const body = await response.json();
        const data: ICashFlowTransaction[] = body.data.map(toTransactionDomain);
        return new ApiResult(200, { data, total: body.total }, null);
      }
      return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi', null);
    } catch {
      return new ApiResult(500, 'Şəbəkə ilə əlaqə qurula bilmədi', null);
    }
  }

  public static async getById(id: string | number): Promise<ApiResult<200, ICashFlowTransaction> | ApiResult<400 | 500, string>> {
    const url = urlMaker('/api/admin/cashbox_operations/info', { cashbox_operation_id: id });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        return new ApiResult(200, toTransactionDomain(result.data), null);
      }
      return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi', null);
    } catch {
      return new ApiResult(500, 'Şəbəkə ilə əlaqə qurula bilmədi', null);
    }
  }

  public static async create(dto: {
    id?: string;
    type: 'income' | 'expense' | 'transfer';
    cashRegisterId: string;
    amount: string;
    operationIds: (string | number)[];
    incomeOperationIds?: (string | number)[];
    transferCashRegisterId?: string;
    transferAmount?: string;
    operatedAt: string;
    description: string;
  }): Promise<ApiResult<200, null> | ApiResult<422, Record<string, string>> | ApiResult<400 | 500, string>> {
    const url = urlMaker(dto.id ? '/api/admin/cashbox_operations/edit' : dto.type === 'transfer' ? '/api/admin/cashbox_operations/transfer' : '/api/admin/cashbox_operations/create');
    try {
      const body = new FormData();
      if (dto.id) body.append('cashbox_operation_id', dto.id);
      body.append('operation', dto.type === 'expense' ? '2' : '1');
      body.append('cashbox_id', dto.cashRegisterId);
      body.append('amount', dto.amount);
      body.append('category_id', dto.operationIds.length ? String(dto.operationIds[dto.operationIds.length - 1]) : '');
      body.append('operation_date', dto.operatedAt);
      body.append('descr', dto.description);
      if (dto.type === 'transfer') {
        body.append('transfer_cashbox_id', dto.transferCashRegisterId || '');
        body.append('transfer_amount', dto.transferAmount || '');
        body.append('category_id_second', dto.incomeOperationIds?.length ? String(dto.incomeOperationIds[dto.incomeOperationIds.length - 1]) : '');
      }
      const response = await caller(url, { method: 'POST', body });
      if (response.ok) return new ApiResult(200, null, null);
      const errBody = await response.json();
      if ((response.status === 400 || response.status === 422) && errBody.errors) {
        const errors: Record<string, string> = {};
        Object.entries(errBody.errors).forEach(([k, v]) => {
          errors[k] = (v as string[]).join('. ');
        });
        return new ApiResult(422, errors, null);
      }
      return new ApiResult(400, 'Əməliyyat uğursuz oldu', null);
    } catch {
      return new ApiResult(500, 'Şəbəkə ilə əlaqə qurula bilmədi', null);
    }
  }

  public static async remove(id: string | number): Promise<ApiResult<200, null> | ApiResult<400 | 500, string>> {
    const url = urlMaker('/api/admin/cashbox_operations/cancel', { cashbox_operation_id: id });
    try {
      const response = await caller(url, { method: 'POST' });
      if (response.ok) return new ApiResult(200, null, null);
      try {
        const errBody = await response.json();
        if (errBody.errors) {
          const msgs = Object.values(errBody.errors).flat().join('. ');
          return new ApiResult(400, msgs, null);
        }
      } catch {
        // ignore parse error
      }
      return new ApiResult(400, 'Əməliyyat uğursuz oldu', null);
    } catch {
      return new ApiResult(500, 'Şəbəkə ilə əlaqə qurula bilmədi', null);
    }
  }

  public static async getExcel(query?: Record<string, unknown>): Promise<ApiResult<200, Blob> | ApiResult<400 | 500, string>> {
    const url = urlMaker('/api/admin/cashbox_operations/export', query);
    try {
      const response = await caller(url);
      if (response.ok) {
        const blob = await response.blob();
        return new ApiResult(200, blob, null);
      }
      return new ApiResult(400, 'Excel yüklənə bilmədi', null);
    } catch {
      return new ApiResult(500, 'Şəbəkə ilə əlaqə qurula bilmədi', null);
    }
  }
}

export class CashFlowAnalyticsService {
  public static async getAnalytics(query: { cashbox_id: number; start_date: string; end_date: string }): Promise<ApiResult<200, ICashFlowAnalyticsResult> | ApiResult<400 | 500, string>> {
    const url = urlMaker('/api/admin/cashbox_statistics', query);
    try {
      const response = await caller(url);
      if (response.ok) {
        const data = await response.json();
        return new ApiResult(200, data, null);
      }
      return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi', null);
    } catch {
      return new ApiResult(500, 'Şəbəkə ilə əlaqə qurula bilmədi', null);
    }
  }
}
