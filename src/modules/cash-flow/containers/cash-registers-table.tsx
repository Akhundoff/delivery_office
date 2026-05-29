import { FC } from 'react';
import { NextTable } from '@shared/modules/next-table/containers';
import { CashRegistersTableContext } from '../context';
import { useCashRegistersTableColumns } from '../hooks';

export const CashRegistersTable: FC = () => {
    const columns = useCashRegistersTableColumns();
    return <NextTable context={CashRegistersTableContext} columns={columns} />;
};
