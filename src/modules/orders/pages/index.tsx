import { FC } from 'react';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { PageContent } from '@shared/styled/page-content';
import { OrdersTableContext } from '../context';
import { ordersTableFetchUseCase } from '../use-cases/table-fetch';
import { OrdersActionBar, OrdersTable } from '../containers';

export const OrdersPage: FC = () => (
  <PageContent $contain>
    <NextTableProvider context={OrdersTableContext} onFetch={ordersTableFetchUseCase} name='orders-table'>
      <OrdersActionBar />
      <OrdersTable />
    </NextTableProvider>
  </PageContent>
);
