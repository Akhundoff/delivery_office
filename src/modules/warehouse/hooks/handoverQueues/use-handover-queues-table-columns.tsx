import { useContext, useMemo } from 'react';
import { Column } from 'react-table';
import { Button, Dropdown, MenuProps, Modal, Select, message } from 'antd';
import * as Icons from '@ant-design/icons';
import uniqBy from 'lodash/uniqBy';

import { StopPropagation } from '@shared/components/stop-propagation';
import { nextTableColumns } from '@shared/modules/next-table/helpers/next-table-columns';
import { useBackgroundNavigate } from '@shared/hooks';

import { IHandoverQueue } from '../../interfaces';
import { WarehouseService } from '../../services';
import { HandoverQueuesTableContext } from '../../context';

export const useHandoverQueuesTableColumns = (): Column<IHandoverQueue>[] => {
    const { handleFetch } = useContext(HandoverQueuesTableContext);
    const navigate = useBackgroundNavigate();

    const actionsColumn = useMemo<Column<IHandoverQueue>>(
        () => ({
            ...nextTableColumns.actions,
            Cell: ({ row: { original } }: any) => {
                const items: MenuProps['items'] = [
                    {
                        key: 'details',
                        label: 'Ətraflı',
                        icon: <Icons.EyeOutlined />,
                        onClick: () => navigate(`/warehouse/handover/queues/${original.id}`),
                    },
                    {
                        key: 'execute',
                        label: 'İcra et',
                        icon: <Icons.Loading3QuartersOutlined />,
                        disabled: original.status.id !== 41,
                        onClick: () => {
                            Modal.confirm({
                                title: 'Növbəni icra etməyə əminsinizmi?',
                                okText: 'Bəli',
                                cancelText: 'Xeyr',
                                onOk: async () => {
                                    const result = await WarehouseService.updateHandoverQueueStatus(original.id, 42);
                                    if (result.status === 200) {
                                        handleFetch();
                                    } else {
                                        message.error(result.data as string);
                                    }
                                },
                            });
                        },
                    },
                    { type: 'divider' },
                    {
                        key: 'delete',
                        label: 'Ləğv et',
                        icon: <Icons.DeleteOutlined />,
                        danger: true,
                        onClick: () => {
                            Modal.confirm({
                                title: 'Növbəni ləğv etməyə əminsinizmi?',
                                okText: 'Bəli',
                                cancelText: 'Xeyr',
                                onOk: async () => {
                                    const result = await WarehouseService.removeHandoverQueue([original.id]);
                                    if (result.status === 200) {
                                        handleFetch();
                                    } else {
                                        message.error(result.data as string);
                                    }
                                },
                            });
                        },
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
        [handleFetch, navigate],
    );

    return useMemo<Column<IHandoverQueue>[]>(
        () => [
            actionsColumn,
            {
                ...nextTableColumns.small,
                accessor: (row) => row.id,
                id: 'id',
                Header: 'Kod',
            },
            {
                ...nextTableColumns.small,
                accessor: (row) => row.user.id,
                id: 'user_id',
                Header: 'M. kodu',
            },
            {
                accessor: (row) => row.user.fullName,
                id: 'user_name',
                Header: 'M. adı',
            },
            {
                ...nextTableColumns.normal,
                accessor: (row) => row.declarations,
                id: 'declaration_count',
                Header: 'Bağlamalar',
                disableSortBy: true,
                disableFilters: true,
                Cell: ({ cell: { value } }: any) => `${value.length} bağlama`,
            },
            {
                ...nextTableColumns.normal,
                accessor: (row) => row.declarations,
                id: 'boxes',
                Header: 'Yeşiklər',
                disableSortBy: true,
                disableFilters: true,
                Cell: ({ row: { original } }: any) => {
                    const boxes = uniqBy(
                        original.declarations.map((d: any) => d.box).filter(Boolean),
                        (b: any) => b.id,
                    );
                    return <span>{boxes.map((b: any) => b.name).join(', ') || '—'}</span>;
                },
            },
            {
                ...nextTableColumns.normal,
                accessor: (row) => row.status.id,
                id: 'state_id',
                Header: 'Status',
                Filter: ({ column: { setFilter, filterValue } }: any) => (
                    <Select style={{ width: '100%' }} allowClear onChange={setFilter} value={filterValue}>
                        <Select.Option value='41'>Gözləmədə</Select.Option>
                        <Select.Option value='42'>İcra edilir</Select.Option>
                        <Select.Option value='43'>Təhvil verilib</Select.Option>
                    </Select>
                ),
                Cell: ({ row: { original } }: any) => original.status.name,
            },
            {
                accessor: (row) => row.cashier.fullName,
                id: 'cashier_name',
                Header: 'İcraçı',
            },
            {
                ...nextTableColumns.date,
                accessor: (row) => row.createdAt,
                id: 'created_at',
                Header: 'Yaradılma tarixi',
            },
        ],
        [actionsColumn],
    );
};
