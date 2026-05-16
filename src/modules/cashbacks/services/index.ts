import { ApiResult, caller, urlMaker } from "@shared/utils";
import { ICashback } from "../interfaces";

const toDomain = (item: any): ICashback => ({
  id: item.id,
  client: { id: item.user_id, name: item.user_name },
  amount: item.cashback,
  count: item.cashback_count,
  status: { id: item.state_id, name: item.state_name },
});

export const CashbacksService = {
  getList: async (query: Record<string, any> = {}): Promise<ApiResult<200, { data: ICashback[]; total: number }> | ApiResult<400, string>> => {
    const url = urlMaker("/api/admin/cashbacks", { page: 1, per_page: 20, ...query });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        const data = (result.data || []).map(toDomain);
        return new ApiResult(200, { data, total: result.total || data.length }, null);
      }
      return new ApiResult(400, "Xəta baş verdi.", null);
    } catch {
      return new ApiResult(400, "Şəbəkə xətası.", null);
    }
  },
};
