import { useRefundsTableColumns } from "./use-refunds-table-columns";

export const useRefundsTable = () => {
  const columns = useRefundsTableColumns();
  return { columns };
};
