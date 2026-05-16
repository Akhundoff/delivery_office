import { ApiResult, caller, urlMaker } from "@shared/utils";
import { IModel } from "../interfaces";

const toDomain = (item: any): IModel => ({
  id: item.id,
  name: item.name,
  sort: item.sort || "",
  description: item.descr || "",
  createdAt: item.created_at,
});

export const ModelsService = {
  getList: async (query: Record<string, any> = {}): Promise<ApiResult<200, { data: IModel[]; total: number }> | ApiResult<400, string>> => {
    const url = urlMaker("/api/admin/models/getlist", query);
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
