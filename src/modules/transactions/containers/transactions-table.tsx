import { FC } from 'react';
import { NextTable } from '@shared/modules/next-table/containers';
import { TransactionsTableContext } from '../context';
import { useTransactionsTable } from '../hooks';

export const TransactionsTable: FC = () => {
  const { columns } = useTransactionsTable();
  return <NextTable context={TransactionsTableContext} columns={columns} />;
};
