import { ApiResult, caller, urlMaker } from "@shared/utils";
import { ILog, ILogDetail } from "../interfaces";

type ListResponse = { data: ILog[]; total: number };

const toDomain = (p: any): ILog => ({
  id: p.id,
  title: p.title ?? "",
  action: p.action ?? "",
  modelId: p.model_id,
  modelName: p.model_name ?? "",
  objectId: p.object_id,
  userId: p.user_id,
  userName: p.user_name ?? "",
  createdAt: p.created_at,
});

const toDetailDomain = (p: any): ILogDetail => ({
  ...toDomain(p),
  newValue: p.new_value ?? null,
  oldValue: p.old_value ?? null,
});

export const LogsService = {
  getList: async (query: Record<string, any> = {}): Promise<ApiResult<200, ListResponse> | ApiResult<400, string>> => {
    const url = urlMaker("/api/admin/logs", { page: 1, per_page: 20, ...query });
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

  getById: async (id: string | number): Promise<ApiResult<200, ILogDetail> | ApiResult<400, string>> => {
    const url = urlMaker("/api/admin/logs/info", { log_id: id });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        return new ApiResult(200, toDetailDomain(result.data), null);
      }
      return new ApiResult(400, "Xəta baş verdi.", null);
    } catch {
      return new ApiResult(400, "Şəbəkə xətası.", null);
    }
  },

  exportAsExcel: async (query: Record<string, any> = {}): Promise<ApiResult<200, Blob> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/logs/export', query);
    try {
      const response = await caller(url);
      if (response.ok) {
        const blob = await response.blob();
        return new ApiResult(200, blob, null);
      }
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },

  exportDeclarationChanges: async (startDate: string, endDate: string): Promise<ApiResult<200, Blob> | ApiResult<400, string>> => {
    const body = new FormData();
    body.append('start_date', startDate);
    body.append('end_date', endDate);
    try {
      const response = await caller('/api/admin/changedUserExport', { method: 'POST', body });
      if (response.ok) {
        const blob = await response.blob();
        return new ApiResult(200, blob, null);
      }
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },
};
