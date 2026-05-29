import { FC, useCallback } from 'react';
import { NextTable } from '@shared/modules/next-table/containers';
import { useBackgroundNavigate } from '@shared/hooks';
import { ArchivedDeclarationsTableContext } from '../context';
import { useDeclarationsTableColumns } from '../hooks';

export const ArchivedDeclarationsTable: FC = () => {
  const columns = useDeclarationsTableColumns();
  const navigate = useBackgroundNavigate();

  const getRowProps = useCallback(
    (id: any) => ({ onDoubleClick: () => navigate(`/declarations/${id}`, { withBackground: false }), style: { cursor: 'pointer' } }),
    [navigate],
  );

  return <NextTable context={ArchivedDeclarationsTableContext} columns={columns} getRowProps={getRowProps} />;
};
