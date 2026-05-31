import { ApiResult, caller, urlMaker } from '@shared/utils';
import { ICourier, IDelivererAssignment, CreateCourierDto } from '../interfaces';

const toDomain = (p: any): ICourier => ({
  id: p.id,
  user: { id: p.user_id, name: p.user_name || '' },
  branch: { id: p.branch_index, name: p.branch_name || '' },
  status: { id: p.state_id, name: p.state_name || '' },
  region: { id: p.region_id ?? null, name: p.region_name || '' },
  recipient: p.recipient || '',
  address: p.address || '',
  phoneNumber: p.phone || '',
  price: parseFloat(p.price) || 0,
  totalPrice: parseFloat(p.total_price) || 0,
  paid: !!p.payed,
  declarations: p.declarations ? String(p.declarations).split(',').filter(Boolean).map(Number) : [],
  read: !p.is_new,
  description: p.descr || '',
  isAzerpost: !!p.is_azerpost,
  createdAt: p.created_at || '',
  courierPrice: parseFloat(p.courier_price) || 0,
});

// Reused by statistics drill-down modals to map getlist rows into ICourier.
export const courierRowToDomain = toDomain;

export const CouriersService = {
  getList: async (query: Record<string, any> = {}): Promise<ApiResult<200, { data: ICourier[]; total: number }> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/v2/couriers/getlist', { page: 1, per_page: 20, ...query });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        return new ApiResult(200, { data: (result.data || []).map(toDomain), total: result.total || 0 }, null);
      }
      return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası', null);
    }
  },

  create: async (dto: CreateCourierDto): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
    const url = urlMaker(dto.id ? '/api/admin/couriers/edit' : '/api/admin/couriers/create');
    const body = new FormData();
    if (dto.id) body.append('courier_id', dto.id);
    body.append('user_id', dto.userId);
    if (dto.regionId) body.append('region_id', dto.regionId);
    body.append('recipient', dto.recipient);
    body.append('phone', dto.phoneNumber);
    dto.declarationIds.forEach((id) => body.append('declaration_id[]', id));
    body.append('price', dto.price);
    body.append('courier_price', dto.courierPrice);
    body.append('address', dto.address);
    body.append('payed', Number(dto.paid).toString());
    body.append('descr', dto.description);
    try {
      const response = await caller(url, { method: 'POST', body });
      if (response.ok) return new ApiResult(200, null, null);
      return new ApiResult(400, 'Əməliyyat uğursuz oldu', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası', null);
    }
  },

  cancel: async (ids: number[]): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/couriers/cancel', { courier_id: ids });
    try {
      const response = await caller(url, { method: 'POST' });
      if (response.ok) return new ApiResult(200, null, null);
      return new ApiResult(400, 'Silmə uğursuz oldu', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası', null);
    }
  },

  changeStatus: async (ids: number[], statusId: number): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/couriers/edit/state', { courier_id: ids, state_id: statusId });
    try {
      const response = await caller(url, { method: 'POST' });
      if (response.ok) return new ApiResult(200, null, null);
      return new ApiResult(400, 'Status dəyişdirilə bilmədi', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası', null);
    }
  },

  getExcel: async (query: Record<string, any> = {}): Promise<ApiResult<200, Blob> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/couriers/export', query);
    try {
      const response = await caller(url);
      if (response.ok) {
        const blob = await response.blob();
        return new ApiResult(200, blob, null);
      }
      return new ApiResult(400, 'Export uğursuz oldu', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası', null);
    }
  },

  getDelivererAssignments: async (query: Record<string, any> = {}): Promise<ApiResult<200, { data: IDelivererAssignment[]; total: number }> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/couriers/deliverer', { page: 1, per_page: 20, ...query });
    try {
      const response = await caller(url);
      if (response.ok) {
        const body = await response.json();
        const data: IDelivererAssignment[] = (body.data || []).map((p: any) => ({
          id: p.id,
          client: { id: p.user_id, name: p.user_name || '' },
          deliverer: { id: p.deliverer_id, name: p.deliverer_name || '' },
          status: { id: p.state_id, name: p.state_name || '' },
          region: { id: p.region_id, name: p.region_name || '' },
          assignedAt: p.deliverer_date || '',
          createdAt: p.created_at || '',
        }));
        return new ApiResult(200, { data, total: body.total || 0 }, null);
      }
      return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası', null);
    }
  },

  removeDelivererAssignments: async (ids: number[]): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/couriers/deliverer/cancel', { courier_deliverer_id: ids });
    try {
      const response = await caller(url, { method: 'POST' });
      if (response.ok) return new ApiResult(200, null, null);
      return new ApiResult(400, 'Əməliyyat uğursuz oldu', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası', null);
    }
  },

  getDelivererAssignmentsExcel: async (query: Record<string, any> = {}): Promise<ApiResult<200, Blob> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/couriers/deliverer_export', query);
    try {
      const response = await caller(url);
      if (response.ok) {
        const blob = await response.blob();
        return new ApiResult(200, blob, null);
      }
      return new ApiResult(400, 'Export uğursuz oldu', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası', null);
    }
  },
};
