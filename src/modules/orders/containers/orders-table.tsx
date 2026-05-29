import { FC } from 'react';
import { NextTable } from '@shared/modules/next-table/containers';
import { OrdersTableContext } from '../context';
import { useOrdersTableColumns } from '../hooks';

export const OrdersTable: FC = () => {
  const columns = useOrdersTableColumns();

  return <NextTable context={OrdersTableContext} columns={columns} />;
};
