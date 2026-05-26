import { useCustomsTasksTableColumns } from './use-customs-tasks-table-columns';

export const useCustomsTasksTable = () => {
  const columns = useCustomsTasksTableColumns();
  return { columns };
};
