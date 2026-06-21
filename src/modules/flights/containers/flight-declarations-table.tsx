import { FC } from 'react';
import { NextTable } from '@shared/modules/next-table/containers';
import { DeclarationsTableContext } from '@modules/declarations/context';
import { useDeclarationsTable } from '@modules/declarations/hooks';

export const FlightDeclarationsTable: FC = () => {
  const { columns, getRowProps } = useDeclarationsTable();
  return <NextTable context={DeclarationsTableContext} columns={columns} getRowProps={getRowProps} />;
};
