import { ApiResult, caller, urlMaker } from "@shared/utils";
import { IBranchPartner, IBranchPartnerFormValues } from "../interfaces";

const toDomain = (item: any): IBranchPartner => ({
  id: item.id,
  name: item.name,
  isOwner: item.is_owner === 1 || item.is_owner === true,
  description: item.descr || "",
  contact: item.contact || "",
  state: item.state_id ? { id: item.state_id, name: item.state_name || "" } : null,
  createdAt: item.created_at,
});

export const BranchPartnersService = {
  getList: async (query: Record<string, any> = {}): Promise<ApiResult<200, { data: IBranchPartner[]; total: number }> | ApiResult<400, string>> => {
    const url = urlMaker("/api/admin/companies", { page: 1, per_page: 20, ...query });
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

  getById: async (id: string | number): Promise<ApiResult<200, IBranchPartner> | ApiResult<400, string>> => {
    const url = urlMaker("/api/admin/companies/info", { company_id: id });
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

  create: async (values: IBranchPartnerFormValues): Promise<ApiResult<200, null> | ApiResult<400 | 422, any>> => {
    const url = urlMaker("/api/admin/companies/create");
    const body = new FormData();
    body.append("name", values.name);
    body.append("is_owner", values.isOwner ? "1" : "0");
    body.append("descr", values.description);
    body.append("contact", values.contact);
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

  update: async (id: string | number, values: IBranchPartnerFormValues): Promise<ApiResult<200, null> | ApiResult<400 | 422, any>> => {
    const url = urlMaker("/api/admin/companies/edit");
    const body = new FormData();
    body.append("company_id", String(id));
    body.append("name", values.name);
    body.append("is_owner", values.isOwner ? "1" : "0");
    body.append("descr", values.description);
    body.append("contact", values.contact);
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
    const url = urlMaker("/api/admin/companies/delete", { company_id: ids });
    try {
      const response = await caller(url);
      if (response.ok) return new ApiResult(200, null, null);
      return new ApiResult(400, "Silinmə zamanı xəta baş verdi.", null);
    } catch {
      return new ApiResult(400, "Şəbəkə xətası.", null);
    }
  },
};
