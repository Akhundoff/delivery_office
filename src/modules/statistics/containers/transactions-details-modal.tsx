import { FC, useMemo } from 'react';
import { Modal } from 'antd';
import { useLocation } from 'react-router-dom';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { NextTable } from '@shared/modules/next-table/containers';
import { useCloseModal } from '@shared/hooks';
import { TransactionsTableContext } from '@modules/transactions/context';
import { useTransactionsTableColumns } from '@modules/transactions';
import { transactionRowToDomain } from '@modules/transactions/services';
import { makeDetailFetchUseCase } from '../use-cases/detail-fetch';

const TransactionsDetailTable: FC = () => {
    const columns = useTransactionsTableColumns();
    return <NextTable context={TransactionsTableContext} columns={columns} />;
};

export const TransactionsByPaymentTypeDetailsModal: FC = () => {
    const [close] = useCloseModal();
    const { startDate, endDate } = (useLocation().state || {}) as any;

    const onFetch = useMemo(
        () => makeDetailFetchUseCase('/api/admin/statistics/by_payment_type_count', { start_date: startDate, end_date: endDate }, transactionRowToDomain),
        [startDate, endDate],
    );

    return (
        <Modal open onCancel={() => close('/statistics/transactions/payment-counts/by-payment-types')} footer={null} width='100%' closable={false}>
            <NextTableProvider context={TransactionsTableContext} onFetch={onFetch} name='stat-transactions-by-payment-type-details' useCache={false}>
                <TransactionsDetailTable />
            </NextTableProvider>
        </Modal>
    );
};
