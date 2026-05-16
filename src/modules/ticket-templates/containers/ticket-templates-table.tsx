import { FC } from 'react';
import { NextTable } from '@shared/modules/next-table/containers';
import { TicketTemplatesTableContext } from '../context';
import { useTicketTemplatesTable } from '../hooks';

export const TicketTemplatesTable: FC = () => {
    const { columns } = useTicketTemplatesTable();
    return <NextTable context={TicketTemplatesTableContext} columns={columns} />;
};
