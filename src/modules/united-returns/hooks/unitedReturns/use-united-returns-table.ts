import { useContext, useEffect } from 'react';
import { useSearchParams } from '@shared/hooks';
import { useUnitedReturnsTableColumns } from './use-united-returns-table-columns';
import { UnitedReturnsTableContext } from '../../context';

export const useUnitedReturnsTable = () => {
  const { handleFetch } = useContext(UnitedReturnsTableContext);
  const columns = useUnitedReturnsTableColumns();
  const { searchParams, remove } = useSearchParams<{ reFetchUnitedReturnsTable?: string }>();

  useEffect(() => {
    (async () => {
      if (searchParams.reFetchUnitedReturnsTable) {
        remove.current('reFetchUnitedReturnsTable');
        await handleFetch();
      }
    })();
  }, [handleFetch, remove, searchParams.reFetchUnitedReturnsTable]);

  return { columns };
};
