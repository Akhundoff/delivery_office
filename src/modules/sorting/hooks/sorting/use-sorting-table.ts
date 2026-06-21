import { useNonSortedDeclarationsTableColumns } from './use-non-sorted-declarations-table-columns';

export const useSortingTable = () => {
  const columns = useNonSortedDeclarationsTableColumns();
  return { columns };
};
