import { FC } from 'react';
import { NextTable } from '@shared/modules/next-table/containers';
import { CurrenciesTableContext } from '../context';
import { useCurrenciesTableColumns } from '../hooks';

export const CurrenciesTable: FC = () => {
    const columns = useCurrenciesTableColumns();
    return <NextTable context={CurrenciesTableContext} columns={columns} />;
};
