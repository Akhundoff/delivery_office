import { FC, useMemo } from 'react';
import { Modal } from 'antd';
import { useLocation } from 'react-router-dom';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { NextTable } from '@shared/modules/next-table/containers';
import { useCloseModal } from '@shared/hooks';
import { OrdersTableContext } from '@modules/orders/context';
import { useOrdersTableColumns } from '@modules/orders';
import { orderRowToDomain } from '@modules/orders/services';
import { makeDetailFetchUseCase } from '../use-cases/detail-fetch';

const OrdersDetailTable: FC = () => {
    const columns = useOrdersTableColumns();
    return <NextTable context={OrdersTableContext} columns={columns} />;
};

export const OrdersByAdminDetailsModal: FC = () => {
    const [close] = useCloseModal();
    const { countryId, adminId, startDate, endDate } = (useLocation().state || {}) as any;

    const onFetch = useMemo(
        () => makeDetailFetchUseCase('/api/admin/statistics/by_orders_admin_count', { country_id: countryId, admin_id: adminId, start_date: startDate, end_date: endDate }, orderRowToDomain),
        [countryId, adminId, startDate, endDate],
    );

    return (
        <Modal open onCancel={() => close('/statistics/orders/by-admin')} footer={null} width={992} closable={false}>
            <NextTableProvider context={OrdersTableContext} onFetch={onFetch} name='stat-orders-by-admin-details' useCache={false}>
                <OrdersDetailTable />
            </NextTableProvider>
        </Modal>
    );
};

export const OrdersByStatusDetailsModal: FC = () => {
    const [close] = useCloseModal();
    const { countryId, statusId, startDate, endDate } = (useLocation().state || {}) as any;

    const onFetch = useMemo(
        () => makeDetailFetchUseCase('/api/admin/statistics/by_orders_count', { country_id: countryId, state_id: statusId, start_date: startDate, end_date: endDate }, orderRowToDomain),
        [countryId, statusId, startDate, endDate],
    );

    return (
        <Modal open onCancel={() => close('/statistics/orders/by-status')} footer={null} width='100%' closable={false}>
            <NextTableProvider context={OrdersTableContext} onFetch={onFetch} name='stat-orders-by-status-details' useCache={false}>
                <OrdersDetailTable />
            </NextTableProvider>
        </Modal>
    );
};
