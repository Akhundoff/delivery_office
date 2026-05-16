import { useModelsTableColumns } from "./use-models-table-columns";

export const useModelsTable = () => {
  const columns = useModelsTableColumns();
  return { columns };
};
