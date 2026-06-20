import { ApiResult, caller, urlMaker, appendToFormData, formDataFlat } from '@shared/utils';
import { IUser, IUserPersistence, IDetailedUser, IDetailedUserPersistence, CreateUserDto, CreateDiscountDto, IOperationGroup, IUserPermissions } from '../interfaces';
import { UserMapper, DetailedUserMapper } from '../mappers';

export const UsersService = {
  getUsers: async (query: Record<string, any> = {}): Promise<ApiResult<200, { data: IUser[]; total: number }> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/v2/client/list', {
      page: 1,
      per_page: 20,
      ...query,
    });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        return new ApiResult(
          200,
          {
            data: (result.data || []).map((u: IUserPersistence) => UserMapper.toDomain(u)),
            total: result.total || 0,
          },
          null,
        );
      }
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },

  getUserById: async (id: string | number): Promise<ApiResult<200, IDetailedUser> | ApiResult<400 | 500, string>> => {
    const url = urlMaker('/api/admin/client/user', { user_id: id });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        return new ApiResult(200, DetailedUserMapper.toDomain(result as IDetailedUserPersistence), null);
      }
      return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi', null);
    } catch {
      return new ApiResult(500, 'Şəbəkə ilə əlaqə qurula bilmədi', null);
    }
  },

  createUser: async (dto: CreateUserDto): Promise<ApiResult<200, null> | ApiResult<400 | 422 | 500, string>> => {
    const url = urlMaker('/api/admin/client/create');
    const body = new FormData();
    appendToFormData(UserMapper.toPersistence(dto), body);
    try {
      const response = await caller(url, { method: 'POST', body });
      if (response.ok) return new ApiResult(200, null, null);
      const result = await response.json();
      if (response.status === 400) {
        const messages = Object.values(result.errors || {})
          .flat()
          .join('. ');
        return new ApiResult(422, messages || 'Xəta baş verdi', null);
      }
      return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi', null);
    } catch {
      return new ApiResult(500, 'Şəbəkə ilə əlaqə qurula bilmədi', null);
    }
  },

  updateUser: async (id: string | number, dto: CreateUserDto): Promise<ApiResult<200, null> | ApiResult<400 | 422 | 500, string>> => {
    const url = urlMaker('/api/admin/client/update');
    const body = new FormData();
    appendToFormData(UserMapper.toPersistence(dto, id), body);
    try {
      const response = await caller(url, { method: 'POST', body });
      if (response.ok) return new ApiResult(200, null, null);
      const result = await response.json();
      if (response.status === 400) {
        const messages = Object.values(result.errors || {})
          .flat()
          .join('. ');
        return new ApiResult(422, messages || 'Xəta baş verdi', null);
      }
      return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi', null);
    } catch {
      return new ApiResult(500, 'Şəbəkə ilə əlaqə qurula bilmədi', null);
    }
  },

  deleteUser: async (id: string | number): Promise<ApiResult<200, null> | ApiResult<400 | 500, string>> => {
    const url = urlMaker('/api/admin/client/delete', { user_id: id });
    try {
      const response = await caller(url, { method: 'POST' });
      if (response.ok) return new ApiResult(200, null, null);
      return new ApiResult(400, 'Silinmə zamanı xəta baş verdi', null);
    } catch {
      return new ApiResult(500, 'Şəbəkə ilə əlaqə qurula bilmədi', null);
    }
  },

  getDiscountUsers: async (query: Record<string, any> = {}): Promise<ApiResult<200, { data: IUser[]; total: number }> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/user_discounts', {
      page: 1,
      per_page: 20,
      ...query,
    });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        return new ApiResult(
          200,
          {
            data: (result.data || []).map((u: IUserPersistence) => UserMapper.toDomain(u)),
            total: result.total || 0,
          },
          null,
        );
      }
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },

  createDiscount: async (userId: string | number, dto: CreateDiscountDto): Promise<ApiResult<200, null> | ApiResult<400 | 422 | 500, string>> => {
    const url = urlMaker('/api/admin/users/discount');
    const body = new FormData();
    appendToFormData(UserMapper.discountToPersistence(userId, dto), body);
    try {
      const response = await caller(url, { method: 'POST', body });
      if (response.ok) return new ApiResult(200, null, null);
      const result = await response.json();
      if (response.status === 400) {
        const messages = Object.values(result.errors || {})
          .flat()
          .join('. ');
        return new ApiResult(422, messages || 'Xəta baş verdi', null);
      }
      return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi', null);
    } catch {
      return new ApiResult(500, 'Şəbəkə ilə əlaqə qurula bilmədi', null);
    }
  },

  getOperations: async (): Promise<ApiResult<200, IOperationGroup[]> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/operations');
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        const items: any[] = result.data || [];
        const modelIds = Array.from(new Set(items.map((i: any) => i.model_id)));
        const groups: IOperationGroup[] = modelIds
          .map((modelId) => {
            const group = items.find((i) => i.model_id === modelId);
            const operations = items.filter((i) => i.model_id === modelId).map((i) => ({ id: i.id, name: i.name, codeName: i.code_name }));
            return { id: modelId as number, name: group.model_name, operations };
          })
          .reverse();
        return new ApiResult(200, groups, null);
      }
      return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },

  getUserPermissions: async (userId: string | number): Promise<ApiResult<200, IUserPermissions> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/permissions', { user_id: userId });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        const permissionIds: number[] = (result.data || []).map((item: any) => item.operation_id);
        return new ApiResult(200, { permissionIds, companyId: result.company_id ?? 0 }, null);
      }
      return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },

  updateUserPermissions: async (userId: string | number, operationIds: number[], cashboxId?: number, adminBranchId?: number): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/permissions/edit');
    const body = new FormData();
    appendToFormData(formDataFlat({ user_id: userId, cashbox_id: cashboxId, admin_branch_id: adminBranchId }), body);
    operationIds.forEach((id) => body.append('operation_id[]', String(id)));
    try {
      const response = await caller(url, { method: 'POST', body });
      if (response.ok) return new ApiResult(200, null, null);
      const result = await response.json();
      const msg = result.errors ? (Object.values(result.errors) as string[][]).flat().join('. ') : 'Xəta baş verdi.';
      return new ApiResult(400, msg, null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },

  getUserByTrackCode: async (trackCode: string): Promise<ApiResult<200, IDetailedUser> | ApiResult<400 | 500, string>> => {
    const url = urlMaker('/api/admin/client/track_code', { track_code: trackCode });
    try {
      const response = await caller(url, { method: 'POST' });
      if (response.ok) {
        const result = await response.json();
        return new ApiResult(200, DetailedUserMapper.toDomain(result as IDetailedUserPersistence), null);
      }
      return new ApiResult(400, 'İstifadəçi tapılmadı.', null);
    } catch {
      return new ApiResult(500, 'Şəbəkə xətası.', null);
    }
  },

  blockUsers: async (userIds: (string | number)[], block: boolean): Promise<ApiResult<200, null> | ApiResult<400 | 500, string>> => {
    const url = urlMaker(block ? '/api/admin/client/block' : '/api/admin/client/unblock', { user_id: userIds });
    try {
      const response = await caller(url, { method: 'POST' });
      if (response.ok) return new ApiResult(200, null, null);
      const result = await response.json();
      const msg = result.errors ? (Object.values(result.errors) as string[][]).flat().join('. ') : 'Xəta baş verdi.';
      return new ApiResult(400, msg, null);
    } catch {
      return new ApiResult(500, 'Şəbəkə xətası.', null);
    }
  },

  updateUserRole: async (userIds: (string | number)[], role: string): Promise<ApiResult<200, null> | ApiResult<400 | 500, string>> => {
    const roleNum = ({ admin: '1', warehouseman: '2', 'back-office': '3', partner: '4' } as Record<string, string>)[role] ?? '0';
    const url = urlMaker('/api/admin/client/set_admin', { user_id: userIds, admin: roleNum });
    try {
      const response = await caller(url, { method: 'POST' });
      if (response.ok) return new ApiResult(200, null, null);
      const result = await response.json();
      const msg = result.errors ? (Object.values(result.errors) as string[][]).flat().join('. ') : 'Xəta baş verdi.';
      return new ApiResult(400, msg, null);
    } catch {
      return new ApiResult(500, 'Şəbəkə xətası.', null);
    }
  },

  exportExcel: async (query: Record<string, any> = {}): Promise<ApiResult<200, Blob> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/users/export', query);
    try {
      const response = await caller(url);
      if (response.ok) return new ApiResult(200, await response.blob(), null);
      return new ApiResult(400, 'Export xətası baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },

  getDiscountStats: async (userId: string | number): Promise<ApiResult<200, import('../interfaces').IDiscountStat[]> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/users/declaration_stats', { user_id: userId });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        const items: import('../interfaces').IDiscountStat[] = (result.data || []).map((s: any) => ({
          month: s.month,
          date: s.date,
          weight: s.weight,
          quantity: s.quantity,
          deliveryPrice: s.delivery_price,
          monthName: s.month_name,
        }));
        items.sort((a, b) => (a.date > b.date ? 1 : a.date < b.date ? -1 : 0));
        return new ApiResult(200, items, null);
      }
      return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },

  exportDiscountUsersExcel: async (query: Record<string, any> = {}): Promise<ApiResult<200, Blob> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/user_discounts_export', query);
    try {
      const response = await caller(url);
      if (response.ok) return new ApiResult(200, await response.blob(), null);
      return new ApiResult(400, 'Export xətası baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },

  getAppUsers: async (query: Record<string, any> = {}): Promise<ApiResult<200, { data: import('../interfaces').IAppUser[]; total: number }> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/users/app/options', query);
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        return new ApiResult(200, { data: result.data ?? [], total: result.total ?? 0 }, null);
      }
      return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },

  removeDiscount: async (discountId: string | number): Promise<ApiResult<200, null> | ApiResult<400 | 500, string>> => {
    const url = urlMaker('/api/admin/users/discountCancel');
    const body = new FormData();
    appendToFormData(formDataFlat({ user_discount_id: discountId }), body);
    try {
      const response = await caller(url, { method: 'POST', body });
      if (response.ok) return new ApiResult(200, null, null);
      const result = await response.json();
      const msg = result.errors ? (Object.values(result.errors) as string[][]).flat().join('. ') : 'Xəta baş verdi.';
      return new ApiResult(400, msg, null);
    } catch {
      return new ApiResult(500, 'Şəbəkə xətası.', null);
    }
  },
};
