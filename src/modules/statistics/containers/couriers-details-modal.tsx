import { FC, useMemo } from 'react';
import { Modal } from 'antd';
import { useLocation } from 'react-router-dom';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { NextTable } from '@shared/modules/next-table/containers';
import { useCloseModal } from '@shared/hooks';
import { CouriersTableContext } from '@modules/couriers/context';
import { useCouriersTableColumns } from '@modules/couriers';
import { courierRowToDomain } from '@modules/couriers/services';
import { makeDetailFetchUseCase } from '../use-cases/detail-fetch';

const CouriersDetailTable: FC = () => {
    const columns = useCouriersTableColumns();
    return <NextTable context={CouriersTableContext} columns={columns} />;
};

export const CouriersCountDetailsModal: FC = () => {
    const [close] = useCloseModal();
    const { dateFrom, dateTo, statusId } = (useLocation().state || {}) as any;

    const onFetch = useMemo(
        () => makeDetailFetchUseCase('/api/admin/statistics/by_courier_count', { start_date: dateFrom, end_date: dateTo, state_id: statusId }, courierRowToDomain),
        [dateFrom, dateTo, statusId],
    );

    return (
        <Modal open onCancel={() => close('/statistics/couriers/counts')} footer={null} width='100%' closable={false}>
            <NextTableProvider context={CouriersTableContext} onFetch={onFetch} name='stat-couriers-count-details' useCache={false}>
                <CouriersDetailTable />
            </NextTableProvider>
        </Modal>
    );
};

export const CouriersByRegionsDetailsModal: FC = () => {
    const [close] = useCloseModal();
    const { dateFrom, dateTo, statusId, regionId } = (useLocation().state || {}) as any;

    const onFetch = useMemo(
        () => makeDetailFetchUseCase('/api/admin/statistics/by_region_courier_count', { start_date: dateFrom, end_date: dateTo, state_id: statusId, region_id: regionId }, courierRowToDomain),
        [dateFrom, dateTo, statusId, regionId],
    );

    return (
        <Modal open onCancel={() => close('/statistics/couriers/counts/by-regions')} footer={null} width='100%' closable={false}>
            <NextTableProvider context={CouriersTableContext} onFetch={onFetch} name='stat-couriers-by-regions-details' useCache={false}>
                <CouriersDetailTable />
            </NextTableProvider>
        </Modal>
    );
};
