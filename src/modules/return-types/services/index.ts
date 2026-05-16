import { ApiResult, caller, urlMaker } from "@shared/utils";
import { IReturnType, IReturnTypeFormValues } from "../interfaces";

const toDomain = (item: any): IReturnType => ({
  id: item.id,
  name: item.reason,
  createdAt: item.created_at,
});

export const ReturnTypesService = {
  getList: async (
    query: Record<string, any> = {},
  ): Promise<
    | ApiResult<200, { data: IReturnType[]; total: number }>
    | ApiResult<400, string>
  > => {
    const url = urlMaker("/api/admin/return_reasons", {
      page: 1,
      per_page: 20,
      ...query,
    });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        const data = (result.data || []).map(toDomain);
        return new ApiResult(
          200,
          { data, total: result.total || data.length },
          null,
        );
      }
      return new ApiResult(400, "Xəta baş verdi.", null);
    } catch {
      return new ApiResult(400, "Şəbəkə xətası.", null);
    }
  },

  getById: async (
    id: string | number,
  ): Promise<ApiResult<200, IReturnType> | ApiResult<400, string>> => {
    const url = urlMaker("/api/admin/return_reasons/info", {
      return_reason_id: id,
    });
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

  create: async (
    values: IReturnTypeFormValues,
  ): Promise<ApiResult<200, null> | ApiResult<400 | 422, any>> => {
    const url = urlMaker("/api/admin/return_reasons/create");
    const body = new FormData();
    body.append("reason", values.name);
    try {
      const response = await caller(url, { method: "POST", body });
      if (response.ok) return new ApiResult(200, null, null);
      const result = await response.json();
      if (response.status === 400)
        return new ApiResult(422, result.errors || {}, null);
      return new ApiResult(400, "Xəta baş verdi.", null);
    } catch {
      return new ApiResult(400, "Şəbəkə xətası.", null);
    }
  },

  update: async (
    id: string | number,
    values: IReturnTypeFormValues,
  ): Promise<ApiResult<200, null> | ApiResult<400 | 422, any>> => {
    const url = urlMaker("/api/admin/return_reasons/edit");
    const body = new FormData();
    body.append("return_reason_id", String(id));
    body.append("reason", values.name);
    try {
      const response = await caller(url, { method: "POST", body });
      if (response.ok) return new ApiResult(200, null, null);
      const result = await response.json();
      if (response.status === 400)
        return new ApiResult(422, result.errors || {}, null);
      return new ApiResult(400, "Xəta baş verdi.", null);
    } catch {
      return new ApiResult(400, "Şəbəkə xətası.", null);
    }
  },

  delete: async (
    ids: (string | number)[],
  ): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
    const url = urlMaker("/api/admin/return_reasons/cancel", {
      return_reason_id: ids,
    });
    try {
      const response = await caller(url, { method: "POST" });
      if (response.ok) return new ApiResult(200, null, null);
      return new ApiResult(400, "Silinmə zamanı xəta baş verdi.", null);
    } catch {
      return new ApiResult(400, "Şəbəkə xətası.", null);
    }
  },
};
