import { usePartnerDeclarationsTableColumns } from './use-partner-declarations-table-columns';

export const usePartnerDeclarationsTable = () => {
  const columns = usePartnerDeclarationsTableColumns();
  return { columns };
};
