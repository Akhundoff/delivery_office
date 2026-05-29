import { FC } from 'react';
import { NextTable } from '@shared/modules/next-table/containers';
import { DelivererAssignmentsTableContext } from '../context';
import { useDelivererAssignmentsTableColumns } from '../hooks';

export const DelivererAssignmentsTable: FC = () => {
    const columns = useDelivererAssignmentsTableColumns();
    return <NextTable context={DelivererAssignmentsTableContext} columns={columns} />;
};
