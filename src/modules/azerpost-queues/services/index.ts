import { ApiResult, caller, urlMaker } from "@shared/utils";
import { IAzerpostQueue } from "../interfaces";

type ListResponse = { data: IAzerpostQueue[]; total: number };

const toDomain = (p: any): IAzerpostQueue => ({
  id: p.id,
  objectId: p.object_id,
  requestMethod: p.request_method ?? "",
  requestBody: p.request_body ?? "",
  responseBody: p.response_body ?? "",
  statusCode: p.status_code ?? "",
  executed: Boolean(p.executed),
  attempts: p.attempts ?? 0,
  retryAt: p.retry_at ?? "",
  createdAt: p.created_at,
});

export const AzerpostQueuesService = {
  getList: async (query: Record<string, any> = {}): Promise<ApiResult<200, ListResponse> | ApiResult<400, string>> => {
    const url = urlMaker("/api/admin/azerpost_pools", { page: 1, per_page: 20, ...query });
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
