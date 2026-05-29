import { FC } from 'react';
import { NextTable } from '@shared/modules/next-table/containers';
import { SortingsTableContext } from '../context';
import { useSortingsTableColumns } from '../hooks';

export const SortingsTable: FC = () => {
  const columns = useSortingsTableColumns();
  return <NextTable context={SortingsTableContext} columns={columns} />;
};
