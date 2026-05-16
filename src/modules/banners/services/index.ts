import { ApiResult, caller, urlMaker } from "@shared/utils";
import { IBanner, IBannerFormValues } from "../interfaces";

type ListResponse = { data: IBanner[]; total: number };

const toDomain = (p: any): IBanner => ({
  id: p.id,
  name: p.name,
  type: p.type,
  documentFile: p.document_file ?? "",
  active: Boolean(p.active),
  createdAt: p.created_at,
});

export const BannersService = {
  getList: async (query: Record<string, any> = {}): Promise<ApiResult<200, ListResponse> | ApiResult<400, string>> => {
    const url = urlMaker("/api/admin/sliders", { page: 1, per_page: 20, ...query });
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

  getById: async (id: string | number): Promise<ApiResult<200, IBanner> | ApiResult<400, string>> => {
    const url = urlMaker(`/api/admin/banners/${id}`);
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        return new ApiResult(200, toDomain(result.data), null);
      }
      return new ApiResult(400, "Xəta baş verdi.", null);
    } catch {
      return new ApiResult(400, "Şəbəkə xətası.", null);
    }
  },

  create: async (values: IBannerFormValues): Promise<ApiResult<200, null> | ApiResult<422, unknown> | ApiResult<400, string>> => {
    const body = new FormData();
    body.append("name", values.name);
    body.append("type", values.type);
    body.append("active", values.active ? "1" : "0");
    if (values.documentFile) body.append("document_file", values.documentFile);
    try {
      const response = await caller("/api/admin/sliders/create", { method: "POST", body });
      if (response.ok) return new ApiResult(200, null, null);
      if (response.status === 422) {
        const result = await response.json();
        return new ApiResult(422, result, null);
      }
      return new ApiResult(400, "Xəta baş verdi.", null);
    } catch {
      return new ApiResult(400, "Şəbəkə xətası.", null);
    }
  },

  update: async (id: string | number, values: IBannerFormValues): Promise<ApiResult<200, null> | ApiResult<422, unknown> | ApiResult<400, string>> => {
    const body = new FormData();
    body.append("banner_id", String(id));
    body.append("name", values.name);
    body.append("type", values.type);
    body.append("active", values.active ? "1" : "0");
    if (values.documentFile) body.append("document_file", values.documentFile);
    try {
      const response = await caller("/api/admin/banners/edit", { method: "POST", body });
      if (response.ok) return new ApiResult(200, null, null);
      if (response.status === 422) {
        const result = await response.json();
        return new ApiResult(422, result, null);
      }
      return new ApiResult(400, "Xəta baş verdi.", null);
    } catch {
      return new ApiResult(400, "Şəbəkə xətası.", null);
    }
  },

  delete: async (ids: (string | number)[]): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
    const url = urlMaker("/api/admin/sliders/cancel", { banner_id: ids.join(",") });
    try {
      const response = await caller(url, { method: "POST" });
      if (response.ok) return new ApiResult(200, null, null);
      return new ApiResult(400, "Xəta baş verdi.", null);
    } catch {
      return new ApiResult(400, "Şəbəkə xətası.", null);
    }
  },
};
