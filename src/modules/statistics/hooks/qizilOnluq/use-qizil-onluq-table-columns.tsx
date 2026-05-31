import { useMemo } from 'react';
import { Column } from 'react-table';
import { nextTableColumns } from '@shared/modules/next-table/helpers/next-table-columns';
import { CurrencySymbols } from '@modules/orders/constants';
import { IQizilOnluqUser } from '../../interfaces';

export const useQizilOnluqTableColumns = (): Column<IQizilOnluqUser>[] => {
    return useMemo<Column<IQizilOnluqUser>[]>(
        () => [
            { ...nextTableColumns.small, Header: 'Kod', id: 'id', accessor: (r) => r.id },
            { accessor: (r) => r.name, id: 'name', Header: 'Ad' },
            { ...nextTableColumns.small, accessor: (r) => r.qizilonluq, id: 'qizilonluq', Header: 'Ödədiyi' },
            { accessor: (r) => r.email, id: 'email', Header: 'Email' },
            { accessor: (r) => r.phoneNumber, id: 'number', Header: 'Telefon' },
            { ...nextTableColumns.small, accessor: (r) => (r.gender === 'female' ? 'Qadın' : 'Kişi'), id: 'gender', Header: 'Cinsi' },
            { ...nextTableColumns.small, accessor: (r) => `${r.discount.toFixed(2)}%`, id: 'discount', Header: 'Endirim' },
            { accessor: (r) => `${r.balance.usd.toFixed(2)} ${CurrencySymbols.USD}`, id: 'balance_usd', Header: 'Balans (USD)' },
            { accessor: (r) => `${r.balance.try.toFixed(2)} ${CurrencySymbols.TRY}`, id: 'balance_try', Header: 'Balans (TRY)' },
            { ...nextTableColumns.small, accessor: (r) => r.branch.name, id: 'branch_id', Header: 'Filial' },
        ],
        [],
    );
};
