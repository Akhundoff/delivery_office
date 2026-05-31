import { FC, useMemo } from 'react';
import { Modal } from 'antd';
import { useLocation } from 'react-router-dom';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { NextTable } from '@shared/modules/next-table/containers';
import { useCloseModal } from '@shared/hooks';
import { DeclarationsTableContext } from '@modules/declarations';
import { useDeclarationsTableColumns } from '@modules/declarations/hooks/declarations/use-declarations-table-columns';
import { DeclarationMapper } from '@modules/declarations/mappers/declaration.mapper';
import { makeDetailFetchUseCase } from '../use-cases/detail-fetch';

const DeclarationsDetailTable: FC = () => {
    const columns = useDeclarationsTableColumns();
    return <NextTable context={DeclarationsTableContext} columns={columns} />;
};

const mapDeclaration = (row: any) => DeclarationMapper.toDomain(row);

export const DeclarationsByStatusDetailsModal: FC = () => {
    const [close] = useCloseModal();
    const { statusId, branchId, startDate, endDate } = (useLocation().state || {}) as any;

    const onFetch = useMemo(
        () => makeDetailFetchUseCase('/api/admin/statistics/by_declarations_count', { state_id: statusId, branch_id: branchId, start_date: startDate, end_date: endDate }, mapDeclaration),
        [statusId, branchId, startDate, endDate],
    );

    return (
        <Modal open onCancel={() => close('/statistics/declarations/by-status')} footer={null} width='100%' closable={false}>
            <NextTableProvider context={DeclarationsTableContext} onFetch={onFetch} name='stat-declarations-by-status-details' useCache={false}>
                <DeclarationsDetailTable />
            </NextTableProvider>
        </Modal>
    );
};

export const PaymentTypesByDeclarationsDetailsModal: FC = () => {
    const [close] = useCloseModal();
    const { paymentTypeId, startDate, endDate } = (useLocation().state || {}) as any;

    const onFetch = useMemo(
        () => makeDetailFetchUseCase('/api/admin/statistics/by_declaration_count', { payment_type: paymentTypeId, start_date: startDate, end_date: endDate }, mapDeclaration),
        [paymentTypeId, startDate, endDate],
    );

    return (
        <Modal open onCancel={() => close('/statistics/transactions/payment-types/by-declarations')} footer={null} width='100%' closable={false}>
            <NextTableProvider context={DeclarationsTableContext} onFetch={onFetch} name='stat-payment-types-by-declarations-details' useCache={false}>
                <DeclarationsDetailTable />
            </NextTableProvider>
        </Modal>
    );
};
