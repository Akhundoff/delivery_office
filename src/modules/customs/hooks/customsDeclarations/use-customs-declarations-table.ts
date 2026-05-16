import { useCustomsDeclarationsTableColumns } from './use-customs-declarations-table-columns';

export const useCustomsDeclarationsTable = () => {
    const columns = useCustomsDeclarationsTableColumns();
    return { columns };
};
