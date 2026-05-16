import { useDnsQueuesTableColumns } from './use-dns-queues-table-columns';

export const useDnsQueuesTable = () => {
  const columns = useDnsQueuesTableColumns();
  return { columns };
};
