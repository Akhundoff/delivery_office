import { ApiResult, caller, urlMaker } from "@shared/utils";
import { IRegion, IRegionFormValues } from "../interfaces";

const toDomain = (item: any): IRegion => ({
  id: item.id,
  name: item.name,
  price: parseFloat(item.price) || 0,
  courierPrice: item.courier_price || "",
  state: item.state_id ? { id: item.state_id, name: item.state_name || "" } : null,
  branches: Array.isArray(item.branch) ? item.branch.map((b: any) => ({ id: b.id, name: b.name })) : [],
  shipping: item.shipping || 0,
  description: item.descr || "",
  createdAt: item.created_at,
});

export const RegionsService = {
  getList: async (query: Record<string, any> = {}): Promise<ApiResult<200, { data: IRegion[]; total: number }> | ApiResult<400, string>> => {
    const url = urlMaker("/api/admin/regions/getlist", { page: 1, per_page: 20, ...query });
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

  getById: async (id: string | number): Promise<ApiResult<200, IRegion> | ApiResult<400, string>> => {
    const url = urlMaker("/api/admin/regions/getinfo", { region_id: id });
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

  create: async (values: IRegionFormValues): Promise<ApiResult<200, null> | ApiResult<400 | 422, any>> => {
    const url = urlMaker("/api/admin/regions/create");
    const body = new FormData();
    body.append("name", values.name);
    body.append("price", values.price);
    body.append("courier_price", values.courierPrice);
    body.append("shipping", values.shipping);
    body.append("descr", values.description);
    values.branchIds.forEach((bid) => body.append("branch_id[]", bid));
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

  update: async (id: string | number, values: IRegionFormValues): Promise<ApiResult<200, null> | ApiResult<400 | 422, any>> => {
    const url = urlMaker("/api/admin/regions/edit");
    const body = new FormData();
    body.append("region_id", String(id));
    body.append("name", values.name);
    body.append("price", values.price);
    body.append("courier_price", values.courierPrice);
    body.append("shipping", values.shipping);
    body.append("descr", values.description);
    values.branchIds.forEach((bid) => body.append("branch_id[]", bid));
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
    const url = urlMaker("/api/admin/regions/cancel", { region_id: ids });
    try {
      const response = await caller(url, { method: "POST" });
      if (response.ok) return new ApiResult(200, null, null);
      return new ApiResult(400, "Silinmə zamanı xəta baş verdi.", null);
    } catch {
      return new ApiResult(400, "Şəbəkə xətası.", null);
    }
  },
};
