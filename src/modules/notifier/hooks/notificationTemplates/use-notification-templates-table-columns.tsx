import { useCallback, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Column } from 'react-table';
import { Button, Dropdown, message, Modal, Select } from 'antd';
import type { MenuProps } from 'antd';
import * as Icons from '@ant-design/icons';
import { nextTableColumns } from '@shared/modules/next-table/helpers/next-table-columns';
import { CheckCell } from '@shared/components/cells';
import { StopPropagation } from '@shared/components/stop-propagation';
import { INotificationTemplate } from '../../interfaces';
import { NotificationTemplatesService } from '../../services';
import { NotificationTemplatesTableContext } from '../../context';

export const useNotificationTemplatesTableColumns = (): Column<INotificationTemplate>[] => {
    const { handleFetch } = useContext(NotificationTemplatesTableContext);
    const navigate = useNavigate();

    const handleToggleActive = useCallback(async (id: number, currentActive: boolean) => {
        const result = await NotificationTemplatesService.toggleActive([id], !currentActive);
        if (result.status === 200) {
            handleFetch();
        } else {
            message.error('Xəta baş verdi.');
        }
    }, [handleFetch]);

    const handleRemove = useCallback((id: number) => {
        Modal.confirm({
            title: 'Diqqət',
            content: 'Şablonu silməyə əminsinizmi?',
            okText: 'Sil',
            okType: 'danger',
            cancelText: 'Ləğv et',
            onOk: async () => {
                const result = await NotificationTemplatesService.remove(id);
                if (result.status === 200) {
                    handleFetch();
                } else {
                    message.error('Xəta baş verdi.');
                }
            },
        });
    }, [handleFetch]);

    return useMemo<Column<INotificationTemplate>[]>(
        () => [
            {
                ...nextTableColumns.actions,
                Cell: ({ row: { original } }: any) => {
                    const items: MenuProps['items'] = [
                        {
                            key: 'details',
                            icon: <Icons.FileSearchOutlined />,
                            label: 'Ətraflı',
                            onClick: () => navigate(`/notifier/templates/${original.id}`),
                        },
                        { type: 'divider' },
                        {
                            key: 'toggle',
                            icon: original.isActive ? <Icons.CloseCircleOutlined /> : <Icons.CheckCircleOutlined />,
                            label: original.isActive ? 'Deaktivləşdir' : 'Aktivləşdir',
                            onClick: () => handleToggleActive(original.id, original.isActive),
                        },
                        {
                            key: 'edit',
                            icon: <Icons.EditOutlined />,
                            label: 'Düzəliş et',
                            onClick: () => navigate(`/notifier/templates/${original.id}/update`),
                        },
                        { type: 'divider' },
                        {
                            key: 'delete',
                            icon: <Icons.DeleteOutlined />,
                            label: 'Sil',
                            danger: true,
                            onClick: () => handleRemove(original.id),
                        },
                    ];
                    return (
                        <StopPropagation>
                            <Dropdown menu={{ items }}>
                                <Button icon={<Icons.MoreOutlined />} size='small' />
                            </Dropdown>
                        </StopPropagation>
                    );
                },
            },
            { ...nextTableColumns.small, Header: 'Kod', id: 'id', accessor: (r) => r.id },
            { accessor: (r) => r.name, id: 'name', Header: 'Ad' },
            {
                ...nextTableColumns.normal,
                accessor: (r) => r.type.id,
                id: 'template_type_id',
                Header: 'Tip',
                Cell: ({ row: { original } }: any) => original.type.name,
                Filter: ({ column: { setFilter, filterValue } }: any) => (
                    <Select onChange={setFilter} value={filterValue} style={{ width: '100%' }} allowClear>
                        <Select.Option value='1'>SMS</Select.Option>
                        <Select.Option value='2'>Email</Select.Option>
                        <Select.Option value='3'>Mobile APP</Select.Option>
                        <Select.Option value='4'>Whatsapp</Select.Option>
                    </Select>
                ),
            },
            { ...nextTableColumns.normal, accessor: (r) => r.model.name, id: 'model_name', Header: 'Model' },
            { ...nextTableColumns.normal, accessor: (r) => r.status?.name, id: 'state_name', Header: 'Status' },
            { ...nextTableColumns.smaller, accessor: (r) => r.isActive, id: 'active', Header: 'Vəziyyət', Cell: CheckCell },
            { ...nextTableColumns.date, accessor: (r) => r.createdAt, id: 'created_at', Header: 'Yaradılıb' },
        ],
        [navigate, handleToggleActive, handleRemove],
    );
};
