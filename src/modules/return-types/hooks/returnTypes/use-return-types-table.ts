import { useContext, useEffect } from "react";
import { useSearchParams } from "@shared/hooks";
import { useReturnTypesTableColumns } from "./use-return-types-table-columns";
import { ReturnTypesTableContext } from "../../context";

export const useReturnTypesTable = () => {
  const { handleFetch } = useContext(ReturnTypesTableContext);
  const columns = useReturnTypesTableColumns();
  const { searchParams, remove } = useSearchParams<{ reFetchReturnTypesTable?: string }>();

  useEffect(() => {
    (async () => {
      if (searchParams.reFetchReturnTypesTable) {
        remove.current('reFetchReturnTypesTable');
        await handleFetch();
      }
    })();
  }, [handleFetch, remove, searchParams.reFetchReturnTypesTable]);

  return { columns };
};
