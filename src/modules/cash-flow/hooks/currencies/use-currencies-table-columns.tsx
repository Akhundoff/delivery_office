import { useMemo } from 'react';
import { Column } from 'react-table';
import { nextTableColumns } from '@shared/modules/next-table/helpers/next-table-columns';
import { ICurrency } from '../../interfaces';

export const useCurrenciesTableColumns = (): Column<ICurrency>[] => {
    const baseColumns = useMemo<Column<ICurrency>[]>(
        () => [
            { ...nextTableColumns.small, Header: 'Kod', id: 'id', accessor: (r) => r.id },
            { accessor: (r) => r.name, id: 'name', Header: 'Ad' },
            { ...nextTableColumns.small, accessor: (r) => r.code, id: 'code', Header: 'Kodu' },
            { ...nextTableColumns.normal, accessor: (r) => r.rate, id: 'rate', Header: 'Məzənnə', filterable: false },
            { ...nextTableColumns.date, accessor: (r) => r.createdAt, id: 'created_at', Header: 'Tarix' },
        ],
        [],
    );

    return baseColumns;
};
