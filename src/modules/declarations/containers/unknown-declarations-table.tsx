import { FC } from 'react';
import { NextTable } from '@shared/modules/next-table/containers';
import { UnknownDeclarationsTableContext } from '../context';
import { useUnknownDeclarationsTable } from '../hooks';

export const UnknownDeclarationsTable: FC = () => {
  const { columns } = useUnknownDeclarationsTable();
  return <NextTable context={UnknownDeclarationsTableContext} columns={columns} />;
};
