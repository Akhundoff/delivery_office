import { ApiResult, caller, urlMaker } from "@shared/utils";
import { IFaq, IFaqFormValues } from "../interfaces";

type ListResponse = { data: IFaq[]; total: number };

const toDomain = (p: any): IFaq => ({
  id: p.id,
  question: p.question,
  answer: p.answer,
  sort: p.sort ?? "",
  createdAt: p.created_at,
});

export const FaqService = {
  getList: async (query: Record<string, any> = {}): Promise<ApiResult<200, ListResponse> | ApiResult<400, string>> => {
    const url = urlMaker("/api/client/faq", { page: 1, per_page: 20, ...query });
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

  getById: async (id: string | number): Promise<ApiResult<200, IFaq> | ApiResult<400, string>> => {
    const url = urlMaker(`/api/admin/faq/${id}`);
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

  create: async (values: IFaqFormValues): Promise<ApiResult<200, null> | ApiResult<422, unknown> | ApiResult<400, string>> => {
    const body = new FormData();
    body.append("question", values.question);
    body.append("answer", values.answer);
    if (values.sort) body.append("sort", values.sort);
    try {
      const response = await caller("/api/admin/faq/create", { method: "POST", body });
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

  update: async (id: string | number, values: IFaqFormValues): Promise<ApiResult<200, null> | ApiResult<422, unknown> | ApiResult<400, string>> => {
    const body = new FormData();
    body.append("question", values.question);
    body.append("answer", values.answer);
    if (values.sort) body.append("sort", values.sort);
    const url = urlMaker("/api/admin/faq/edit", { faq_id: id });
    try {
      const response = await caller(url, { method: "POST", body });
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
    const url = urlMaker("/api/admin/faq/cancel", { faq_id: ids.join(",") });
    try {
      const response = await caller(url, { method: "POST" });
      if (response.ok) return new ApiResult(200, null, null);
      return new ApiResult(400, "Xəta baş verdi.", null);
    } catch {
      return new ApiResult(400, "Şəbəkə xətası.", null);
    }
  },
};
