import { FC } from 'react';
import { NextTable } from '@shared/modules/next-table/containers';
import { TransactionsTableContext } from '../context';
import { useTransactionsTableColumns } from '../hooks';

export const TransactionsTable: FC = () => {
  const columns = useTransactionsTableColumns();
  return <NextTable context={TransactionsTableContext} columns={columns} />;
};
