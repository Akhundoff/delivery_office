import { FC } from 'react';
import { NextTable } from '@shared/modules/next-table/containers';
import { useTransactionsTableColumns } from '@modules/transactions/hooks';
import { CashbackTransactionsTableContext } from '../context';

export const CashbackTransactionsTable: FC = () => {
  const columns = useTransactionsTableColumns();
  return <NextTable context={CashbackTransactionsTableContext} columns={columns} />;
};
