import { useUnitedQueuesTableColumns } from "./use-united-queues-table-columns";

export const useUnitedQueuesTable = () => {
  const columns = useUnitedQueuesTableColumns();
  return { columns };
};
