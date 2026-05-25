import { ApiResult, caller, urlMaker } from "@shared/utils";

export type ISettingsGroup = Record<string, any>;

export const SystemSettingsService = {
  getGroup: async (
    groupId: string,
  ): Promise<ApiResult<200, ISettingsGroup> | ApiResult<400, string>> => {
    const url = urlMaker("/api/admin/settings/data", { group_id: groupId });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        return new ApiResult(200, result.data || {}, null);
      }
      return new ApiResult(400, "Məlumatlar əldə edilə bilmədi", null);
    } catch {
      return new ApiResult(400, "Şəbəkə xətası.", null);
    }
  },

  updateGroup: async (
    groupId: string,
    values: Record<string, any>,
  ): Promise<ApiResult<200, null> | ApiResult<400 | 422, any>> => {
    const url = urlMaker("/api/admin/settings/data");
    const body = new FormData();
    body.append("group_id", groupId);
    Object.entries(values).forEach(([k, v]) => {
      if (v !== null && v !== undefined) body.append(k, v);
    });
    try {
      const response = await caller(url, { method: "POST", body });
      if (response.ok) return new ApiResult(200, null, null);
      const result = await response.json();
      if (response.status === 422)
        return new ApiResult(422, result.errors || {}, null);
      return new ApiResult(400, "Xəta baş verdi.", null);
    } catch {
      return new ApiResult(400, "Şəbəkə xətası.", null);
    }
  },
};
