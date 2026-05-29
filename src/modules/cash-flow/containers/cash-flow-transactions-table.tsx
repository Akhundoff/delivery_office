import { FC } from 'react';
import { NextTable } from '@shared/modules/next-table/containers';
import { CashFlowTransactionsTableContext } from '../context';
import { useCashFlowTransactionsTableColumns } from '../hooks';

export const CashFlowTransactionsTable: FC = () => {
    const columns = useCashFlowTransactionsTableColumns();
    return <NextTable context={CashFlowTransactionsTableContext} columns={columns} />;
};
