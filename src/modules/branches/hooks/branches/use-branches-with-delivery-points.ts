import { useQuery } from 'react-query';
import { BranchesService } from '../../services';
import { IBranchWithDeliveryPoint } from '../../interfaces';

export const useBranchesWithDeliveryPoints = (query = {}) => {
  return useQuery<IBranchWithDeliveryPoint[], Error>(['branches-with-deliver-points', query], async () => {
    const result = await BranchesService.getBranchesWithDeliveryPoints(query);
    if (result.status === 200) return result.data.data;
    throw new Error(result.data as string);
  });
};
