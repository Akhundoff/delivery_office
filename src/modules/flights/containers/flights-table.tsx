import { FC } from 'react';
import { NextTable } from '@shared/modules/next-table/containers';
import { FlightsTableContext } from '../context';
import { useFlightsTable } from '../hooks';

export const FlightsTable: FC = () => {
  const { columns } = useFlightsTable();
  return <NextTable context={FlightsTableContext} columns={columns} />;
};
