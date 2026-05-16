import { useMemo } from 'react';
import { Column } from 'react-table';
import { Tag } from 'antd';
import { IDeclarationPost } from '../../interfaces';
import { nextTableColumns } from '@shared/modules/next-table/helpers/next-table-columns';
import { OverCell } from '@shared/components/cells';

export const usePostDeclarationsTableColumns = (): Column<IDeclarationPost>[] => {
    return useMemo<Column<IDeclarationPost>[]>(
        () => [
            {
                ...nextTableColumns.small,
                accessor: (row) => row.user.id,
                id: 'user_id',
                Header: 'M. kodu',
            },
            {
                accessor: (row) => row.user.name,
                id: 'user_name',
                Header: 'Müştəri',
                Cell: OverCell,
            },
            {
                ...nextTableColumns.normal,
                accessor: (row) => row.trackCode,
                id: 'track_code',
                Header: 'İzləmə kodu',
                Cell: ({ cell: { value }, row: { original } }: any) => <Tag color={!(original as IDeclarationPost).read ? 'green' : 'default'}>{value}</Tag>,
            },
            {
                ...nextTableColumns.normal,
                accessor: (row) => row.price,
                id: 'price',
                Header: 'Findex qiymət',
            },
            {
                ...nextTableColumns.normal,
                accessor: (row) => row.dgkPrice,
                id: 'dgk_price',
                Header: 'DGK Qiymət',
            },
            {
                ...nextTableColumns.normal,
                accessor: (row) => row.customsId,
                id: 'customs_id',
                Header: 'Custom ID',
            },
            {
                ...nextTableColumns.date,
                accessor: (row) => row.createdAt,
                id: 'created_at',
                Header: 'Yaradılma tarixi',
            },
        ],
        [],
    );
};
