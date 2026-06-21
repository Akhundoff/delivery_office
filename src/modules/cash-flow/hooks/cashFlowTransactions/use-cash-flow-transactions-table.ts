import { useCashFlowTransactionsTableColumns } from './use-cash-flow-transactions-table-columns';

export const useCashFlowTransactionsTable = () => {
  const columns = useCashFlowTransactionsTableColumns();
  return { columns };
};
