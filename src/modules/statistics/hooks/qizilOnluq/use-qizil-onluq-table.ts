import { useQizilOnluqTableColumns } from './use-qizil-onluq-table-columns';

export const useQizilOnluqTable = () => {
    const columns = useQizilOnluqTableColumns();
    return { columns };
};
