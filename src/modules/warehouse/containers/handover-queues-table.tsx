import { FC } from 'react';
import { NextTable } from '@shared/modules/next-table/containers';
import { HandoverQueuesTableContext } from '../context';
import { useHandoverQueuesTable } from '../hooks';

export const HandoverQueuesTable: FC = () => {
    const { columns } = useHandoverQueuesTable();
    return <NextTable context={HandoverQueuesTableContext} columns={columns} />;
};
