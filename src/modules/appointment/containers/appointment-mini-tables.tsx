import { FC, useContext, useMemo } from 'react';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { TinyDeclarationsTableContext } from '@modules/declarations/context';
import { TinyDeclarationsTable } from '@modules/declarations/containers';
import { tinyDeclarationsTableFetchUseCase } from '@modules/declarations/use-cases/tiny-declarations-table-fetch';
import { declarationQueryKeys } from '@modules/declarations/utils';
import { OrdersTableContext } from '@modules/orders/context';
import { OrdersTable } from '@modules/orders/containers';
import { ordersTableFetchUseCase } from '@modules/orders/use-cases/table-fetch';
import { CouriersTableContext } from '@modules/couriers/context';
import { CouriersTable } from '@modules/couriers/containers';
import { couriersTableFetchUseCase } from '@modules/couriers/use-cases/table-fetch';
import { CustomsDeclarationsTableContext } from '@modules/customs/context';
import { CustomsDeclarationsTable } from '@modules/customs/containers';
import { customsDeclarationsTableFetchUseCase } from '@modules/customs/use-cases/customs-declarations-table-fetch';
import { TransactionsTableContext } from '@modules/transactions/context';
import { TransactionsTable } from '@modules/transactions/containers';
import { transactionsTableFetchUseCase } from '@modules/transactions/use-cases/table-fetch';
import { MeContext } from '@modules/me';
import { AppointmentDeclarationsActionBar } from './appointment-declarations-action-bar';
import { AppointmentDeclarationsSummary } from './appointment-declarations-summary';
import { defaultFilterEnabled } from '../utils';

interface TableProps {
  userId: string;
}

export const DeclarationsAppointmentTable: FC<TableProps> = ({ userId }) => {
  const { state: meState } = useContext(MeContext);

  const defaultState = useMemo(() => {
    const filters: { id: string; value: string }[] = [{ id: declarationQueryKeys.userId, value: userId }];
    if (!defaultFilterEnabled()) {
      filters.push({ id: declarationQueryKeys.statusId, value: '9' });
      filters.push({ id: declarationQueryKeys.returned, value: '0' });
      if (meState.user.data?.adminBranchId) {
        filters.push({ id: declarationQueryKeys.branchId, value: meState.user.data.adminBranchId.toString() });
      }
    }
    return {
      filters,
      hiddenColumns: [declarationQueryKeys.userId, declarationQueryKeys.userName],
    };
  }, [userId, meState.user.data?.adminBranchId]);

  return (
    <NextTableProvider context={TinyDeclarationsTableContext} onFetch={tinyDeclarationsTableFetchUseCase} name={`appointment-declarations-${userId}`} defaultState={defaultState} useCache={false}>
      <AppointmentDeclarationsActionBar />
      <TinyDeclarationsTable />
      <AppointmentDeclarationsSummary />
    </NextTableProvider>
  );
};

export const OrdersAppointmentTable: FC<TableProps> = ({ userId }) => {
  const defaultState = useMemo(() => ({ filters: [{ id: 'user_id', value: userId }], hiddenColumns: ['user_id', 'user_name'] }), [userId]);
  return (
    <NextTableProvider context={OrdersTableContext} onFetch={ordersTableFetchUseCase} name={`appointment-orders-${userId}`} defaultState={defaultState} useCache={false}>
      <OrdersTable />
    </NextTableProvider>
  );
};

export const CouriersAppointmentTable: FC<TableProps> = ({ userId }) => {
  const defaultState = useMemo(() => ({ filters: [{ id: 'user_id', value: userId }], hiddenColumns: ['user_id', 'user_name'] }), [userId]);
  return (
    <NextTableProvider context={CouriersTableContext} onFetch={couriersTableFetchUseCase} name={`appointment-couriers-${userId}`} defaultState={defaultState} useCache={false}>
      <CouriersTable />
    </NextTableProvider>
  );
};

export const CustomsDeclarationsAppointmentTable: FC<TableProps> = ({ userId }) => {
  const defaultState = useMemo(() => ({ filters: [{ id: 'user_id', value: userId }], hiddenColumns: ['user_id', 'user_name'] }), [userId]);
  return (
    <NextTableProvider context={CustomsDeclarationsTableContext} onFetch={customsDeclarationsTableFetchUseCase} name={`appointment-customs-${userId}`} defaultState={defaultState} useCache={false}>
      <CustomsDeclarationsTable />
    </NextTableProvider>
  );
};

export const TransactionsAppointmentTable: FC<TableProps> = ({ userId }) => {
  const defaultState = useMemo(() => ({ filters: [{ id: 'user_id', value: userId }], hiddenColumns: ['user_id', 'user_name'] }), [userId]);
  return (
    <NextTableProvider context={TransactionsTableContext} onFetch={transactionsTableFetchUseCase} name={`appointment-transactions-${userId}`} defaultState={defaultState} useCache={false}>
      <TransactionsTable />
    </NextTableProvider>
  );
};
