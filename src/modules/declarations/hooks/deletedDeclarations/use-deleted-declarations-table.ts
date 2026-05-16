import { useDeclarationsTableColumns } from '../declarations/use-declarations-table-columns';

export const useDeletedDeclarationsTable = () => {
    const columns = useDeclarationsTableColumns();
    return { columns };
};
