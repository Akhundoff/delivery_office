import { useQuery } from 'react-query';
import { PartnerStatisticsService } from '../../services';

export const usePartnerDeclarationStatistics = (params: { startDate?: string; endDate?: string; branchId?: string | number }, options?: { enabled?: boolean }) => {
  return useQuery(
    ['partner-declaration-statistics', params],
    async () => {
      const result = await PartnerStatisticsService.getDeclarationStatistics({ ...params, branchId: params.branchId! });
      if (result.status === 200) return result.data;
      throw new Error(result.data as string);
    },
    { enabled: !!params.branchId && (options?.enabled !== false), keepPreviousData: true },
  );
};
