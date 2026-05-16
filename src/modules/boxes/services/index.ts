import { ApiResult, caller, urlMaker } from "@shared/utils";
import { IBox, IBoxFormValues } from "../interfaces";

const toDomain = (item: any): IBox => ({
  id: item.id,
  name: item.container_name,
  branch: item.branch_id && item.branch_name ? { id: item.branch_id, name: item.branch_name } : null,
  user: item.user_id && item.user_name ? { id: item.user_id, name: item.user_name } : null,
  declarationCount: item.declaration_count || 0,
  createdAt: item.created_at,
});

export const BoxesService = {
  getList: async (query: Record<string, any> = {}): Promise<ApiResult<200, { data: IBox[]; total: number }> | ApiResult<400, string>> => {
    const url = urlMaker("/api/admin/containers", { page: 1, per_page: 20, ...query });
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

  getById: async (id: string | number): Promise<ApiResult<200, IBox> | ApiResult<400, string>> => {
    const url = urlMaker("/api/admin/containers/info", { container_id: id });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        return new ApiResult(200, toDomain(result.data), null);
      }
      return new ApiResult(400, "Məlumatlar əldə edilə bilmədi", null);
    } catch {
      return new ApiResult(400, "Şəbəkə xətası.", null);
    }
  },

  create: async (values: IBoxFormValues): Promise<ApiResult<200, null> | ApiResult<400 | 422, any>> => {
    const url = urlMaker("/api/admin/containers/create");
    const body = new FormData();
    body.append("container_name", values.name);
    body.append("branch_id", values.branchId);
    try {
      const response = await caller(url, { method: "POST", body });
      if (response.ok) return new ApiResult(200, null, null);
      const result = await response.json();
      if (response.status === 400) return new ApiResult(422, result.errors || {}, null);
      return new ApiResult(400, "Xəta baş verdi.", null);
    } catch {
      return new ApiResult(400, "Şəbəkə xətası.", null);
    }
  },

  update: async (id: string | number, values: IBoxFormValues): Promise<ApiResult<200, null> | ApiResult<400 | 422, any>> => {
    const url = urlMaker("/api/admin/containers/edit");
    const body = new FormData();
    body.append("container_id", String(id));
    body.append("container_name", values.name);
    body.append("branch_id", values.branchId);
    try {
      const response = await caller(url, { method: "POST", body });
      if (response.ok) return new ApiResult(200, null, null);
      const result = await response.json();
      if (response.status === 400) return new ApiResult(422, result.errors || {}, null);
      return new ApiResult(400, "Xəta baş verdi.", null);
    } catch {
      return new ApiResult(400, "Şəbəkə xətası.", null);
    }
  },

  delete: async (ids: (string | number)[]): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
    const url = urlMaker("/api/admin/containers/cancel", { container_id: ids });
    try {
      const response = await caller(url, { method: "POST" });
      if (response.ok) return new ApiResult(200, null, null);
      return new ApiResult(400, "Silinmə zamanı xəta baş verdi.", null);
    } catch {
      return new ApiResult(400, "Şəbəkə xətası.", null);
    }
  },
};
