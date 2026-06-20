import { FC } from 'react';
import { NextTable } from '@shared/modules/next-table/containers';
import { CashbacksTableContext } from '../context';
import { useCashbacksTable } from '../hooks';

export const CashbacksTable: FC = () => {
  const { columns, getRowProps } = useCashbacksTable();
  return <NextTable context={CashbacksTableContext} columns={columns} getRowProps={getRowProps} />;
};
