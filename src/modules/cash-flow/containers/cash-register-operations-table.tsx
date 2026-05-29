import { FC } from 'react';
import { NextTable } from '@shared/modules/next-table/containers';
import { CashRegisterOperationsTableContext } from '../context';
import { useCashRegisterOperationsTableColumns } from '../hooks';

export const CashRegisterOperationsTable: FC = () => {
    const columns = useCashRegisterOperationsTableColumns();
    return <NextTable context={CashRegisterOperationsTableContext} columns={columns} />;
};
