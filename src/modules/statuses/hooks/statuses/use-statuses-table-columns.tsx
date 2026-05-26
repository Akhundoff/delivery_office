import { useContext, useMemo } from 'react';
import { Column } from 'react-table';
import { Button, Dropdown, MenuProps, Tag } from 'antd';
import * as Icons from '@ant-design/icons';

import { StopPropagation } from '@shared/components/stop-propagation';
import { nextTableColumns } from '@shared/modules/next-table/helpers/next-table-columns';
import { useBackgroundNavigate } from '@shared/hooks';

import { IStatus } from '../../interfaces';
import { StatusesTableContext } from '../../context';

export const useStatusesTableColumns = (): Column<IStatus>[] => {
    const { handleFetch } = useContext(StatusesTableContext);
    const navigate = useBackgroundNavigate();

    const actionsColumn = useMemo<Column<IStatus>>(
        () => ({
            ...nextTableColumns.actions,
            Cell: ({ row: { original } }: any) => {
                const items: MenuProps['items'] = [
                    {
                        key: 'edit',
                        label: 'Düzəliş et',
                        icon: <Icons.EditOutlined />,
                        onClick: () => navigate(`/status/${original.id}/update`, { withBackground: true }),
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

    const baseColumns = useMemo<Column<IStatus>[]>(
        () => [
            { ...nextTableColumns.small, Header: 'Kod', id: 'id', accessor: (r) => r.id },
            { accessor: (r) => r.name, id: 'name', Header: 'Ad' },
            { accessor: (r) => r.nameEn, id: 'name_en', Header: 'Ad (EN)' },
            { accessor: (r) => r.model?.name, id: 'model_name', Header: 'Model' },
            {
                accessor: (r) => r.freely,
                id: 'freely',
                Header: 'Sərbəst',
                Cell: ({ value }: any) => (value ? <Tag color='green'>Bəli</Tag> : <Tag>Xeyr</Tag>),
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
