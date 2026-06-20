import { ApiResult, caller, urlMaker } from '@shared/utils';

export const AppointmentService = {
  getHandoverDeliveryReceipt: async (declarationIds: (string | number)[]): Promise<ApiResult<200, string> | ApiResult<400 | 500, string>> => {
    const url = urlMaker('/api/admin/handover/delivery_receipt', { declaration_id: declarationIds });
    try {
      const response = await caller(url);
      if (response.ok) return new ApiResult(200, await response.text(), null);
      return new ApiResult(400, 'Sənəd əldə edilə bilmədi', null);
    } catch {
      return new ApiResult(500, 'Şəbəkə xətası.', null);
    }
  },
};
