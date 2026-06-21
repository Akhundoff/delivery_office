import { useCouriersTableColumns } from './use-couriers-table-columns';

export const useCouriersTable = () => {
  const columns = useCouriersTableColumns();
  return { columns };
};
