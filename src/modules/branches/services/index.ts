import { ApiResult, caller, urlMaker, appendToFormData } from '@shared/utils';
import { IBranchListItem, IBranchDetail, IBranchFormValues, IBranchWithDeliveryPoint, IFlyexLocation } from '../interfaces';

const flyexLocationToDomain = (item: any): IFlyexLocation => ({
  id: item.id,
  name: item.name,
  address: item.address || '',
  lat: item.lat,
  lng: item.lng,
  mapUrl: item.map_url || '',
  scheduleDescription: item.schedule_description || '',
});

const toDomain = (item: any): IBranchListItem => ({
  id: item.id,
  name: item.name,
  descr: item.descr || '',
  address: item.address || '',
  phone: item.phone || '',
  email: item.email || '',
  workinghours: item.workinghours || '',
  isBranch: item.is_branch === 1,
  isRegionBranch: item.is_region_branch === 1,
  hide: item.hide === 1,
  sortingLetter: item.sorting_letter || '',
  latitude: item.latitude || '',
  longitude: item.longitude || '',
  mapUrl: item.map_url || '',
  parent: item.parent_id ? { id: item.parent_id, name: item.parent_branch_name || '' } : null,
  status: item.status_id ? { id: item.status_id, name: item.state_name || '' } : null,
  company: item.company_id ? { id: item.company_id, name: item.company_name || '' } : null,
  createdAt: item.created_at,
});

const toDetailDomain = (item: any): IBranchDetail => ({
  ...toDomain(item),
  mapAddress: item.map_address || '',
  openHour: item.open_hour || '',
  closeHour: item.close_hour || '',
  openHourSaturday: item.open_hour_saturday || '',
  closeHourSaturday: item.close_hour_saturday || '',
  cityName: item.city_name || '',
  provinceName: item.province_name || '',
  postCode: item.post_code || '',
  warehouseMan: item.warehouseman ? String(item.warehouseman) : '',
});

const formToPersistence = (values: IBranchFormValues, id?: string | number): Record<string, string> => {
  const mapped: Record<string, string> = {
    name: values.name,
    descr: values.descr,
    address: values.address,
    phone: values.phone,
    email: values.email,
    workinghours: values.workinghours,
    is_branch: values.isBranch ? '1' : '0',
    is_region_branch: values.isRegionBranch ? '1' : '0',
    hide: values.hide ? '1' : '0',
    latitude: values.latitude,
    longitude: values.longitude,
    map_url: values.mapUrl,
    sorting_letter: values.sortingLetter,
    open_hour: values.openHour,
    close_hour: values.closeHour,
    open_hour_saturday: values.openHourSaturday,
    close_hour_saturday: values.closeHourSaturday,
    map_address: values.mapAddress,
    city_name: values.cityName,
    province_name: values.provinceName,
    post_code: values.postCode,
  };
  if (id) mapped.branch_id = String(id);
  if (values.parentId) mapped.parent_id = values.parentId;
  if (values.stateId) mapped.state_id = values.stateId;
  if (values.companyId) mapped.company_id = values.companyId;
  if (values.warehouseMan) mapped.warehouseman = values.warehouseMan;
  return mapped;
};

export const BranchesService = {
  getList: async (query: Record<string, any> = {}): Promise<ApiResult<200, { data: IBranchListItem[]; total: number }> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/branches', { page: 1, per_page: 20, ...query });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        const data = (result.data || []).map(toDomain);
        return new ApiResult(200, { data, total: result.total || data.length }, null);
      }
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },

  getById: async (id: string | number): Promise<ApiResult<200, IBranchDetail> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/branches/info', { branch_id: id });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        return new ApiResult(200, toDetailDomain(result.data), null);
      }
      return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },

  create: async (values: IBranchFormValues): Promise<ApiResult<200, null> | ApiResult<400 | 422, any>> => {
    const url = urlMaker('/api/admin/branches/create');
    const body = new FormData();
    appendToFormData(formToPersistence(values), body);
    try {
      const response = await caller(url, { method: 'POST', body });
      if (response.ok) return new ApiResult(200, null, null);
      const result = await response.json();
      if (response.status === 400) return new ApiResult(422, result.errors || {}, null);
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },

  update: async (id: string | number, values: IBranchFormValues): Promise<ApiResult<200, null> | ApiResult<400 | 422, any>> => {
    const url = urlMaker('/api/admin/branches/edit');
    const body = new FormData();
    appendToFormData(formToPersistence(values, id), body);
    try {
      const response = await caller(url, { method: 'POST', body });
      if (response.ok) return new ApiResult(200, null, null);
      const result = await response.json();
      if (response.status === 400) return new ApiResult(422, result.errors || {}, null);
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },

  delete: async (ids: (string | number)[]): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/branches/cancel', { branch_id: ids });
    try {
      const response = await caller(url, { method: 'POST' });
      if (response.ok) return new ApiResult(200, null, null);
      return new ApiResult(400, 'Silinmə zamanı xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },

  getFlyexLocations: async (): Promise<ApiResult<200, IFlyexLocation[]> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/flyex/locations');
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        return new ApiResult(200, (result.data || []).map(flyexLocationToDomain), null);
      }
      return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },

  getAzerpostBranches: async (query: Record<string, any> = {}): Promise<ApiResult<200, { data: IBranchListItem[]; total: number }> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/azerpost/branches', { page: 1, per_page: 5000, ...query });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        const data = (result.data || []).map(toDomain);
        return new ApiResult(200, { data, total: result.total || data.length }, null);
      }
      return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },

  getBranchesWithDeliveryPoints: async (query: Record<string, any> = {}): Promise<ApiResult<200, { data: IBranchWithDeliveryPoint[]; total: number }> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/branches', { page: 1, per_page: 5000, ...query });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        const data: IBranchWithDeliveryPoint[] = (result.data || []).map((item: any) => ({ id: item.id, name: item.name, companyId: item.company_id }));
        return new ApiResult(200, { data, total: result.total || data.length }, null);
      }
      return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },

  createBranchesFromLocations: async (locationIds: (string | number)[]): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/flyex/create-from-locations', { location_ids: locationIds });
    try {
      const response = await caller(url, { method: 'POST' });
      if (response.ok) return new ApiResult(200, null, null);
      const result = await response.json();
      if (response.status === 400)
        return new ApiResult(
          400,
          Object.values(result.errors || {})
            .flat()
            .join('. '),
          null,
        );
      return new ApiResult(400, 'Filial yaradılmadı', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },
};
