import { ApiResult, caller, urlMaker } from "@shared/utils";
import { INews, INewsFormValues } from "../interfaces";

type ListResponse = { data: INews[]; total: number };

const toDomain = (p: any): INews => ({
  id: p.id,
  title: p.title,
  descr: p.descr ?? "",
  body: p.body ?? "",
  cover: p.cover ?? "",
  image: p.image ?? "",
  createdAt: p.created_at,
});

export const NewsService = {
  getList: async (query: Record<string, any> = {}): Promise<ApiResult<200, ListResponse> | ApiResult<400, string>> => {
    const url = urlMaker("/api/client/news", { page: 1, per_page: 20, ...query });
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

  getById: async (id: string | number): Promise<ApiResult<200, INews> | ApiResult<400, string>> => {
    const url = urlMaker(`/api/admin/news/${id}`);
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

  create: async (values: INewsFormValues): Promise<ApiResult<200, null> | ApiResult<422, unknown> | ApiResult<400, string>> => {
    const body = new FormData();
    body.append("title", values.title);
    body.append("descr", values.descr);
    body.append("body", values.body);
    if (values.image) body.append("image", values.image);
    try {
      const response = await caller("/api/admin/news/create", { method: "POST", body });
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

  update: async (id: string | number, values: INewsFormValues): Promise<ApiResult<200, null> | ApiResult<422, unknown> | ApiResult<400, string>> => {
    const body = new FormData();
    body.append("news_id", String(id));
    body.append("title", values.title);
    body.append("descr", values.descr);
    body.append("body", values.body);
    if (values.image) body.append("image", values.image);
    try {
      const response = await caller("/api/admin/news/edit", { method: "POST", body });
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
    const body = new FormData();
    body.append("news_id", ids.join(","));
    try {
      const response = await caller("/api/admin/news/cancel", { method: "POST", body });
      if (response.ok) return new ApiResult(200, null, null);
      return new ApiResult(400, "Xəta baş verdi.", null);
    } catch {
      return new ApiResult(400, "Şəbəkə xətası.", null);
    }
  },
};
