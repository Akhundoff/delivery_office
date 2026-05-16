import { ApiResult, caller, urlMaker } from "@shared/utils";
import { IPlan, IPlanFormValues } from "../interfaces";

const toDomain = (item: any): IPlan => ({
  id: item.id,
  weight: {
    from: parseFloat(item.from_weight),
    to: item.to_weight ? parseFloat(item.to_weight) : null,
  },
  price: parseFloat(item.price),
  oldPrice: parseFloat(item.old_price),
  countryId: item.country_id,
  type: parseInt(item.type) === 1 ? "maye" : "digər",
  tariffCategory: { id: item.tariff_category_id, name: item.tariff_category_name || "" },
  description: item.descr || "",
  currency: item.currency || "USD",
});

export const PlansService = {
  getList: async (query: Record<string, any> = {}): Promise<ApiResult<200, { data: IPlan[]; total: number }> | ApiResult<400, string>> => {
    const url = urlMaker("/api/client/v2/tariff/list", { page: 1, per_page: 20, ...query });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        return new ApiResult(200, { data: (result.data || []).map(toDomain), total: result.total || 0 }, null);
      }
      return new ApiResult(400, "Xəta baş verdi.", null);
    } catch {
      return new ApiResult(400, "Şəbəkə xətası.", null);
    }
  },

  getById: async (id: string | number): Promise<ApiResult<200, IPlan> | ApiResult<400, string>> => {
    const url = urlMaker("/api/admin/tariff/getinfo", { tariff_id: id });
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

  create: async (values: IPlanFormValues): Promise<ApiResult<200, null> | ApiResult<400 | 422, any>> => {
    const url = urlMaker("/api/admin/tariff/create");
    const body = new FormData();
    body.append("country_id", values.countryId);
    body.append("from_weight", values.weightFrom);
    body.append("to_weight", values.weightTo);
    body.append("price", values.price);
    body.append("old_price", values.oldPrice);
    body.append("descr", values.description);
    body.append("type", values.isLiquid ? "1" : "0");
    body.append("tariff_category_id", values.categoryId);
    body.append("currency", "USD");
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

  update: async (id: string | number, values: IPlanFormValues): Promise<ApiResult<200, null> | ApiResult<400 | 422, any>> => {
    const url = urlMaker("/api/admin/tariff/edit");
    const body = new FormData();
    body.append("tariff_id", String(id));
    body.append("country_id", values.countryId);
    body.append("from_weight", values.weightFrom);
    body.append("to_weight", values.weightTo);
    body.append("price", values.price);
    body.append("old_price", values.oldPrice);
    body.append("descr", values.description);
    body.append("type", values.isLiquid ? "1" : "0");
    body.append("tariff_category_id", values.categoryId);
    body.append("currency", "USD");
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
    const url = urlMaker("/api/admin/tariff/cancel", { tariff_id: ids });
    try {
      const response = await caller(url, { method: "POST" });
      if (response.ok) return new ApiResult(200, null, null);
      return new ApiResult(400, "Silinmə zamanı xəta baş verdi.", null);
    } catch {
      return new ApiResult(400, "Şəbəkə xətası.", null);
    }
  },
};
