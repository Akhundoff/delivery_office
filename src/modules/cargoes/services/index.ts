import { ApiResult, caller, urlMaker } from "@shared/utils";
import { ICargo, ICargoFormValues } from "../interfaces";

const toDomain = (item: any): ICargo => ({
  id: item.id,
  name: item.cargo_name,
  description: item.descr || "",
  createdAt: item.created_at,
});

export const CargoesService = {
  getList: async (
    query: Record<string, any> = {},
  ): Promise<
    ApiResult<200, { data: ICargo[]; total: number }> | ApiResult<400, string>
  > => {
    const url = urlMaker("/api/admin/cargoes", { page: 1, per_page: 20, ...query });
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

  getById: async (
    id: string | number,
  ): Promise<ApiResult<200, ICargo> | ApiResult<400, string>> => {
    const url = urlMaker("/api/admin/cargoes/info", { cargo_id: id });
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
    values: ICargoFormValues,
  ): Promise<ApiResult<200, null> | ApiResult<400 | 422, any>> => {
    const url = urlMaker("/api/admin/cargoes/create");
    const body = new FormData();
    body.append("cargo_name", values.name);
    body.append("descr", values.description);
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

  update: async (
    id: string | number,
    values: ICargoFormValues,
  ): Promise<ApiResult<200, null> | ApiResult<400 | 422, any>> => {
    const url = urlMaker("/api/admin/cargoes/edit");
    const body = new FormData();
    body.append("cargo_id", String(id));
    body.append("cargo_name", values.name);
    body.append("descr", values.description);
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

  delete: async (
    ids: (string | number)[],
  ): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
    const url = urlMaker("/api/admin/cargoes/cancel", { cargo_id: ids });
    try {
      const response = await caller(url, { method: "POST" });
      if (response.ok) return new ApiResult(200, null, null);
      return new ApiResult(400, "Silinmə zamanı xəta baş verdi.", null);
    } catch {
      return new ApiResult(400, "Şəbəkə xətası.", null);
    }
  },
};
