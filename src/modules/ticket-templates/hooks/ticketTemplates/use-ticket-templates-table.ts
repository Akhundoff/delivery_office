import { useContext } from 'react';
import { TicketTemplatesTableContext } from '../../context';
import { useTicketTemplatesTableColumns } from './use-ticket-templates-table-columns';

export const useTicketTemplatesTable = () => {
    const { handleFetch } = useContext(TicketTemplatesTableContext);
    const columns = useTicketTemplatesTableColumns(handleFetch);
    return { columns };
};
