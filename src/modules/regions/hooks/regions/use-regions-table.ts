import { useContext, useEffect } from "react";
import { useSearchParams } from "@shared/hooks";
import { useRegionsTableColumns } from "./use-regions-table-columns";
import { RegionsTableContext } from "../../context";

export const useRegionsTable = () => {
  const { handleFetch } = useContext(RegionsTableContext);
  const columns = useRegionsTableColumns();
  const { searchParams, remove } = useSearchParams<{ reFetchRegionsTable?: string }>();

  useEffect(() => {
    (async () => {
      if (searchParams.reFetchRegionsTable) {
        remove.current('reFetchRegionsTable');
        await handleFetch();
      }
    })();
  }, [handleFetch, remove, searchParams.reFetchRegionsTable]);

  return { columns };
};
