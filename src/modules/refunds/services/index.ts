import { ApiResult, caller, urlMaker } from "@shared/utils";
import { IRefund } from "../interfaces";

const toDomain = (item: any): IRefund => ({
  id: item.id,
  shopName: item.shop_name || "",
  trackCode: item.track_code || "",
  refundNumber: item.return_number || null,
  cargo: item.cargo_id && item.cargo_name ? { id: item.cargo_id, name: item.cargo_name } : null,
  user: item.user_id && item.user_name ? { id: item.user_id, name: item.user_name } : null,
  state: item.state_id && item.state_name ? { id: item.state_id, name: item.state_name } : null,
  productType: item.product_type_name ? { name: item.product_type_name } : null,
  price: item.price || null,
  quantity: item.quantity || null,
  description: item.descr || "",
  direction: item.direction || "",
  file: item.document_file || null,
  createdAt: item.created_at,
});

export const RefundsService = {
  getList: async (query: Record<string, any> = {}): Promise<ApiResult<200, { data: IRefund[]; total: number }> | ApiResult<400, string>> => {
    const url = urlMaker("/api/admin/returns", { page: 1, per_page: 20, ...query });
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
