import { ApiResult, caller, urlMaker } from "@shared/utils";
import { IShop, IShopType, IShopFormValues } from "../interfaces";

type ListResponse = { data: IShop[]; total: number };

const toDomain = (p: any): IShop => ({
  id: p.id,
  label: p.label,
  logo: p.logo ?? "",
  categoryIds: Array.isArray(p.categoryId) ? p.categoryId.map(Number) : p.category_id ? [Number(p.category_id)] : [],
  categoryName: p.categoryName ?? p.category_name ?? "",
  countryId: p.countryId ?? p.country_id,
  url: p.url ?? "",
});

export const ShopsService = {
  getList: async (query: Record<string, any> = {}): Promise<ApiResult<200, ListResponse> | ApiResult<400, string>> => {
    const url = urlMaker("/api/client/shop", { page: 1, per_page: 20, ...query });
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

  getById: async (id: string | number): Promise<ApiResult<200, IShop> | ApiResult<400, string>> => {
    const url = urlMaker(`/api/client/shop/${id}`);
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

  getCategories: async (): Promise<ApiResult<200, IShopType[]> | ApiResult<400, string>> => {
    const url = urlMaker("/api/admin/shop/categories", { page: 1, per_page: 1000 });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        const list: IShopType[] = (result.data?.data ?? result.data ?? []).map((c: any) => ({ id: c.id, name: c.name }));
        return new ApiResult(200, list, null);
      }
      return new ApiResult(400, "Xəta baş verdi.", null);
    } catch {
      return new ApiResult(400, "Şəbəkə xətası.", null);
    }
  },

  create: async (values: IShopFormValues): Promise<ApiResult<200, null> | ApiResult<422, unknown> | ApiResult<400, string>> => {
    const body = new FormData();
    body.append("label", values.label);
    body.append("url", values.url);
    body.append("country_id", values.countryId);
    values.categoryIds.forEach((c) => body.append("category_id[]", c));
    if (values.logo) body.append("logo", values.logo);
    try {
      const response = await caller("/api/admin/shop/create", { method: "POST", body });
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

  update: async (id: string | number, values: IShopFormValues): Promise<ApiResult<200, null> | ApiResult<422, unknown> | ApiResult<400, string>> => {
    const body = new FormData();
    body.append("shop_id", String(id));
    body.append("label", values.label);
    body.append("url", values.url);
    body.append("country_id", values.countryId);
    values.categoryIds.forEach((c) => body.append("category_id[]", c));
    if (values.logo) body.append("logo", values.logo);
    try {
      const response = await caller("/api/admin/shop/edit", { method: "POST", body });
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
    const url = urlMaker("/api/admin/shop/cancel", { shop_id: ids.join(",") });
    try {
      const response = await caller(url, { method: "POST" });
      if (response.ok) return new ApiResult(200, null, null);
      return new ApiResult(400, "Xəta baş verdi.", null);
    } catch {
      return new ApiResult(400, "Şəbəkə xətası.", null);
    }
  },
};
