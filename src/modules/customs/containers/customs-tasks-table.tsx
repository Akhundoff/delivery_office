import { FC } from 'react';
import { NextTable } from '@shared/modules/next-table/containers';
import { CustomsTasksTableContext } from '../context';
import { useCustomsTasksTable } from '../hooks';

export const CustomsTasksTable: FC = () => {
  const { columns } = useCustomsTasksTable();
  return <NextTable context={CustomsTasksTableContext} columns={columns} />;
};
