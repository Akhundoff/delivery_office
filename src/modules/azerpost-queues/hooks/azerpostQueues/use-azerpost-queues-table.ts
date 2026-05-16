import { useAzerpostQueuesTableColumns } from "./use-azerpost-queues-table-columns";

export const useAzerpostQueuesTable = () => {
  const columns = useAzerpostQueuesTableColumns();
  return { columns };
};
