import { useContext, useEffect } from "react";
import { useSearchParams } from "@shared/hooks";
import { useBoxesTableColumns } from "./use-boxes-table-columns";
import { BoxesTableContext } from "../../context";

export const useBoxesTable = () => {
  const { handleFetch } = useContext(BoxesTableContext);
  const columns = useBoxesTableColumns(handleFetch);
  const { searchParams, remove } = useSearchParams<{
    reFetchBoxesTable?: string;
  }>();

  useEffect(() => {
    (async () => {
      if (searchParams.reFetchBoxesTable) {
        remove.current("reFetchBoxesTable");
        await handleFetch();
      }
    })();
  }, [handleFetch, remove, searchParams.reFetchBoxesTable]);

  return { columns };
};
