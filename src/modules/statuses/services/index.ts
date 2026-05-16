import { ApiResult, caller, urlMaker } from "@shared/utils";
import { IStatus } from "../interfaces";

const toDomain = (item: any): IStatus => ({
  id: item.id,
  name: item.name,
  nameEn: item.name_en || "",
  parentId: item.parent_id || null,
  model: item.model_id ? { id: item.model_id, name: item.model_name || "" } : null,
  createdAt: item.created_at,
  description: item.descr || "",
  freely: item.freely === 1,
});

export const StatusesService = {
  getList: async (query: Record<string, any> = {}): Promise<ApiResult<200, { data: IStatus[]; total: number }> | ApiResult<400, string>> => {
    const url = urlMaker("/api/admin/states/list", { page: 1, per_page: 20, ...query });
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
