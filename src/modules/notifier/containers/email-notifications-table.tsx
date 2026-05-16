import { FC } from 'react';
import { NextTable } from '@shared/modules/next-table/containers';
import { EmailNotificationsTableContext } from '../context';
import { useEmailNotificationsTable } from '../hooks';

export const EmailNotificationsTable: FC = () => {
    const { columns } = useEmailNotificationsTable();
    return <NextTable context={EmailNotificationsTableContext} columns={columns} />;
};
