import { useMemo } from 'react';
import { Column } from 'react-table';
import { Tag } from 'antd';
import { nextTableColumns } from '@shared/modules/next-table/helpers/next-table-columns';
import { IBoxTransfer } from '../../interfaces';

export const useBoxTransfersTableColumns = (): Column<IBoxTransfer>[] =>
    useMemo<Column<IBoxTransfer>[]>(
        () => [
            {
                ...nextTableColumns.small,
                accessor: (row) => row.id,
                id: 'id',
                Header: 'Kod',
            },
            {
                ...nextTableColumns.normal,
                accessor: (row) => row.declaration.trackCode,
                id: 'track_code',
                Header: 'İzləmə kodu',
            },
            {
                ...nextTableColumns.normal,
                accessor: (row) => row.fromContainer.name,
                id: 'from_container_name',
                Header: 'Yeşikdən',
            },
            {
                ...nextTableColumns.normal,
                accessor: (row) => row.toContainer.name,
                id: 'to_container_name',
                Header: 'Yeşiyə',
            },
            {
                ...nextTableColumns.large,
                accessor: (row) => row.branch.name,
                id: 'branch_name',
                Header: 'Filial',
                disableFilters: true,
            },
            {
                ...nextTableColumns.large,
                accessor: (row) => row.user.name,
                id: 'user_id',
                Header: 'İcraçı',
                Cell: ({ cell: { value }, row: { original } }: any) => <Tag>{`#${original.user.id} ${value}`}</Tag>,
            },
            {
                accessor: (row) => row.note,
                id: 'note',
                Header: 'Qeyd',
            },
            {
                ...nextTableColumns.date,
                accessor: (row) => row.createdAt,
                id: 'created_at',
                Header: 'Tarix',
            },
        ],
        [],
    );
