import { useHandoverQueuesTableColumns } from './use-handover-queues-table-columns';

export const useHandoverQueuesTable = () => {
    const columns = useHandoverQueuesTableColumns();
    return { columns };
};
