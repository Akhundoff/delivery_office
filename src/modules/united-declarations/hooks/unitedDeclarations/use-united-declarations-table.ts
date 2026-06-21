import { useUnitedDeclarationsTableColumns } from './use-united-declarations-table-columns';

export const useUnitedDeclarationsTable = () => {
  const columns = useUnitedDeclarationsTableColumns();
  return { columns };
};
