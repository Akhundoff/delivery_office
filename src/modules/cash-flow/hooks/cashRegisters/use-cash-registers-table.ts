import { useCashRegistersTableColumns } from './use-cash-registers-table-columns';

export const useCashRegistersTable = () => {
  const columns = useCashRegistersTableColumns();
  return { columns };
};
