import { FC } from 'react';
import { NextTable } from '@shared/modules/next-table/containers';
import { WhatsappNotificationsTableContext } from '../context';
import { useWhatsappNotificationsTable } from '../hooks';

export const WhatsappNotificationsTable: FC = () => {
    const { columns } = useWhatsappNotificationsTable();
    return <NextTable context={WhatsappNotificationsTableContext} columns={columns} />;
};
