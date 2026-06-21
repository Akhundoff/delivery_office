import { useDelivererAssignmentsTableColumns } from './use-deliverer-assignments-table-columns';

export const useDelivererAssignmentsTable = () => {
  const columns = useDelivererAssignmentsTableColumns();
  return { columns };
};
