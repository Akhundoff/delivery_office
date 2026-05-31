import { ApiResult, caller, urlMaker } from "@shared/utils";
import { IFailedJob } from "../interfaces";

type ListResponse = { data: IFailedJob[]; total: number };

const toDomain = (p: any): IFailedJob => ({
  id: p.id,
  displayName: p.displayName ?? "",
  maxTries: p.maxTries ?? null,
  delay: p.delay ?? null,
  body: p.body ?? "",
  number: p.number ?? "",
  dispatchData: p.dispatchData ?? null,
  failedAt: p.failed_at ?? "",
});

export const FailedJobsService = {
  getList: async (query: Record<string, any> = {}): Promise<ApiResult<200, ListResponse> | ApiResult<400, string>> => {
    const url = urlMaker("/api/admin/jobs/failed_jobs", { page: 1, per_page: 20, ...query });
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

  retry: async (id: number | string): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
    const url = urlMaker(`/api/admin/jobs/retry/${id}`);
    try {
      const response = await caller(url);
      if (response.ok) return new ApiResult(200, null, null);
      return new ApiResult(400, "Xəta baş verdi.", null);
    } catch {
      return new ApiResult(400, "Şəbəkə xətası.", null);
    }
  },

  remove: async (id: number | string): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
    const url = urlMaker(`/api/admin/jobs/remove/${id}`);
    try {
      const response = await caller(url);
      if (response.ok) return new ApiResult(200, null, null);
      return new ApiResult(400, "Xəta baş verdi.", null);
    } catch {
      return new ApiResult(400, "Şəbəkə xətası.", null);
    }
  },
};
