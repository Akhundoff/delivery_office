import { useCustomsPostsTableColumns } from './use-customs-posts-table-columns';

export const useCustomsPostsTable = () => {
    const columns = useCustomsPostsTableColumns();
    return { columns };
};
