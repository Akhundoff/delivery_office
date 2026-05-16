import { useStatusesTableColumns } from "./use-statuses-table-columns";

export const useStatusesTable = () => {
  const columns = useStatusesTableColumns();
  return { columns };
};
