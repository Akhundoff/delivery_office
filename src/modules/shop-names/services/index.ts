import { ApiResult, caller, urlMaker } from "@shared/utils";
import { IShopName, IShopNameFormValues } from "../interfaces";

const toDomain = (item: any): IShopName => ({
  id: item.id,
  name: item.name,
  countryId: item.country_id || null,
  countryName: item.country_name || null,
  createdAt: item.created_at,
});

export const ShopNamesService = {
  getList: async (query: Record<string, any> = {}): Promise<ApiResult<200, { data: IShopName[]; total: number }> | ApiResult<400, string>> => {
    const url = urlMaker("/api/admin/shop_names", { page: 1, per_page: 20, ...query });
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

  getById: async (id: string | number): Promise<ApiResult<200, IShopName> | ApiResult<400, string>> => {
    const url = urlMaker("/api/admin/shop_names/info", { shop_name_id: id });
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

  create: async (values: IShopNameFormValues): Promise<ApiResult<200, null> | ApiResult<400 | 422, any>> => {
    const url = urlMaker("/api/admin/shop_names/create");
    const body = new FormData();
    body.append("name", values.name);
    if (values.countryId) body.append("country_id", values.countryId);
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

  update: async (id: string | number, values: IShopNameFormValues): Promise<ApiResult<200, null> | ApiResult<400 | 422, any>> => {
    const url = urlMaker("/api/admin/shop_names/edit");
    const body = new FormData();
    body.append("shop_name_id", String(id));
    body.append("name", values.name);
    if (values.countryId) body.append("country_id", values.countryId);
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
    const url = urlMaker("/api/admin/shop_names/cancel", { shop_name_id: ids });
    try {
      const response = await caller(url, { method: "POST" });
      if (response.ok) return new ApiResult(200, null, null);
      return new ApiResult(400, "Silinmə zamanı xəta baş verdi.", null);
    } catch {
      return new ApiResult(400, "Şəbəkə xətası.", null);
    }
  },
};
