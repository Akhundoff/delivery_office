import { useMemo } from 'react';
import { Column } from 'react-table';
import { Tag } from 'antd';
import { ICustomsPost } from '../../interfaces';
import { nextTableColumns } from '@shared/modules/next-table/helpers/next-table-columns';
import { OverCell, Overflow } from '@shared/components/cells';

export const useCustomsPostsTableColumns = (): Column<ICustomsPost>[] => {
    return useMemo<Column<ICustomsPost>[]>(
        () => [
            {
                accessor: (row) => row.importer.name,
                id: 'idxaL_NAME',
                Header: 'İdxalatçı',
                Cell: OverCell,
            },
            {
                ...nextTableColumns.small,
                accessor: (row) => row.importer.fin,
                id: 'fin',
                Header: 'FİN',
            },
            {
                ...nextTableColumns.normal,
                accessor: (row) => row.trackingNumber,
                id: 'trackinG_NO',
                Header: 'İzləmə kodu',
            },
            {
                ...nextTableColumns.normal,
                accessor: (row) => row.goods,
                id: 'goodsList',
                Header: 'Mallar',
                Cell: ({ cell: { value } }: any) => <Overflow>{(value as ICustomsPost['goods']).map((g) => g.name).join('. ')}</Overflow>,
            },
            {
                ...nextTableColumns.small,
                accessor: (row) => row.transportationCost,
                id: 'transP_COSTS',
                Header: 'Daşınma qiyməti',
                Cell: ({ cell: { value } }: any) => `${Number(value).toFixed(2)} $`,
            },
            {
                ...nextTableColumns.normal,
                accessor: (row) => row.invoice.price,
                id: 'invoyS_PRICE',
                Header: 'İnvoys qiyməti (Original)',
                Cell: ({ cell: { value } }: any) => Number(value).toFixed(2),
            },
            {
                ...nextTableColumns.normal,
                accessor: (row) => row.invoice,
                id: 'invoyS_USD',
                Header: 'İnvoys qiyməti',
                Cell: ({ cell: { value } }: any) => `${Number((value as ICustomsPost['invoice']).usd).toFixed(2)} $ / ${Number((value as ICustomsPost['invoice']).azn).toFixed(2)} AZN`,
            },
            {
                ...nextTableColumns.small,
                accessor: (row) => row.weight,
                id: 'weighT_GOODS',
                Header: 'Çəki',
                Cell: ({ cell: { value } }: any) => `${Number(value).toFixed(2)} kq`,
            },
            {
                ...nextTableColumns.small,
                accessor: (row) => row.quantity,
                id: 'quantitY_OF_GOODS',
                Header: 'Say',
                Cell: ({ cell: { value } }: any) => `${value} ədəd`,
            },
            {
                ...nextTableColumns.small,
                accessor: (row) => row.importer.address,
                id: 'idxaL_ADRESS',
                Header: 'İdxalatçı ünvanı',
                Cell: OverCell,
            },
            {
                ...nextTableColumns.small,
                accessor: (row) => row.exporter.name,
                id: 'ixraC_NAME',
                Header: 'İxracatçı',
                Cell: OverCell,
            },
            {
                ...nextTableColumns.small,
                accessor: (row) => row.documentType,
                id: 'documenT_TYPE',
                Header: 'Sənəd tipi',
            },
            {
                ...nextTableColumns.smaller,
                accessor: (row) => row.status,
                id: 'status',
                Header: 'Status',
                Cell: ({ cell: { value } }: any) => <Tag>{value}</Tag>,
            },
            {
                ...nextTableColumns.small,
                accessor: (row) => row.airWaybill,
                id: 'airwaybill',
                Header: 'Aviaqaimə nömrəsi',
                Cell: OverCell,
            },
            {
                ...nextTableColumns.small,
                accessor: (row) => row.dispatchNumber,
                id: 'depesH_NUMBER',
                Header: 'Depesh nömrəsi',
                Cell: OverCell,
            },
            {
                ...nextTableColumns.small,
                accessor: (row) => row.eComRegNumber,
                id: 'ecoM_REGNUMBER',
                Header: 'ECOM nömrəsi',
                Cell: OverCell,
            },
            {
                ...nextTableColumns.date,
                accessor: (row) => row.dispatchedAt,
                id: 'depesH_DATE',
                Header: 'Depesh tarixi',
            },
            {
                ...nextTableColumns.date,
                accessor: (row) => row.createdAt,
                id: 'inserT_DATE',
                Header: 'Yaradılma tarixi',
            },
        ],
        [],
    );
};
