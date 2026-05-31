import { useCallback, useContext, useEffect } from 'react';
import { useBackgroundNavigate, useSearchParams } from '@shared/hooks';
import { OrdersTableContext } from '../../context';
import { useOrdersTableColumns } from './use-orders-table-columns';

export const useOrdersTable = () => {
  const { handleFetch } = useContext(OrdersTableContext);
  const columns = useOrdersTableColumns();
  const navigate = useBackgroundNavigate();
  const { searchParams, remove } = useSearchParams<{ reFetchOrdersTable?: string }>();

  useEffect(() => {
    (async () => {
      if (searchParams.reFetchOrdersTable) {
        remove.current('reFetchOrdersTable');
        await handleFetch();
      }
    })();
  }, [handleFetch, remove, searchParams.reFetchOrdersTable]);

  const getRowProps = useCallback(
    (id: any) => ({
      onDoubleClick: () => navigate(`/orders/${id}`, { withBackground: false }),
      style: { cursor: 'pointer' },
    }),
    [navigate],
  );

  return { columns, getRowProps };
};
