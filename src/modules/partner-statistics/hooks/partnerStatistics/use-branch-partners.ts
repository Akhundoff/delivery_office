import { useQuery } from 'react-query';
import { PartnerStatisticsService } from '../../services';

export const useBranchPartners = () => {
  return useQuery(['branch-partners-statistics'], async () => {
    const result = await PartnerStatisticsService.getBranchPartners();
    if (result.status === 200) return result.data;
    throw new Error(result.data as string);
  });
};
