import { useTinyDeclarationsTableColumns } from './use-tiny-declarations-table-columns';

export const useTinyDeclarationsTable = () => {
  const columns = useTinyDeclarationsTableColumns();
  return { columns };
};
