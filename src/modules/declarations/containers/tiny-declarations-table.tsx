import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { NextTable } from '@shared/modules/next-table/containers';
import { TinyDeclarationsTableContext } from '../context';
import { useTinyDeclarationsTableColumns } from '../hooks/tinyDeclarations/use-tiny-declarations-table-columns';

export const TinyDeclarationsTable: React.FC = () => {
  const navigate = useNavigate();
  const columns = useTinyDeclarationsTableColumns();

  const getRowProps = useCallback(
    (row: any) => ({
      onDoubleClick: () => navigate(`/declarations/${row.original.id}`),
      style: { cursor: 'pointer' },
    }),
    [navigate],
  );

  return <NextTable context={TinyDeclarationsTableContext} columns={columns} getRowProps={getRowProps} />;
};
