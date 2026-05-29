import React, { useContext, useMemo } from 'react';
import { Button, Dropdown, MenuProps, Modal, Tag, message } from 'antd';
import * as Icons from '@ant-design/icons';
import { Column } from 'react-table';
import { useNavigate } from 'react-router-dom';
import { StopPropagation } from '@shared/components/stop-propagation';
import { nextTableColumns } from '@shared/modules/next-table/helpers/next-table-columns';
import { ICashFlowTransaction } from '../../interfaces';
import { CashFlowTransactionsTableContext } from '../../context';
import { CashFlowTransactionsService } from '../../services';

export const useCashFlowTransactionsTableColumns = (): Column<ICashFlowTransaction>[] => {
    const { handleFetch } = useContext(CashFlowTransactionsTableContext);
    const navigate = useNavigate();

    const actionsColumn = useMemo<Column<ICashFlowTransaction>>(
        () => ({
            ...nextTableColumns.actions,
            Cell: ({ row: { original } }: any) => {
                const items: MenuProps['items'] = [
                    {
                        key: 'edit',
                        label: 'Düzəliş et',
                        icon: <Icons.EditOutlined />,
                        onClick: () => navigate(`/cash-flow/transactions/${original.id}/update`, { state: { background: window.location.pathname } }),
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
                                content: 'Tranzaksiyanı silməyə əminsinizmi?',
                                okType: 'danger',
                                okText: 'Sil',
                                cancelText: 'Ləğv et',
                                onOk: async () => {
                                    const result = await CashFlowTransactionsService.remove(original.id);
                                    if (result.status === 200) { message.success('Tranzaksiya silindi.'); handleFetch(); }
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

    const baseColumns = useMemo<Column<ICashFlowTransaction>[]>(
        () => [
            { ...nextTableColumns.small, Header: 'Kod', id: 'id', accessor: (r) => r.id },
            { ...nextTableColumns.normal, accessor: (r) => r.cashRegister.name, id: 'cashbox_id', Header: 'Kassa', filterable: false },
            { ...nextTableColumns.normal, accessor: (r) => r.amount, id: 'amount', Header: 'Məbləğ', filterable: false,
                Cell: ({ row: { original } }: any) => `${original.amount.toFixed(2)} ${original.cashRegister.currency.code}` as any },
            {
                ...nextTableColumns.normal,
                accessor: (r) => r.type,
                id: 'operation',
                Header: 'Əməliyyat',
                filterable: false,
                Cell: ({ row: { original } }: any) => (
                    <Tag color={original.type === 'income' ? 'green' : 'red'}>
                        {original.type === 'income' ? 'Mədaxil' : 'Məxaric'}
                    </Tag>
                ),
            },
            {
                ...nextTableColumns.normal,
                accessor: (r) => r.paymentType.name,
                id: 'payment_type',
                Header: 'Ödəniş tipi',
                filterable: false,
            },
            {
                ...nextTableColumns.small,
                accessor: (r) => r.isTransfer,
                id: 'transfer',
                Header: 'TR',
                filterable: false,
                Cell: ({ row: { original } }: any) => original.isTransfer ? <Tag color='blue'>Bəli</Tag> : null,
            },
            {
                accessor: (r) => r.operation.name,
                id: 'cash_category_id',
                Header: 'Kateqoriya',
                filterable: false,
                Cell: ({ row: { original } }: any) => `${original.operation.name} - ${original.operation.child.name}` as any,
            },
            { ...nextTableColumns.normal, accessor: (r) => r.executor.name, id: 'user_id', Header: 'İcraçı', filterable: false },
            { ...nextTableColumns.date, accessor: (r) => r.operatedAt, id: 'operation_date', Header: 'Əməliyyat tarixi' },
        ],
        [],
    );

    return useMemo(() => [actionsColumn, ...baseColumns], [actionsColumn, baseColumns]);
};
