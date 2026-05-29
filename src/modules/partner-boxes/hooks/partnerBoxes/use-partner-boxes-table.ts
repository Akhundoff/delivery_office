import { useContext, useEffect } from 'react';
import { useSearchParams } from '@shared/hooks';
import { usePartnerBoxesTableColumns } from './use-partner-boxes-table-columns';
import { PartnerBoxesTableContext } from '../../context';

export const usePartnerBoxesTable = () => {
  const { handleFetch } = useContext(PartnerBoxesTableContext);
  const columns = usePartnerBoxesTableColumns();
  const { searchParams, remove } = useSearchParams<{ reFetchPartnerBoxesTable?: string }>();

  useEffect(() => {
    (async () => {
      if (searchParams.reFetchPartnerBoxesTable) {
        remove.current('reFetchPartnerBoxesTable');
        await handleFetch();
      }
    })();
  }, [handleFetch, remove, searchParams.reFetchPartnerBoxesTable]);

  return { columns };
};
