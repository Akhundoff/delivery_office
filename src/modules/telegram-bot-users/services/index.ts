import { ApiResult, caller, urlMaker } from '@shared/utils';
import { ITelegramBotUser } from '../interfaces';

type ListResponse = { data: ITelegramBotUser[]; total: number };

const toDomain = (p: any): ITelegramBotUser => ({
  id: p.id,
  telegram: { id: p.telegram_id ?? null, name: p.telegram_name ?? null },
  user: { id: p.user_id ?? null },
  hasAccess: !!p.has_access,
  createdAt: p.created_at,
  updatedAt: p.updated_at,
});

export const TelegramBotUsersService = {
  getList: async (query: Record<string, any> = {}): Promise<ApiResult<200, ListResponse> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/telegram-users', { page: 1, per_page: 20, ...query });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        const data = (result.data || []).map(toDomain);
        return new ApiResult(200, { data, total: result.total ?? data.length }, null);
      }
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },

  grant: async (dto: { id: number; user_id: number; has_access: '1' | '0' }): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
    const body = new FormData();
    body.append('id', String(dto.id));
    body.append('user_id', String(dto.user_id));
    body.append('has_access', dto.has_access);
    try {
      const response = await caller('/api/admin/telegram-users/grant', { method: 'POST', body });
      if (response.ok) return new ApiResult(200, null, null);
      return new ApiResult(400, 'Xəta baş verdi.', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası.', null);
    }
  },
};
