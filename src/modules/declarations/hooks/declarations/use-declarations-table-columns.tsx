import { useContext, useMemo } from 'react';
import { Column } from 'react-table';
import { Button, Dropdown, MenuProps, Modal, Select, Tag, message } from 'antd';
import * as Icons from '@ant-design/icons';

import { OverCell, TagCell } from '@shared/components/cells';
import { StopPropagation } from '@shared/components/stop-propagation';
import { nextTableColumns } from '@shared/modules/next-table/helpers/next-table-columns';
import { NextTableCheckboxFilter } from '@shared/modules/next-table/components/filters/checkbox';
import { filterOption } from '@shared/modules/antd/helpers/filter-option';
import { useBackgroundNavigate } from '@shared/hooks';

import { useBranches } from '@modules/branches';
import { useParcels } from '@modules/parcels';
import { IDeclaration } from '../../interfaces';
import { declarationQueryKeys } from '../../utils';
import { DeclarationsService } from '../../services';
import { DeclarationsTableContext } from '../../context';
import { useDeclarationStatusChange } from './use-declaration-status-change';

// Quick row-level status options (model-2 declaration states).
const ROW_STATUS_OPTIONS = [
    { id: 9, name: 'Yerli anbarda' },
    { id: 88, name: 'Gömrükdə saxlanılıb' },
    { id: 36, name: 'Gömrük rəsmiləşdirilməsi' },
    { id: 160, name: 'Gömrük baxışı' },
];

export const useDeclarationsTableColumns = (): Column<IDeclaration>[] => {
    const { handleFetch } = useContext(DeclarationsTableContext);
    const navigate = useBackgroundNavigate();
    const branches = useBranches();
    const parcels = useParcels();
    const { updateStatus } = useDeclarationStatusChange();

    const actionsColumn = useMemo<Column<IDeclaration>>(
        () => ({
            ...nextTableColumns.actions,
            Cell: ({ row: { original } }: any) => {
                const items: MenuProps['items'] = [
                    {
                        key: 'details',
                        label: 'Ətraflı bax',
                        icon: <Icons.FileSearchOutlined />,
                        onClick: () => navigate(`/declarations/${original.id}`),
                    },
                    {
                        key: 'edit',
                        label: 'Düzəliş et',
                        icon: <Icons.EditOutlined />,
                        onClick: () => navigate(`/declarations/${original.id}/update`, { withBackground: true }),
                    },
                    {
                        key: 'status',
                        label: 'Status dəyiş',
                        icon: <Icons.AppstoreOutlined />,
                        children: ROW_STATUS_OPTIONS.map((status) => ({
                            key: `status-${status.id}`,
                            label: status.name,
                            onClick: () => updateStatus([original.id], status.id),
                        })),
                    },
                    { type: 'divider' },
                    {
                        key: 'delete',
                        label: 'Sil',
                        icon: <Icons.DeleteOutlined />,
                        danger: true,
                        onClick: () =>
                            Modal.confirm({
                                title: 'Bəyannaməni sil',
                                content: 'Bu əməliyyat geri alına bilməz. Davam etmək istəyirsiniz?',
                                okText: 'Sil',
                                okType: 'danger',
                                cancelText: 'Ləğv et',
                                onOk: async () => {
                                    const result = await DeclarationsService.cancelDeclarations([original.id]);
                                    if (result.status === 200) {
                                        message.success('Bəyannamə silindi');
                                        handleFetch();
                                    } else {
                                        message.error(result.data as string);
                                    }
                                },
                            }),
                    },
                ];

                return (
                    <StopPropagation>
                        <Dropdown menu={{ items }} trigger={['hover']}>
                            <Button icon={<Icons.MoreOutlined />} size='small' />
                        </Dropdown>
                    </StopPropagation>
                );
            },
        }),
        [navigate, handleFetch, updateStatus],
    );

    const baseColumns = useMemo<Column<IDeclaration>[]>(
        () => [
            {
                ...nextTableColumns.small,
                accessor: (row) => row.user.id,
                id: declarationQueryKeys.userId,
                Header: 'M. kodu',
            },
            {
                accessor: (row) => row.user.name,
                id: declarationQueryKeys.userName,
                Header: 'Müştəri',
                Cell: OverCell,
            },
            {
                ...nextTableColumns.smaller,
                accessor: (row) => row.trackCode,
                id: declarationQueryKeys.trackCode,
                Header: 'İzləmə kodu',
                Cell: ({ cell: { value }, row: { original } }: any) => (
                    <Tag color={!original.read ? 'green' : 'default'}>{value}</Tag>
                ),
            },
            {
                ...nextTableColumns.normal,
                accessor: (row) => row.globalTrackCode,
                id: declarationQueryKeys.globalTrackCode,
                Header: 'Q.İ kodu',
                Cell: TagCell,
            },
            {
                ...nextTableColumns.normal,
                accessor: (row) => row.status?.name,
                id: declarationQueryKeys.statusId,
                Header: 'Status',
                Cell: OverCell,
            },
            {
                ...nextTableColumns.smaller,
                accessor: (row) => row.paid,
                id: declarationQueryKeys.paid,
                Header: 'Ödəniş',
                Filter: NextTableCheckboxFilter,
                Cell: ({ cell: { value } }: any) => value ? <Icons.CheckOutlined style={{ color: '#52c41a' }} /> : <Icons.CloseOutlined style={{ color: '#ff4d4f' }} />,
            },
            {
                ...nextTableColumns.smaller,
                accessor: (row) => row.approved,
                id: declarationQueryKeys.approved,
                Header: 'Bəyan',
                Filter: NextTableCheckboxFilter,
                Cell: ({ cell: { value } }: any) => value ? <Icons.CheckOutlined style={{ color: '#52c41a' }} /> : <Icons.CloseOutlined style={{ color: '#ff4d4f' }} />,
            },
            {
                ...nextTableColumns.smaller,
                accessor: (row) => row.returned,
                id: declarationQueryKeys.returned,
                Header: 'İadə',
                Filter: NextTableCheckboxFilter,
                Cell: ({ cell: { value } }: any) => value ? <Icons.CheckOutlined style={{ color: '#52c41a' }} /> : <Icons.CloseOutlined style={{ color: '#ff4d4f' }} />,
            },
            {
                ...nextTableColumns.normal,
                accessor: (row) => row.flight?.name,
                id: declarationQueryKeys.flightName,
                Header: 'Uçuş',
                Cell: OverCell,
            },
            {
                ...nextTableColumns.small,
                accessor: (row) => row.weight,
                id: declarationQueryKeys.weight,
                Header: 'Çəki',
                Cell: ({ cell: { value } }: any) => (value != null ? `${Number(value).toFixed(2)} kq` : '—'),
            },
            {
                ...nextTableColumns.small,
                accessor: (row) => row.price,
                id: declarationQueryKeys.price,
                Header: 'Məhsulun qiyməti',
                Cell: ({ cell: { value }, row: { original } }: any) => (value != null ? `${Number(value).toFixed(2)} ${original.currency || ''}` : '—'),
            },
            {
                ...nextTableColumns.small,
                accessor: (row) => row.deliveryPrice,
                id: declarationQueryKeys.deliveryPrice,
                Header: 'Çatdırılma qiyməti',
                Cell: ({ cell: { value } }: any) => (value != null ? `${Number(value).toFixed(2)} $` : '—'),
            },
            {
                ...nextTableColumns.smaller,
                accessor: (row) => row.quantity,
                id: declarationQueryKeys.quantity,
                Header: 'Say',
            },
            {
                ...nextTableColumns.small,
                accessor: (row) => row.type,
                id: declarationQueryKeys.type,
                Header: 'Tərkib',
                Filter: ({ column: { filterValue, setFilter } }: any) => (
                    <Select allowClear={true} style={{ width: '100%' }} onChange={setFilter} value={filterValue}>
                        <Select.Option value='1'>Maye</Select.Option>
                        <Select.Option value='2'>Digər</Select.Option>
                    </Select>
                ),
                Cell: ({ cell: { value } }: any) => (value === 'liquid' ? 'Maye' : 'Digər'),
            },
            {
                ...nextTableColumns.normal,
                accessor: (row) => row.shop,
                id: declarationQueryKeys.shopName,
                Header: 'Mağaza',
                Cell: OverCell,
            },
            {
                ...nextTableColumns.small,
                accessor: (row) => row.branch?.name,
                id: declarationQueryKeys.branchId,
                Header: 'Filial',
                Cell: OverCell,
                Filter: ({ column: { filterValue, setFilter } }: any) => (
                    <Select showSearch={true} filterOption={filterOption} allowClear={true} style={{ width: '100%' }} onChange={setFilter} value={filterValue}>
                        {branches.data?.map((b) => (
                            <Select.Option key={b.id} value={b.id.toString()}>
                                {b.name}
                            </Select.Option>
                        ))}
                    </Select>
                ),
            },
            {
                ...nextTableColumns.small,
                accessor: (row) => row.parcel?.id,
                id: declarationQueryKeys.parcelId,
                Header: 'Koli',
                Cell: OverCell,
                Filter: ({ column: { filterValue, setFilter } }: any) => (
                    <Select showSearch={true} filterOption={filterOption} allowClear={true} style={{ width: '100%' }} onChange={setFilter} value={filterValue}>
                        {parcels.data?.map((parcel) => (
                            <Select.Option key={parcel.id} value={parcel.id.toString()}>
                                {parcel.name}
                            </Select.Option>
                        ))}
                    </Select>
                ),
            },
            {
                ...nextTableColumns.date,
                accessor: (row) => row.createdAt,
                id: declarationQueryKeys.createdAt,
                Header: 'Yaradılma tarixi',
            },
        ],
        [branches.data, parcels.data],
    );

    return useMemo(() => [actionsColumn, ...baseColumns], [actionsColumn, baseColumns]);
};
