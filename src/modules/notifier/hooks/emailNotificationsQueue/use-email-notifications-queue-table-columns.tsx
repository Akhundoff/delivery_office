import { FC, useCallback, useMemo, useState } from 'react';
import { Column } from 'react-table';
import { Modal } from 'antd';
import { nextTableColumns } from '@shared/modules/next-table/helpers/next-table-columns';
import { SwitchCell } from '@shared/components/cells';
import { IEmailNotification } from '../../interfaces';
import { EmailNotificationsQueueService } from '../../services';

const EmailBodyCell: FC<{ value: string }> = ({ value }) => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <span onClick={(e) => { e.stopPropagation(); setOpen(true); }} style={{ cursor: 'pointer', textDecoration: 'underline' }}>Məzmuna bax</span>
            <Modal open={open} footer={null} onCancel={() => setOpen(false)} destroyOnClose>
                <div dangerouslySetInnerHTML={{ __html: value }} />
            </Modal>
        </>
    );
};

export const useEmailNotificationsQueueTableColumns = (): Column<IEmailNotification>[] => {
    const handleToggleActive = useCallback(async (id: number, isActive: boolean) => {
        const result = await EmailNotificationsQueueService.toggleIsActive(id, isActive);
        if (result.status !== 200) throw new Error('Xəta');
    }, []);

    return useMemo(
        () => [
            { ...nextTableColumns.small, Header: 'Kod', id: 'id', accessor: (r) => r.id },
            { Header: 'Email', id: 'email', accessor: (r) => r.email },
            { ...nextTableColumns.small, Header: 'Müştəri kodu', id: 'user_id', accessor: (r) => r.userId },
            {
                ...nextTableColumns.smaller,
                Header: 'Aktivlik',
                id: 'active',
                accessor: (r) => r.isActive,
                Cell: ({ row: { original } }: any) => (
                    <SwitchCell
                        checked={original.isActive}
                        onChange={(newValue) => handleToggleActive(original.id, newValue)}
                        disabled={original.sent}
                    />
                ),
            },
            { ...nextTableColumns.normal, Header: 'Bölmə', id: 'model_name', accessor: (r) => r.model.name },
            {
                Header: 'Məzmun',
                id: 'body',
                accessor: (r) => r.body,
                Cell: ({ cell: { value } }: any) => <EmailBodyCell value={value} />,
            },
            { ...nextTableColumns.date, Header: 'Cəhd tarixi', id: 'retry_at', accessor: (r) => r.retriedAt },
            { ...nextTableColumns.date, Header: 'Göndərilmə tarixi', id: 'sended_at', accessor: (r) => r.sentAt },
            { ...nextTableColumns.date, Header: 'Yaradılıb', id: 'created_at', accessor: (r) => r.createdAt },
        ],
        [handleToggleActive],
    );
};
