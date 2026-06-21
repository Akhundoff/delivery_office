import { ApiResult, caller, urlMaker } from '@shared/utils';
import { IArchiveStatus } from '../interfaces';

type ListResponse = { data: IArchiveStatus[]; total: number };

const toDomain = (p: any): IArchiveStatus => ({
  id: p.id,
  user: p.user_id ? { id: p.user_id, name: p.user_name } : null,
  model: p.model_id ? { id: p.model_id, name: p.model_name } : null,
  objectId: p.object_id,
  state: p.state_id ? { id: p.state_id, name: p.state_name } : null,
  createdAt: p.created_at,
});

export const ArchiveStatusService = {
  getList: async (query: Record<string, any> = {}): Promise<ApiResult<200, ListResponse> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/states/archive', query);
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
};
