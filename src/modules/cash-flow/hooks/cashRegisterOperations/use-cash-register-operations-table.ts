import { useCashRegisterOperationsTableColumns } from './use-cash-register-operations-table-columns';

export const useCashRegisterOperationsTable = () => {
  const columns = useCashRegisterOperationsTableColumns();
  return { columns };
};
