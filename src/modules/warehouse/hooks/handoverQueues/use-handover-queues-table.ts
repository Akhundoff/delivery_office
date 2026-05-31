import { useHandoverQueuesTableColumns } from './use-handover-queues-table-columns';
import { useHandoverQueueCounterSync } from './use-handover-queue-counter-sync';

export const useHandoverQueuesTable = () => {
    const columns = useHandoverQueuesTableColumns();
    useHandoverQueueCounterSync();
    return { columns };
};
