import { FC } from 'react';
import { NextTable } from '@shared/modules/next-table/containers';
import { OrdersTableContext } from '../context';
import { useOrdersTable } from '../hooks';

export const OrdersTable: FC = () => {
  const { columns, getRowProps } = useOrdersTable();

  return <NextTable context={OrdersTableContext} columns={columns} getRowProps={getRowProps} />;
};
