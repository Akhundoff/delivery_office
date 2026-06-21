import { useCurrenciesTableColumns } from './use-currencies-table-columns';

export const useCurrenciesTable = () => {
  const columns = useCurrenciesTableColumns();
  return { columns };
};
