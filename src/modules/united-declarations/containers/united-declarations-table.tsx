import { FC, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { NextTable } from '@shared/modules/next-table/containers';
import { UnitedDeclarationsTableContext } from '../context';
import { useUnitedDeclarationsTableColumns } from '../hooks';

export const UnitedDeclarationsTable: FC = () => {
  const columns = useUnitedDeclarationsTableColumns();
  const navigate = useNavigate();

  const getRowProps = useCallback(
    (row: any) => ({
      onDoubleClick: () => navigate(`/declarations/${row.original.id}`),
      style: { cursor: 'pointer' },
    }),
    [navigate],
  );

  return <NextTable context={UnitedDeclarationsTableContext} columns={columns} getRowProps={getRowProps} />;
};
