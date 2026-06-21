import { ApiResult, caller, urlMaker } from '@shared/utils';
import { ICourier, IDetailedCourier, IDelivererAssignment, CreateCourierDto, ICourierPaymentDetails, IDelivererReason, ICourierStatusExecution, IAzerpostBranch, ICourierCost } from '../interfaces';

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

  getById: async (id: string | number): Promise<ApiResult<200, IDetailedCourier> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/couriers/info', { courier_id: id });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        const p = result.data;
        const detailed: IDetailedCourier = {
          id: p.id,
          documentNumber: p.document_number || '',
          postBranch: p.post_branch || '',
          user: { id: p.user_id, name: p.user_name || '' },
          branch: { id: p.branch_index, name: p.branch_name || '' },
          status: { id: p.state_id, name: p.state_name || '' },
          region: { id: p.region_id ?? null, name: p.region_name || '' },
          recipient: p.recipient || '',
          address: p.address || '',
          phoneNumber: p.phone || '',
          price: parseFloat(p.price) || 0,
          totalPrice: p.all_price || parseFloat(p.price) || 0,
          courierPrice: parseFloat(p.courier_price) || 0,
          paid: !!p.payed,
          declarations: {
            quantity: p.quantity || 0,
            weight: parseFloat(p.weight) || 0,
            items: (p.declarations || []).map((d: any) => ({
              id: d.id,
              trackCode: d.track_code,
              globalTrackCode: d.global_track_code || '',
              weight: parseFloat(d.weight || '0'),
              quantity: d.quantity,
              productPrice: parseFloat(d.price || '0'),
              deliveryPrice: d.delivery_price || 0,
              penaltyPrice: parseFloat(d.penalty_price || '0'),
              paid: !!d.payed,
              shop: d.shop_name || '',
              createdAt: d.created_at || '',
            })),
          },
          read: !p.is_new,
          description: p.descr || '',
          isAzerpost: !!p.is_azerpost,
          createdAt: p.created_at || '',
          azerpost: p.azerpost_data?.data
            ? {
                orderId: p.azerpost_data.data.order_id || '',
                vendorId: p.azerpost_data.data.vendor_id || '',
                packageId: p.azerpost_data.data.package_id || '',
                deliveryPostCode: p.azerpost_data.data.delivery_post_code || '',
                packageWeight: p.azerpost_data.data.package_weight || '',
                customerAddress: p.azerpost_data.data.customer_address || '',
                firstName: p.azerpost_data.data.first_name || '',
                lastName: p.azerpost_data.data.last_name || '',
                email: p.azerpost_data.data.email || '',
                phoneNo: p.azerpost_data.data.phone_no || '',
                deliveryType: p.azerpost_data.data.delivery_type || '',
                charge: p.azerpost_data.data.charge || '',
                orderStatus: p.azerpost_data.data.order_status || '',
                createdAt: p.azerpost_data.data.created_at || '',
                history: (p.azerpost_data.data.history || []).map((h: any) => ({ createdAt: h.created_at || '', details: h.details || '' })),
              }
            : undefined,
        };
        return new ApiResult(200, detailed, null);
      }
      return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası', null);
    }
  },

  getStatusExecution: async (id: string | number): Promise<ApiResult<200, ICourierStatusExecution[]> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/couriers/getstates', { courier_id: id });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        const data: ICourierStatusExecution[] = (result.data || []).map((item: any) => ({
          id: item.id,
          name: item.state_name,
          date: item.date || null,
          executor: item.user_name || null,
        }));
        return new ApiResult(200, data, null);
      }
      return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası', null);
    }
  },

  getPaymentDetails: async (ids: (string | number)[]): Promise<ApiResult<200, ICourierPaymentDetails> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/couriers/pay', { 'courier_id[]': ids, confirm: false });
    try {
      const response = await caller(url, { method: 'POST' });
      if (response.ok) {
        const result = await response.json();
        const v = result.values || {};
        const c = result.converted || {};
        const details: ICourierPaymentDetails = {
          balance: { usd: parseFloat(v.balance_usd) || 0, try: parseFloat(v.balance_try) || 0, usdToAzn: parseFloat(c.balance_usd) || 0, tryToAzn: parseFloat(c.balance_try) || 0 },
          debts: { usd: parseFloat(v.credit_usd) || 0, try: parseFloat(v.credit_try) || 0, usdToAzn: parseFloat(c.credit_usd) || 0, tryToAzn: parseFloat(c.credit_try) || 0 },
          courierPrice: { azn: parseFloat(c.courier_azn) || 0 },
          deliveryPrice: { azn: parseFloat(c.delivery_price) || 0, usd: parseFloat(v.credit_usd) || 0 },
          minimalPayment: { azn: parseFloat(c.minimal) || 0 },
          fullPayment: { azn: parseFloat(c.all_credit) || 0 },
        };
        return new ApiResult(200, details, null);
      }
      return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası', null);
    }
  },

  handover: async (ids: (string | number)[], amount: string): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/couriers/pay');
    const body = new FormData();
    ids.forEach((id) => body.append('courier_id[]', String(id)));
    body.append('amount', amount);
    try {
      const response = await caller(url, { method: 'POST', body });
      if (response.ok) return new ApiResult(200, null, null);
      return new ApiResult(400, 'Əməliyyat uğursuz oldu', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası', null);
    }
  },

  assignDeliverer: async (courierIds: (string | number)[], delivererId: string | number): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/couriers/edit/state', { 'courier_id[]': courierIds, state_id: 13, deliverer_id: delivererId });
    try {
      const response = await caller(url, { method: 'POST' });
      if (response.ok) return new ApiResult(200, null, null);
      return new ApiResult(400, 'Əməliyyat uğursuz oldu', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası', null);
    }
  },

  cancelDeliverer: async (ids: (string | number)[], reasonId: string | number): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/couriers/deliverer_cancel', { 'courier_id[]': ids, reason_id: reasonId });
    try {
      const response = await caller(url, { method: 'POST' });
      if (response.ok) return new ApiResult(200, null, null);
      return new ApiResult(400, 'Əməliyyat uğursuz oldu', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası', null);
    }
  },

  getDelivererReasons: async (): Promise<ApiResult<200, IDelivererReason[]> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/couriers/deliverer/reasons');
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        const data: IDelivererReason[] = (result.data || []).map((item: any) => ({ id: item.id, name: item.name }));
        return new ApiResult(200, data, null);
      }
      return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası', null);
    }
  },

  updateRead: async (ids: (string | number)[], read: boolean): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/isnew', { model_id: 3, object_id: ids, is_new: read ? 1 : 0 });
    try {
      const response = await caller(url, { method: 'POST' });
      if (response.ok) return new ApiResult(200, null, null);
      return new ApiResult(400, 'Əməliyyat uğursuz oldu', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası', null);
    }
  },

  bulkChangeStatus: async (query: Record<string, any>, statusId: string | number): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/v2/couriers/edit/state', { ...query, new_state_id: statusId });
    try {
      const response = await caller(url, { method: 'POST' });
      if (response.ok) return new ApiResult(200, null, null);
      return new ApiResult(400, 'Status dəyişdirilə bilmədi', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası', null);
    }
  },

  azerpostChangeStatus: async (ids: (string | number)[], statusId: string | number): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/azerpost/status', { courier_id: ids, charge_status: statusId });
    try {
      const response = await caller(url, { method: 'POST' });
      if (response.ok) return new ApiResult(200, null, null);
      return new ApiResult(400, 'Əməliyyat uğursuz oldu', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası', null);
    }
  },

  azerpostCreate: async (ids: (string | number)[]): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/azerpost/create', { courier_id: ids });
    try {
      const response = await caller(url, { method: 'POST' });
      if (response.ok) return new ApiResult(200, null, null);
      return new ApiResult(400, 'Əməliyyat uğursuz oldu', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası', null);
    }
  },

  azerpostDelete: async (ids: (string | number)[]): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/azerpost/delete', { courier_id: ids });
    try {
      const response = await caller(url, { method: 'POST' });
      if (response.ok) return new ApiResult(200, null, null);
      return new ApiResult(400, 'Əməliyyat uğursuz oldu', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası', null);
    }
  },

  getAzerpostBranches: async (regionId: string | number): Promise<ApiResult<200, IAzerpostBranch[]> | ApiResult<400, string>> => {
    const url = urlMaker('/api/client/azerpost/branches', { region_id: regionId });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        return new ApiResult(200, result.data || [], null);
      }
      return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası', null);
    }
  },

  getCourierCost: async (declarationIds: (string | number)[], regionId: string | number, shipping: 0 | 1, postBranch?: string): Promise<ApiResult<200, ICourierCost> | ApiResult<400, string>> => {
    const params: Record<string, any> = { region_id: regionId };
    if (shipping && postBranch) params.post_branch = postBranch;
    const queryString = declarationIds.map((id) => `declaration_id[]=${id}`).join('&');
    const url = urlMaker('/api/admin/couriers/get_courier_cost', params) + (queryString ? `&${queryString}` : '');
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        return new ApiResult(200, result.data, null);
      }
      return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası', null);
    }
  },

  getPriceExcel: async (query: Record<string, any> = {}): Promise<ApiResult<200, Blob> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/couriers/courier_price', query);
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
