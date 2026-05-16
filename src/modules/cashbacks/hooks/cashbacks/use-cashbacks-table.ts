import { useCashbacksTableColumns } from "./use-cashbacks-table-columns";

export const useCashbacksTable = () => {
  const columns = useCashbacksTableColumns();
  return { columns };
};
