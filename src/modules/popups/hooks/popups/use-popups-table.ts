import { useContext, useEffect } from "react";
import { useSearchParams } from "@shared/hooks";
import { usePopupsTableColumns } from "./use-popups-table-columns";
import { PopupsTableContext } from "../../context";

export const usePopupsTable = () => {
  const { handleFetch } = useContext(PopupsTableContext);
  const columns = usePopupsTableColumns();
  const { searchParams, remove } = useSearchParams<{ reFetchPopupsTable?: string }>();

  useEffect(() => {
    (async () => {
      if (searchParams.reFetchPopupsTable) {
        remove.current('reFetchPopupsTable');
        await handleFetch();
      }
    })();
  }, [handleFetch, remove, searchParams.reFetchPopupsTable]);

  return { columns };
};
