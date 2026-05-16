import { useMemo } from 'react';
import { Column } from 'react-table';
import { Button, Dropdown, MenuProps, Modal, Select, message } from 'antd';
import * as Icons from '@ant-design/icons';

import { OverCell } from '@shared/components/cells';
import { StopPropagation } from '@shared/components/stop-propagation';
import { nextTableColumns } from '@shared/modules/next-table/helpers/next-table-columns';
import { filterOption } from '@shared/modules/antd/helpers/filter-option';
import { useBackgroundNavigate } from '@shared/hooks';

import { UsersService } from '../../services';
import { IUser } from '../../interfaces';
import { userQueryKeys } from '../../utils';

export const useUsersTableColumns = (handleFetch: () => void): Column<IUser>[] => {
    const navigate = useBackgroundNavigate();

    const actionsColumn = useMemo<Column<IUser>>(
        () => ({
            ...nextTableColumns.actions,
            Cell: ({ row: { original } }: any) => {
                const items: MenuProps['items'] = [
                    {
                        key: 'details',
                        label: 'Ətraflı bax',
                        icon: <Icons.FileSearchOutlined />,
                        onClick: () => navigate(`/users/${original.id}`),
                    },
                    {
                        key: 'edit',
                        label: 'Düzəliş et',
                        icon: <Icons.EditOutlined />,
                        onClick: () => navigate(`/users/${original.id}/update`, { withBackground: true }),
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
                                content: 'İstifadəçini silməyə əminsinizmi?',
                                okText: 'Sil',
                                okType: 'danger',
                                cancelText: 'Ləğv et',
                                onOk: async () => {
                                    const result = await UsersService.deleteUser(original.id);
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

    const baseColumns = useMemo<Column<IUser>[]>(
        () => [
            {
                ...nextTableColumns.small,
                Header: 'Kod',
                id: userQueryKeys.id,
                accessor: (row: IUser) => row.id,
            },
            {
                accessor: (row: IUser) => `${row.firstname} ${row.lastname}`,
                id: userQueryKeys.fullName,
                Header: 'Ad Soyad',
                Cell: OverCell,
            },
            {
                accessor: (row: IUser) => row.email,
                id: userQueryKeys.email,
                Header: 'Email',
                Cell: OverCell,
            },
            {
                ...nextTableColumns.normal,
                accessor: (row: IUser) => row.phoneNumber,
                id: userQueryKeys.phoneNumber,
                Header: 'Telefon',
            },
            {
                ...nextTableColumns.small,
                accessor: (row: IUser) =>
                    row.gender === 'female' ? 'Qadın' : row.gender === 'male' ? 'Kişi' : '—',
                id: userQueryKeys.gender,
                Header: 'Cins',
                Filter: ({ column: { setFilter, filterValue } }: any) => (
                    <Select style={{ width: '100%' }} onChange={setFilter} value={filterValue} allowClear={true}>
                        <Select.Option value='male'>Kişi</Select.Option>
                        <Select.Option value='female'>Qadın</Select.Option>
                    </Select>
                ),
            },
            {
                ...nextTableColumns.date,
                accessor: (row: IUser) =>
                    row.birthDate ? new Date(row.birthDate).toLocaleDateString('az-AZ') : '—',
                id: userQueryKeys.birthDate,
                Header: 'Doğum günü',
            },
            {
                ...nextTableColumns.normal,
                accessor: (row: IUser) => `${row.balance.try.toFixed(2)} ₺`,
                id: userQueryKeys.balance.try,
                Header: 'Balans (TRY)',
                filterable: false,
                sortable: false,
            },
            {
                ...nextTableColumns.normal,
                accessor: (row: IUser) => `${row.balance.usd.toFixed(2)} $`,
                id: userQueryKeys.balance.usd,
                Header: 'Balans (USD)',
                filterable: false,
                sortable: false,
            },
            {
                ...nextTableColumns.normal,
                accessor: (row: IUser) => row.passport.number || '—',
                id: userQueryKeys.passport.number,
                Header: 'Ş.V nömrəsi',
            },
            {
                ...nextTableColumns.small,
                accessor: (row: IUser) => row.passport.secret || '—',
                id: userQueryKeys.passport.secret,
                Header: 'FİN kod',
            },
            {
                ...nextTableColumns.small,
                accessor: (row: IUser) => row.adminCompanyName || '—',
                id: userQueryKeys.adminCompanyName,
                Header: 'Şirkət',
                Cell: OverCell,
                Filter: () => null,
            },
            {
                ...nextTableColumns.small,
                accessor: (row: IUser) => row.branch.name || '—',
                id: userQueryKeys.branch.id,
                Header: 'Filial',
                Cell: OverCell,
                Filter: ({ column: { filterValue, setFilter } }: any) => (
                    <Select
                        showSearch={true}
                        filterOption={filterOption}
                        allowClear={true}
                        style={{ width: '100%' }}
                        onChange={setFilter}
                        value={filterValue}
                        placeholder='Filial seç'
                    />
                ),
            },
        ],
        [],
    );

    return useMemo(() => [actionsColumn, ...baseColumns], [actionsColumn, baseColumns]);
};
