import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCashbacksTableColumns } from './use-cashbacks-table-columns';

export const useCashbacksTable = () => {
  const columns = useCashbacksTableColumns();
  const navigate = useNavigate();

  const getRowProps = useCallback(
    (id: number | string) => ({
      onDoubleClick: () => navigate(`/cashback/${id}`),
    }),
    [navigate],
  );

  return { columns, getRowProps };
};
