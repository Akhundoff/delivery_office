import { useBoxTransfersTableColumns } from './use-box-transfers-table-columns';

export const useBoxTransfersTable = () => {
    const columns = useBoxTransfersTableColumns();
    return { columns };
};
