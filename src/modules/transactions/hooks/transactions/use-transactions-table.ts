import { useTransactionsTableColumns } from './use-transactions-table-columns';

export const useTransactionsTable = () => {
  const columns = useTransactionsTableColumns();
  return { columns };
};
