import { useContext, useMemo } from 'react';
import { Column } from 'react-table';
import { Button, Dropdown, MenuProps, Modal, Tag, message } from 'antd';
import * as Icons from '@ant-design/icons';

import { StopPropagation } from '@shared/components/stop-propagation';
import { nextTableColumns } from '@shared/modules/next-table/helpers/next-table-columns';
import { useBackgroundNavigate } from '@shared/hooks';

import { RefundsService } from '../../services';
import { IRefund } from '../../interfaces';
import { RefundsTableContext } from '../../context';

export const useRefundsTableColumns = (): Column<IRefund>[] => {
    const { handleFetch } = useContext(RefundsTableContext);
    const navigate = useBackgroundNavigate();

    const actionsColumn = useMemo<Column<IRefund>>(
        () => ({
            ...nextTableColumns.actions,
            Cell: ({ row: { original } }: any) => {
                const items: MenuProps['items'] = [
                    {
                        key: 'edit',
                        label: 'Düzəliş et',
                        icon: <Icons.EditOutlined />,
                        onClick: () => navigate(`/refunds/${original.id}/update`, { withBackground: true }),
                    },
                    { type: 'divider' },
                    {
                        key: 'delete',
                        label: 'Sil',
                        icon: <Icons.DeleteOutlined />,
                        danger: true,
                        onClick: () => {
                            Modal.confirm({
                                title: 'Diqqət',
                                content: 'İadəni silməyə əminsinizmi?',
                                okText: 'Sil',
                                okType: 'danger',
                                cancelText: 'Ləğv et',
                                onOk: async () => {
                                    const result = await RefundsService.delete(original.id);
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
        [navigate, handleFetch],
    );

    const baseColumns = useMemo<Column<IRefund>[]>(
        () => [
            { ...nextTableColumns.small, Header: 'Kod', id: 'id', accessor: (r) => r.id },
            { accessor: (r) => r.trackCode, id: 'track_code', Header: 'İzləmə kodu' },
            { accessor: (r) => r.refundNumber, id: 'return_number', Header: 'İadə №' },
            { accessor: (r) => r.user?.name, id: 'user_name', Header: 'İstifadəçi' },
            { accessor: (r) => r.shopName, id: 'shop_name', Header: 'Mağaza' },
            { accessor: (r) => r.productType?.name, id: 'product_type', Header: 'Məhsul tipi' },
            {
                accessor: (r) => r.state?.name,
                id: 'state_name',
                Header: 'Status',
                Cell: ({ value }: any) => (value ? <Tag color='orange'>{value}</Tag> : null),
            },
            {
                ...nextTableColumns.date,
                accessor: (r) => r.createdAt,
                id: 'created_at',
                Header: 'Tarix',
            },
        ],
        [],
    );

    return useMemo(() => [actionsColumn, ...baseColumns], [actionsColumn, baseColumns]);
};
