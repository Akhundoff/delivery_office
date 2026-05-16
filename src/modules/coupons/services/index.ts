import { ApiResult, caller, urlMaker } from "@shared/utils";
import { ICoupon } from "../interfaces";

const toDomain = (item: any): ICoupon => ({
  id: item.id,
  name: item.name,
  tag: item.tag || "",
  couponType: item.coupon_type,
  amount: item.amount,
  currency: item.currency || "",
  count: item.count || 0,
  description: item.descr || "",
  createdAt: item.created_at,
  state: item.state_id ? { id: item.state_id, name: item.state_name || "" } : null,
  country: item.country_id ? { id: item.country_id, name: item.country_name || "" } : null,
  region: item.region_id ? { id: item.region_id, name: item.region_name || "" } : null,
});

export const CouponsService = {
  getList: async (query: Record<string, any> = {}): Promise<ApiResult<200, { data: ICoupon[]; total: number }> | ApiResult<400, string>> => {
    const url = urlMaker("/api/admin/coupons", { page: 1, per_page: 20, ...query });
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
