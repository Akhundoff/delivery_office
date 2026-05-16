import { useTicketTemplatesTableColumns } from './use-ticket-templates-table-columns';

export const useTicketTemplatesTable = () => {
    const columns = useTicketTemplatesTableColumns();
    return { columns };
};
