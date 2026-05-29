import { useContext, useEffect } from 'react';
import { useSearchParams } from '@shared/hooks';
import { useBranchInspectionsTableColumns } from './use-branch-inspections-table-columns';
import { BranchInspectionsTableContext } from '../../context';

export const useBranchInspectionsTable = () => {
  const { handleFetch } = useContext(BranchInspectionsTableContext);
  const columns = useBranchInspectionsTableColumns();
  const { searchParams, remove } = useSearchParams<{ reFetchBranchInspectionsTable?: string }>();

  useEffect(() => {
    (async () => {
      if (searchParams.reFetchBranchInspectionsTable) {
        remove.current('reFetchBranchInspectionsTable');
        await handleFetch();
      }
    })();
  }, [handleFetch, remove, searchParams.reFetchBranchInspectionsTable]);

  return { columns };
};
