import { ApiResult, caller, urlMaker } from "@shared/utils";
import { IUnitedQueue } from "../interfaces";

type ListResponse = { data: IUnitedQueue[]; total: number };

const toDomain = (p: any): IUnitedQueue => ({
  id: p.id,
  method: p.method ?? "",
  url: p.url ?? "",
  statusCode: p.status_code ?? null,
  response: p.response ? (typeof p.response === "string" ? JSON.parse(p.response) : p.response) : null,
  payload: p.payload ? (typeof p.payload === "string" ? JSON.parse(p.payload) : p.payload) : null,
  attempts: p.retried ?? 0,
  createdAt: p.created_at,
  retriedAt: p.retry_at ?? null,
});

export const UnitedQueuesService = {
  getList: async (query: Record<string, any> = {}): Promise<ApiResult<200, ListResponse> | ApiResult<400, string>> => {
    const url = urlMaker("/api/admin/united_pool", { page: 1, per_page: 20, ...query });
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
