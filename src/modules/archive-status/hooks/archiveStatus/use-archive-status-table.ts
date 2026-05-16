import { useArchiveStatusTableColumns } from "./use-archive-status-table-columns";

export const useArchiveStatusTable = () => {
  const columns = useArchiveStatusTableColumns();
  return { columns };
};
