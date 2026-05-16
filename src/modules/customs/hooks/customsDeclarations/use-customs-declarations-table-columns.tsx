import { useMemo } from 'react';
import { Column } from 'react-table';
import { Tag } from 'antd';
import { ICustomsDeclaration } from '../../interfaces';
import { nextTableColumns } from '@shared/modules/next-table/helpers/next-table-columns';
import { OverCell } from '@shared/components/cells';

export const useCustomsDeclarationsTableColumns = (): Column<ICustomsDeclaration>[] => {
    return useMemo<Column<ICustomsDeclaration>[]>(
        () => [
            {
                ...nextTableColumns.small,
                accessor: (row) => row.regNumber,
                id: 'RegNumber',
                Header: 'Qeydiyyat nömrəsi',
            },
            {
                ...nextTableColumns.small,
                accessor: (row) => row.user?.id,
                id: 'user_id',
                Header: 'M. kodu',
            },
            {
                accessor: (row) => row.user?.name,
                id: 'user_name',
                Header: 'Müştəri',
                Cell: OverCell,
            },
            {
                accessor: (row) => row.importer.name,
                id: 'ImportName',
                Header: 'İdxalçı',
                Cell: OverCell,
                width: 200,
            },
            {
                ...nextTableColumns.small,
                accessor: (row) => row.importer.passportSecret,
                id: 'PinNumber',
                Header: 'FİN kod',
            },
            {
                ...nextTableColumns.small,
                accessor: (row) => row.trackingNumber,
                id: 'TrackingNumber',
                Header: 'İzləmə kodu',
            },
            {
                ...nextTableColumns.normal,
                accessor: (row) => row.productType,
                id: 'GoodsName',
                Header: 'Malın təsviri',
                Cell: OverCell,
            },
            {
                ...nextTableColumns.small,
                accessor: (row) => row.quantity,
                id: 'QuantityFull',
                Header: 'Malın miqdarı',
                Cell: ({ cell: { value } }: any) => `${value} ədəd`,
            },
            {
                ...nextTableColumns.normal,
                accessor: (row) => row.invoicePrice.original,
                id: 'InvoicePriceFull',
                Header: 'İnvoys qiyməti',
            },
            {
                ...nextTableColumns.normal,
                accessor: (row) => row.invoicePrice.usd,
                id: 'InvoicePriceUsd',
                Header: 'İnvoys qiyməti (USD)',
            },
            {
                ...nextTableColumns.small,
                accessor: (row) => row.paymentStatus,
                id: 'PayStatus',
                Header: 'Status',
                Cell: ({ cell: { value } }: any) => <Tag>{value}</Tag>,
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
