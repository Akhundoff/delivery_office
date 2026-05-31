import { ApiResult, caller, urlMaker } from '@shared/utils';
import { ICounter, ICounterPersistence } from '../interfaces';

const toDomain = (counter: ICounterPersistence): ICounter => ({
  couriers: counter.courier ?? 0,
  orders: counter.order ?? 0,
  declarations: counter.declaration ?? 0,
  unknownDeclarations: counter.conflicted_declaration ?? 0,
  supports: counter.ticket ?? 0,
  handoverQueue: {
    pending: counter.waiting_tasks ?? 0,
    executing: counter.executing_tasks ?? 0,
    executed: counter.executed_tasks ?? 0,
  },
  byBranch: counter.by_branch ?? {},
});

export const CounterService = {
  getCount: async (): Promise<ApiResult<200, ICounter> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/notification/count');
    try {
      const response = await caller(url, { method: 'POST' });
      if (response.ok) {
        const result = await response.json();
        return new ApiResult(200, toDomain(result.data), null);
      }
      return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə ilə əlaqə qurula bilmədi.', null);
    }
  },
};
