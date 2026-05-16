import { usePostDeclarationsTableColumns } from './use-post-declarations-table-columns';

export const usePostDeclarationsTable = () => {
    const columns = usePostDeclarationsTableColumns();
    return { columns };
};
