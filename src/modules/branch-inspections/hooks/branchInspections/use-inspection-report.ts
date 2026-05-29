import { useQuery } from 'react-query';
import { BranchInspectionsService } from '../../services';

export const useInspectionReport = (id?: string) =>
  useQuery(
    ['branch-inspection-report', id || ''],
    async () => {
      const result = await BranchInspectionsService.getReport(id!);
      if (result.status === 200) return result.data;
      throw new Error(result.data as string);
    },
    { enabled: !!id },
  );
