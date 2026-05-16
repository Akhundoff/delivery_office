import { useMemo } from 'react';
import { Column } from 'react-table';
import { nextTableColumns } from '@shared/modules/next-table/helpers/next-table-columns';
import { CheckCell, OverCell } from '@shared/components/cells';
import { IEmailNotification } from '../../interfaces';

export const useEmailNotificationsTableColumns = (): Column<IEmailNotification>[] =>
    useMemo(
        () => [
            { ...nextTableColumns.small, Header: 'Kod', id: 'id', accessor: (r) => r.id },
            { ...nextTableColumns.normal, Header: 'Email', id: 'email', accessor: (r) => r.email, Cell: OverCell },
            { ...nextTableColumns.small, Header: 'Müştəri kodu', id: 'user_id', accessor: (r) => r.userId },
            { ...nextTableColumns.smaller, Header: 'Göndərilib', id: 'sent', accessor: (r) => r.sent, Cell: CheckCell },
            { ...nextTableColumns.normal, Header: 'Bölmə', id: 'model_name', accessor: (r) => r.model.name },
            { accessor: (r) => r.body, id: 'body', Header: 'Məzmun', Cell: OverCell },
            { ...nextTableColumns.date, Header: 'Cəhd tarixi', id: 'retry_at', accessor: (r) => r.retriedAt },
            { ...nextTableColumns.date, Header: 'Göndərilmə tarixi', id: 'sended_at', accessor: (r) => r.sentAt },
            { ...nextTableColumns.date, Header: 'Yaradılıb', id: 'created_at', accessor: (r) => r.createdAt },
        ],
        [],
    );
