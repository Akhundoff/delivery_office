import { useQuery } from 'react-query';
import { BranchesService } from '../../services';
import { IBranchListItem } from '../../interfaces';

export const useAzerpostBranches = (query = {}) => {
  return useQuery<IBranchListItem[], Error>(['azerpostbranches', query], async () => {
    const result = await BranchesService.getAzerpostBranches(query);
    if (result.status === 200) return result.data.data;
    throw new Error(result.data as string);
  });
};
