import { useContext, useEffect } from "react";
import { useSearchParams } from "@shared/hooks";
import { useNewsTableColumns } from "./use-news-table-columns";
import { NewsTableContext } from "../../context";

export const useNewsTable = () => {
  const { handleFetch } = useContext(NewsTableContext);
  const columns = useNewsTableColumns(handleFetch);
  const { searchParams, remove } = useSearchParams<{ reFetchNewsTable?: string }>();

  useEffect(() => {
    (async () => {
      if (searchParams.reFetchNewsTable) {
        remove.current('reFetchNewsTable');
        await handleFetch();
      }
    })();
  }, [handleFetch, remove, searchParams.reFetchNewsTable]);

  return { columns };
};
