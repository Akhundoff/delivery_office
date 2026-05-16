import { useLogsTableColumns } from "./use-logs-table-columns";

export const useLogsTable = () => {
  const columns = useLogsTableColumns();
  return { columns };
};
