import { FC } from 'react';
import { NextTable } from '@shared/modules/next-table/containers';
import { NotificationTemplatesTableContext } from '../context';
import { useNotificationTemplatesTable } from '../hooks';

export const NotificationTemplatesTable: FC = () => {
    const { columns } = useNotificationTemplatesTable();
    return <NextTable context={NotificationTemplatesTableContext} columns={columns} />;
};
