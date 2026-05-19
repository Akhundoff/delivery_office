import { useContext, useEffect } from 'react';
import { useSearchParams } from '@shared/hooks';
import { FlightsTableContext } from '../../context';
import { useFlightsTableColumns } from './use-flights-table-columns';

export const useFlightsTable = () => {
  const { handleFetch } = useContext(FlightsTableContext);
  const columns = useFlightsTableColumns();
  const { searchParams, remove } = useSearchParams<{ reFetchFlightsTable?: string }>();

  useEffect(() => {
    (async () => {
      if (searchParams.reFetchFlightsTable) {
        remove.current('reFetchFlightsTable');
        await handleFetch();
      }
    })();
  }, [handleFetch, remove, searchParams.reFetchFlightsTable]);

  return { columns };
};
