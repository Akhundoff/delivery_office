import { FC, useState } from 'react';
import { useMemo } from 'react';
import { Column } from 'react-table';
import { useQuery } from 'react-query';
import { Modal, Tooltip } from 'antd';
import { nextTableColumns } from '@shared/modules/next-table/helpers/next-table-columns';
import { Check } from '@shared/components/cells';
import { ISmsNotification } from '../../interfaces';
import { WhatsappNotificationsQueueService } from '../../services';

const WhatsappStatusCell: FC<{ original: ISmsNotification }> = ({ original }) => {
    const [visible, setVisible] = useState(false);
    const { data } = useQuery(
        ['notifier', 'whatsapp', original.id, 'status'],
        () => WhatsappNotificationsQueueService.getStatus(original.id).then((r) => (r.status === 200 ? r.data : '')),
        { enabled: visible },
    );
    return (
        <Tooltip open={!!data && visible} onOpenChange={setVisible} title={data || ' '}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Check checked={original.sent} />
            </div>
        </Tooltip>
    );
};

const BodyCell: FC<{ value: string }> = ({ value }) => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <span onClick={(e) => { e.stopPropagation(); setOpen(true); }} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
                {String(value).slice(0, 30)}...
            </span>
            <Modal open={open} footer={null} onCancel={() => setOpen(false)} destroyOnClose>{value}</Modal>
        </>
    );
};

export const useWhatsappNotificationsTableColumns = (): Column<ISmsNotification>[] =>
    useMemo(
        () => [
            { ...nextTableColumns.small, Header: 'Kod', id: 'id', accessor: (r) => r.id },
            { Header: 'Telefon nömrəsi', id: 'phone', accessor: (r) => r.phoneNumber },
            { ...nextTableColumns.small, Header: 'Müştəri kodu', id: 'user_id', accessor: (r) => r.userId },
            {
                ...nextTableColumns.smaller,
                Header: 'Status',
                id: 'sent',
                accessor: (r) => r.sent,
                Cell: ({ row: { original } }: any) => <WhatsappStatusCell original={original} />,
            },
            { ...nextTableColumns.normal, Header: 'Bölmə', id: 'model_name', accessor: (r) => r.model.name },
            {
                Header: 'Məzmun',
                id: 'body',
                accessor: (r) => r.body,
                Cell: ({ cell: { value } }: any) => <BodyCell value={value} />,
            },
            { ...nextTableColumns.date, Header: 'Cəhd tarixi', id: 'retry_at', accessor: (r) => r.retriedAt },
            { ...nextTableColumns.date, Header: 'Göndərilmə tarixi', id: 'sended_at', accessor: (r) => r.sentAt },
            { ...nextTableColumns.date, Header: 'Yaradılıb', id: 'created_at', accessor: (r) => r.createdAt },
        ],
        [],
    );
