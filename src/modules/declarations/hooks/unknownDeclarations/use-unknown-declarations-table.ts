import { useUnknownDeclarationsTableColumns } from './use-unknown-declarations-table-columns';

export const useUnknownDeclarationsTable = () => {
  const columns = useUnknownDeclarationsTableColumns();
  return { columns };
};
