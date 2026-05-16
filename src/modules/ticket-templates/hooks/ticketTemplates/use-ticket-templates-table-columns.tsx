import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Column } from 'react-table';
import { Button, Dropdown, message, Modal } from 'antd';
import type { MenuProps } from 'antd';
import * as Icons from '@ant-design/icons';
import { nextTableColumns } from '@shared/modules/next-table/helpers/next-table-columns';
import { StopPropagation } from '@shared/components/stop-propagation';
import { ITicketTemplate } from '../../interfaces';
import { TicketTemplatesService } from '../../services';

export const useTicketTemplatesTableColumns = (handleFetch: () => void): Column<ITicketTemplate>[] => {
    const navigate = useNavigate();

    const handleRemove = useCallback((id: number) => {
        Modal.confirm({
            title: 'Diqqət',
            content: 'Müraciət şablonunu silməyə əminsinizmi?',
            okText: 'Sil',
            okType: 'danger',
            cancelText: 'Ləğv et',
            onOk: async () => {
                const result = await TicketTemplatesService.remove(id);
                if (result.status === 200) {
                    handleFetch();
                } else {
                    message.error('Xəta baş verdi.');
                }
            },
        });
    }, [handleFetch]);

    return useMemo<Column<ITicketTemplate>[]>(
        () => [
            {
                ...nextTableColumns.actions,
                Cell: ({ row: { original } }: any) => {
                    const items: MenuProps['items'] = [
                        { key: 'details', icon: <Icons.InfoCircleOutlined />, label: 'Ətraflı', onClick: () => navigate(`/ticket-templates/${original.id}`) },
                        { key: 'edit', icon: <Icons.EditOutlined />, label: 'Düzəliş et', onClick: () => navigate(`/ticket-templates/${original.id}/update`) },
                        { key: 'delete', icon: <Icons.DeleteOutlined />, label: 'Sil', danger: true, onClick: () => handleRemove(original.id) },
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
            { ...nextTableColumns.date, accessor: (r) => r.createdAt, id: 'created_at', Header: 'Yaradılıb' },
        ],
        [navigate, handleRemove],
    );
};
