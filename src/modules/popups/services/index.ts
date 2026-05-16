import { ApiResult, caller, urlMaker } from "@shared/utils";
import { IPopup, IPopupFormValues, PopupTarget, PopupType } from "../interfaces";

type ListResponse = { data: IPopup[]; total: number };

const toDomain = (p: any): IPopup => ({
  id: p.id,
  title: p.title,
  message: p.message ?? "",
  startDate: p.start_date ?? p.startDate ?? "",
  endDate: p.end_date ?? p.endDate ?? "",
  buttonLink: p.button_link ?? p.buttonLink ?? "",
  buttonName: p.button_name ?? p.buttonName ?? "",
  buttonLinkMobile: p.button_link_mobile ?? p.buttonLinkMobile ?? "",
  target: p.target as PopupTarget,
  type: p.type as PopupType,
  maxShowCount: p.max_show_count ?? p.maxShowCount ?? 0,
  createdAt: p.created_at,
});

export const PopupsService = {
  getList: async (query: Record<string, any> = {}): Promise<ApiResult<200, ListResponse> | ApiResult<400, string>> => {
    const url = urlMaker("/api/admin/popups", { page: 1, per_page: 20, ...query });
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

  getById: async (id: string | number): Promise<ApiResult<200, IPopup> | ApiResult<400, string>> => {
    const url = urlMaker(`/api/admin/popups/${id}`);
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

  create: async (values: IPopupFormValues): Promise<ApiResult<200, null> | ApiResult<422, unknown> | ApiResult<400, string>> => {
    const body = new FormData();
    body.append("title", values.title);
    body.append("message", values.message);
    body.append("start_date", values.startDate);
    body.append("end_date", values.endDate);
    body.append("button_link", values.buttonLink);
    body.append("button_name", values.buttonName);
    body.append("button_link_mobile", values.buttonLinkMobile);
    body.append("target", values.target);
    body.append("type", values.type);
    body.append("max_show_count", values.maxShowCount);
    try {
      const response = await caller("/api/admin/popups/create", { method: "POST", body });
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

  update: async (id: string | number, values: IPopupFormValues): Promise<ApiResult<200, null> | ApiResult<422, unknown> | ApiResult<400, string>> => {
    const body = new FormData();
    body.append("popup_id", String(id));
    body.append("title", values.title);
    body.append("message", values.message);
    body.append("start_date", values.startDate);
    body.append("end_date", values.endDate);
    body.append("button_link", values.buttonLink);
    body.append("button_name", values.buttonName);
    body.append("button_link_mobile", values.buttonLinkMobile);
    body.append("target", values.target);
    body.append("type", values.type);
    body.append("max_show_count", values.maxShowCount);
    try {
      const response = await caller("/api/admin/popups/edit", { method: "POST", body });
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
    const url = urlMaker("/api/admin/popups/cancel", { popup_id: ids.join(",") });
    try {
      const response = await caller(url, { method: "POST" });
      if (response.ok) return new ApiResult(200, null, null);
      return new ApiResult(400, "Xəta baş verdi.", null);
    } catch {
      return new ApiResult(400, "Şəbəkə xətası.", null);
    }
  },
};
