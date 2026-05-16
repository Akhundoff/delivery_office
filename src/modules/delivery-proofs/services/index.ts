import { ApiResult, caller, urlMaker } from "@shared/utils";
import { IDeliveryProof } from "../interfaces";

type ListResponse = { data: IDeliveryProof[]; total: number };

const toDomain = (p: any): IDeliveryProof => ({
  id: p.id,
  trackCode: p.track_code,
  declarationId: p.declaration_id,
  user: p.user_id ? { id: p.user_id, name: p.user_name } : null,
  fileUrl: p.file_url,
  createdAt: p.created_at,
  updatedAt: p.updated_at,
});

export const DeliveryProofsService = {
  getList: async (query: Record<string, any> = {}): Promise<ApiResult<200, ListResponse> | ApiResult<400, string>> => {
    const url = urlMaker("/api/admin/delivery-proofs", { page: 1, per_page: 20, ...query });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        const data = (result.data || []).map(toDomain);
        return new ApiResult(200, { data, total: result.total ?? data.length }, null);
      }
      return new ApiResult(400, "Xəta baş verdi.", null);
    } catch {
      return new ApiResult(400, "Şəbəkə xətası.", null);
    }
  },
};
