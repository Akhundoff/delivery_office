import React, { useContext, useMemo } from 'react';
import { Button, Dropdown, MenuProps, Modal, Tag, message } from 'antd';
import * as Icons from '@ant-design/icons';
import { Column } from 'react-table';
import { StopPropagation } from '@shared/components/stop-propagation';
import { nextTableColumns } from '@shared/modules/next-table/helpers/next-table-columns';
import { IDelivererAssignment } from '../../interfaces';
import { DelivererAssignmentsTableContext } from '../../context';
import { CouriersService } from '../../services';

export const useDelivererAssignmentsTableColumns = (): Column<IDelivererAssignment>[] => {
    const { handleFetch } = useContext(DelivererAssignmentsTableContext);

    const actionsColumn = useMemo<Column<IDelivererAssignment>>(
        () => ({
            ...nextTableColumns.actions,
            Cell: ({ row: { original } }: any) => {
                const items: MenuProps['items'] = [
                    {
                        key: 'remove',
                        label: 'Kuryerdən al',
                        icon: <Icons.DeleteOutlined />,
                        danger: true,
                        onClick: () =>
                            Modal.confirm({
                                title: 'Diqqət',
                                content: 'Müştərini kuryerdən almağa əminsinizmi?',
                                okType: 'danger',
                                okText: 'Bəli',
                                cancelText: 'Ləğv et',
                                onOk: async () => {
                                    const result = await CouriersService.removeDelivererAssignments([original.id]);
                                    if (result.status === 200) { message.success('Silindi.'); handleFetch(); }
                                    else message.error(result.data as string);
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
        [handleFetch],
    );

    const baseColumns = useMemo<Column<IDelivererAssignment>[]>(
        () => [
            { ...nextTableColumns.small, Header: 'Kod', id: 'id', accessor: (r) => r.id },
            { ...nextTableColumns.small, Header: 'M. kodu', id: 'user_id', accessor: (r) => r.client.id },
            { accessor: (r) => r.client.name, id: 'user_name', Header: 'Müştəri' },
            { accessor: (r) => r.deliverer.name, id: 'deliverer_id', Header: 'Kuryer', filterable: false },
            {
                ...nextTableColumns.normal,
                accessor: (r) => r.status.name,
                id: 'state_id',
                Header: 'Status',
                filterable: false,
                Cell: ({ row: { original } }: any) => <Tag>{original.status.name}</Tag>,
            },
            { ...nextTableColumns.normal, accessor: (r) => r.region.name, id: 'region_id', Header: 'Rayon', filterable: false },
            { ...nextTableColumns.date, accessor: (r) => r.assignedAt, id: 'deliverer_date', Header: 'Təhkim tarixi' },
            { ...nextTableColumns.date, accessor: (r) => r.createdAt, id: 'created_at', Header: 'Tarix' },
        ],
        [],
    );

    return useMemo(() => [actionsColumn, ...baseColumns], [actionsColumn, baseColumns]);
};
