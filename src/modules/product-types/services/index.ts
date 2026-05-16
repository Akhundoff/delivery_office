import { ApiResult, caller, urlMaker } from "@shared/utils";
import { IProductType, IProductTypeFormValues } from "../interfaces";

const toDomain = (item: any): IProductType => ({
  id: item.id,
  name: item.name,
  nameAz: item.name_az || item.name,
  nameEn: item.name_en || "",
  nameRu: item.name_ru || "",
  nameTr: item.name_tr || "",
  status: item.state_id ? { id: item.state_id, name: item.state_name || "" } : null,
});

export const ProductTypesService = {
  getList: async (query: Record<string, any> = {}): Promise<ApiResult<200, { data: IProductType[]; total: number }> | ApiResult<400, string>> => {
    const url = urlMaker("/api/admin/product-types/getlist", { page: 1, per_page: 20, ...query });
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

  getById: async (id: string | number): Promise<ApiResult<200, IProductType> | ApiResult<400, string>> => {
    const url = urlMaker("/api/admin/product-types/getinfo", { product_type_id: id });
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

  create: async (values: IProductTypeFormValues): Promise<ApiResult<200, null> | ApiResult<400 | 422, any>> => {
    const url = urlMaker("/api/admin/product-types/create");
    const body = new FormData();
    body.append("name", values.name);
    body.append("name_en", values.nameEn);
    body.append("name_ru", values.nameRu);
    body.append("name_tr", values.nameTr);
    if (values.statusId) body.append("state_id", values.statusId);
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

  update: async (id: string | number, values: IProductTypeFormValues): Promise<ApiResult<200, null> | ApiResult<400 | 422, any>> => {
    const url = urlMaker("/api/admin/product-types/edit");
    const body = new FormData();
    body.append("product_type_id", String(id));
    body.append("name", values.name);
    body.append("name_en", values.nameEn);
    body.append("name_ru", values.nameRu);
    body.append("name_tr", values.nameTr);
    if (values.statusId) body.append("state_id", values.statusId);
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
    const url = urlMaker("/api/admin/product-types/cancel", { product_type_id: ids });
    try {
      const response = await caller(url, { method: "POST" });
      if (response.ok) return new ApiResult(200, null, null);
      return new ApiResult(400, "Silinmə zamanı xəta baş verdi.", null);
    } catch {
      return new ApiResult(400, "Şəbəkə xətası.", null);
    }
  },
};
