import { useContext, useEffect } from "react";
import { useSearchParams } from "@shared/hooks";
import { useShopsTableColumns } from "./use-shops-table-columns";
import { ShopsTableContext } from "../../context";

export const useShopsTable = () => {
  const { handleFetch } = useContext(ShopsTableContext);
  const columns = useShopsTableColumns();
  const { searchParams, remove } = useSearchParams<{ reFetchShopsTable?: string }>();

  useEffect(() => {
    (async () => {
      if (searchParams.reFetchShopsTable) {
        remove.current('reFetchShopsTable');
        await handleFetch();
      }
    })();
  }, [handleFetch, remove, searchParams.reFetchShopsTable]);

  return { columns };
};
