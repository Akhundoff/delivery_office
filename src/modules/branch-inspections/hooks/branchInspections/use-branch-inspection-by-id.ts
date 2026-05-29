import { useQuery } from 'react-query';
import { BranchInspectionsService } from '../../services';

export const useBranchInspectionById = (id?: string) =>
  useQuery(
    ['branch-inspection', id || ''],
    async () => {
      const result = await BranchInspectionsService.getById(id!);
      if (result.status === 200) return result.data;
      throw new Error(result.data as string);
    },
    { enabled: !!id },
  );
