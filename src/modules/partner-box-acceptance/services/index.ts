import { ApiResult, caller, urlMaker } from '@shared/utils';
import { IPartnerBox } from '@modules/partner-boxes';
import { IAcceptanceDeclaration } from '../interfaces';

const toPartnerBox = (item: any) => ({
  id: item.id,
  name: item.container_name,
  branch: item.branch_id && item.branch_name ? { id: item.branch_id, name: item.branch_name } : null,
  user: item.user_id && item.user_name ? { id: item.user_id, name: item.user_name } : null,
  declarationCount: item.declaration_count || 0,
  createdAt: item.created_at,
});

const toDeclaration = (item: any): IAcceptanceDeclaration => ({
  trackCode: item.track_code,
  branch: item.branch_id ? { id: item.branch_id, name: item.branch_name } : null,
  flight: item.flight_id ? { id: item.flight_id, name: item.flight_name } : null,
  requiresDeclaration: !!item.requires_declaration,
  isYourBranch: item.is_your_branch !== false,
  canAccommodate: item.can_accommodate !== false,
  locationName: item.location_name || '',
});

export const PartnerBoxAcceptanceService = {
  getMyBox: async (): Promise<ApiResult<200, IPartnerBox | null> | ApiResult<400, string>> => {
    const url = urlMaker('/api/branchpartner/containers/me');
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        return new ApiResult(200, result.data ? toPartnerBox(result.data) : null, null);
      }
      return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası', null);
    }
  },

  selectBox: async (id: string | number): Promise<ApiResult<200, null> | ApiResult<400, string>> => {
    const url = urlMaker('/api/branchpartner/containers/select', { container_id: id });
    try {
      const response = await caller(url);
      if (response.ok) return new ApiResult(200, null, null);
      const result = await response.json();
      const msg = result.errors ? Object.values(result.errors).flat().join(', ') : 'Xəta baş verdi';
      return new ApiResult(400, msg as string, null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası', null);
    }
  },

  closeBox: async (trackCodes: string[], containerId: string): Promise<ApiResult<200, null> | ApiResult<400 | 422, any>> => {
    const url = urlMaker('/api/branchpartner/containers/close', { track_code: trackCodes, requires_declaration_container_id: containerId });
    try {
      const response = await caller(url);
      if (response.ok) return new ApiResult(200, null, null);
      const result = await response.json();
      if (response.status === 422 || response.status === 400) return new ApiResult(422, result.errors || {}, null);
      return new ApiResult(400, 'Xəta baş verdi', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası', null);
    }
  },

  getDeclarationByTrackCode: async (params: { trackCode: string; acceptance?: boolean; trendyol?: string }): Promise<ApiResult<200, IAcceptanceDeclaration> | ApiResult<400, string>> => {
    const url = urlMaker('/api/branchpartner/declarations/info_by_track_code', {
      track_code: params.trackCode,
      trendyol: params.trendyol,
      acceptance: params.acceptance ? 1 : undefined,
    });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        return new ApiResult(200, toDeclaration(result.data), null);
      }
      const result = await response.json();
      const errors = result.errors || {};
      const msg = errors.track_code?.join(', ') || errors.not_your_branch?.join(', ') || 'Məlumatlar əldə edilə bilmədi';
      return new ApiResult(400, msg, null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası', null);
    }
  },
};
