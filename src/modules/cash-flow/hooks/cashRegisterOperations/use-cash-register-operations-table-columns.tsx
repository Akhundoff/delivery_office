import React, { useContext, useMemo } from 'react';
import { Button, Dropdown, MenuProps, Modal, message } from 'antd';
import * as Icons from '@ant-design/icons';
import { Column } from 'react-table';
import { useNavigate } from 'react-router-dom';
import { StopPropagation } from '@shared/components/stop-propagation';
import { nextTableColumns } from '@shared/modules/next-table/helpers/next-table-columns';
import { ICashRegisterOperationWithParent } from '../../interfaces';
import { CashRegisterOperationsTableContext } from '../../context';
import { CashRegisterOperationsService } from '../../services';

export const useCashRegisterOperationsTableColumns = (): Column<ICashRegisterOperationWithParent>[] => {
    const { handleFetch } = useContext(CashRegisterOperationsTableContext);
    const navigate = useNavigate();

    const actionsColumn = useMemo<Column<ICashRegisterOperationWithParent>>(
        () => ({
            ...nextTableColumns.actions,
            Cell: ({ row: { original } }: any) => {
                const items: MenuProps['items'] = [
                    {
                        key: 'edit',
                        label: 'Düzəliş et',
                        icon: <Icons.EditOutlined />,
                        onClick: () => navigate(`/cash-flow/operations/${original.id}/update`, { state: { background: window.location.pathname } }),
                    },
                    { type: 'divider' as const },
                    {
                        key: 'delete',
                        label: 'Sil',
                        icon: <Icons.DeleteOutlined />,
                        danger: true,
                        onClick: () =>
                            Modal.confirm({
                                title: 'Diqqət',
                                content: 'Kateqoriyanı silməyə əminsinizmi?',
                                okType: 'danger',
                                okText: 'Sil',
                                cancelText: 'Ləğv et',
                                onOk: async () => {
                                    const result = await CashRegisterOperationsService.remove(original.id);
                                    if (result.status === 200) { message.success('Kateqoriya silindi.'); handleFetch(); }
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
        [handleFetch, navigate],
    );

    const baseColumns = useMemo<Column<ICashRegisterOperationWithParent>[]>(
        () => [
            { ...nextTableColumns.small, Header: 'Kod', id: 'id', accessor: (r) => r.id },
            { accessor: (r) => r.name, id: 'name', Header: 'Ad' },
            { ...nextTableColumns.normal, accessor: (r) => r.parent?.name || '—', id: 'parent_id', Header: 'Valideyn', filterable: false },
            { ...nextTableColumns.date, accessor: (r) => r.createdAt, id: 'created_at', Header: 'Tarix' },
        ],
        [],
    );

    return useMemo(() => [actionsColumn, ...baseColumns], [actionsColumn, baseColumns]);
};
