import { ApiResult, caller, urlMaker } from '@shared/utils';
import { IBranchPartner, IPartnerDeclarationStatistic, IPartnerStatisticsTotal } from '../interfaces';

const toBranchPartner = (item: any): IBranchPartner => ({
  id: item.id,
  name: item.name,
});

const toStatistic = (item: any): IPartnerDeclarationStatistic => ({
  id: item.changed_date,
  count: item.declaration_count,
  productPrice: parseFloat(item.price || 0),
  deliveryPrice: parseFloat(item.delivery_price || 0),
  updatedAt: item.changed_date,
});

export const PartnerStatisticsService = {
  getBranchPartners: async (): Promise<ApiResult<200, IBranchPartner[]> | ApiResult<400, string>> => {
    const url = urlMaker('/api/admin/branches/partner', { page: 1, per_page: 1000 });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        return new ApiResult(200, (result.data || []).map(toBranchPartner), null);
      }
      return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası', null);
    }
  },

  getDeclarationStatistics: async (params: { startDate?: string; endDate?: string; branchId: string | number }): Promise<
    ApiResult<200, { data: IPartnerDeclarationStatistic[]; total: IPartnerStatisticsTotal }> | ApiResult<400, string>
  > => {
    const url = urlMaker('/api/admin/statistics/partner_by_declarations_count', {
      start_date: params.startDate,
      end_date: params.endDate,
      state_id: '9',
      branch_id: params.branchId,
    });
    try {
      const response = await caller(url);
      if (response.ok) {
        const result = await response.json();
        const data = (result.data || []).map(toStatistic);
        const total: IPartnerStatisticsTotal = {
          count: result.total?.declaration_count || 0,
          deliveryPrice: parseFloat(result.total?.delivery_price || 0),
          productPrice: parseFloat(result.total?.price || 0),
        };
        return new ApiResult(200, { data, total }, null);
      }
      return new ApiResult(400, 'Məlumatlar əldə edilə bilmədi', null);
    } catch {
      return new ApiResult(400, 'Şəbəkə xətası', null);
    }
  },
};
