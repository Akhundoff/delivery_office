import { useFailedJobsTableColumns } from "./use-failed-jobs-table-columns";

export const useFailedJobsTable = () => {
  const columns = useFailedJobsTableColumns();
  return { columns };
};
