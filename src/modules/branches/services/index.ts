import { ApiResult, caller, urlMaker } from "@shared/utils";
import { IBranchListItem, IBranchFormValues, IFlyexLocation } from "../interfaces";

const flyexLocationToDomain = (item: any): IFlyexLocation => ({
  id: item.id,
  name: item.name,
  address: item.address || "",
  lat: item.lat,
  lng: item.lng,
  mapUrl: item.map_url || "",
  scheduleDescription: item.schedule_description || "",
});

const toDomain = (item: any): IBranchListItem => ({
  id: item.id,
  name: item.name,
  descr: item.descr || "",
  address: item.address || "",
  phone: item.phone || "",
  email: item.email || "",
  workinghours: item.workinghours || "",
  isBranch: item.is_branch === 1,
  isRegionBranch: item.is_region_branch === 1,
  hide: item.hide === 1,
  sortingLetter: item.sorting_letter || "",
  latitude: item.latitude || "",
  longitude: item.longitude || "",
  mapUrl: item.map_url || "",
  parent: item.parent_id ? { id: item.parent_id, name: item.parent_branch_name || "" } : null,
  status: item.status_id ? { id: item.status_id, name: item.state_name || "" } : null,
  company: item.company_id ? { id: item.company_id, name: item.company_name || "" } : null,
  createdAt: item.created_at,
});

export const BranchesService = {
  getList: async (query: Record<string, any> = {}): Promise<ApiResult<200, { data: IBranchListItem[]; total: number }> | ApiResult<400, string>> => {
    const url = urlMaker("/api/admin/branches", { page: 1, per_page: 20, ...query });
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

  getById: async (id: string | number): Promise<ApiResult<200, IBranchListItem> | ApiResult<400, string>> => {
    const url = urlMaker("/api/admin/branches/info", { branch_id: id });
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

  create: async (values: IBranchFormValues): Promise<ApiResult<200, null> | ApiResult<400 | 422, any>> => {
    const url = urlMaker("/api/admin/branches/create");
    const body = new FormData();
    body.append("name", values.name);
    body.append("descr", values.descr);
    body.append("address", values.address);
    body.append("phone", values.phone);
    body.append("email", values.email);
    body.append("workinghours", values.workinghours);
    body.append("is_branch", values.isBranch ? "1" : "0");
    body.append("is_region_branch", values.isRegionBranch ? "1" : "0");
    body.append("hide", values.hide ? "1" : "0");
    body.append("latitude", values.latitude);
    body.append("longitude", values.longitude);
    body.append("map_url", values.mapUrl);
    body.append("sorting_letter", values.sortingLetter);
    body.append("open_hour", values.openHour);
    body.append("close_hour", values.closeHour);
    if (values.parentId) body.append("parent_id", values.parentId);
    if (values.stateId) body.append("state_id", values.stateId);
    if (values.companyId) body.append("company_id", values.companyId);
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

  update: async (id: string | number, values: IBranchFormValues): Promise<ApiResult<200, null> | ApiResult<400 | 422, any>> => {
    const url = urlMaker("/api/admin/branches/edit");
    const body = new FormData();
    body.append("branch_id", String(id));
    body.append("name", values.name);
    body.append("descr", values.descr);
    body.append("address", values.address);
    body.append("phone", values.phone);
    body.append("email", values.email);
    body.append("workinghours", values.workinghours);
    body.append("is_branch", values.isBranch ? "1" : "0");
    body.append("is_region_branch", values.isRegionBranch ? "1" : "0");
    body.append("hide", values.hide ? "1" : "0");
    body.append("latitude", values.latitude);
    body.append("longitude", values.longitude);
    body.append("map_url", values.mapUrl);
    body.append("sorting_letter", values.sortingLetter);
    body.append("open_hour", values.openHour);
    body.append("close_hour", values.closeHour);
    if (values.parentId) body.append("parent_id", values.parentId);
    if (values.stateId) body.append("state_id", values.stateId);
    if (values.companyId) body.append("company_id", values.companyId);
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
    const url = urlMaker("/api/admin/branches/cancel", { branch_id: ids });
    try {
      const response = await caller(url, { method: "POST" });
      if (response.ok) return new ApiResult(200, null, null);
      return new ApiResult(400, "Silinmə zamanı xəta baş verdi.", null);
    } catch {
      return new ApiResult(400, "Şəbəkə xətası.", null);
    }
  },

  getFlyexLocations: async (): Promise<ApiResult<200, IFlyexLocation[]> | ApiResult<400, string>> => {
    const url = urlMaker("/api/admin/flyex/locations");
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        return new ApiResult(200, (result.data || []).map(flyexLocationToDomain), null);
      }
      return new ApiResult(400, "Məlumatlar əldə edilə bilmədi", null);
    } catch {
      return new ApiResult(400, "Şəbəkə xətası.", null);
    }
  },

  createBranchesFromLocations: async (locationIds: (string | number)[]): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
    const url = urlMaker("/api/admin/flyex/create-from-locations", { location_ids: locationIds });
    try {
      const response = await caller(url, { method: "POST" });
      if (response.ok) return new ApiResult(200, null, null);
      const result = await response.json();
      if (response.status === 400) return new ApiResult(400, Object.values(result.errors || {}).flat().join(". "), null);
      return new ApiResult(400, "Filial yaradılmadı", null);
    } catch {
      return new ApiResult(400, "Şəbəkə xətası.", null);
    }
  },
};
