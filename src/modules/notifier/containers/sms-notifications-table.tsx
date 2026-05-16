import { FC } from 'react';
import { NextTable } from '@shared/modules/next-table/containers';
import { SmsNotificationsTableContext } from '../context';
import { useSmsNotificationsTable } from '../hooks';

export const SmsNotificationsTable: FC = () => {
    const { columns } = useSmsNotificationsTable();
    return <NextTable context={SmsNotificationsTableContext} columns={columns} />;
};
