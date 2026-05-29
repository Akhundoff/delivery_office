import { useContext, useEffect } from 'react';
import { useSearchParams } from '@shared/hooks';
import { useSupportsTableColumns } from './use-supports-table-columns';
import { SupportsTableContext } from '../../context';

export const useSupportsTable = () => {
  const { handleFetch } = useContext(SupportsTableContext);
  const columns = useSupportsTableColumns();
  const { searchParams, remove } = useSearchParams<{ reFetchSupportsTable?: string }>();

  useEffect(() => {
    (async () => {
      if (searchParams.reFetchSupportsTable) {
        remove.current('reFetchSupportsTable');
        await handleFetch();
      }
    })();
  }, [handleFetch, remove, searchParams.reFetchSupportsTable]);

  return { columns };
};
