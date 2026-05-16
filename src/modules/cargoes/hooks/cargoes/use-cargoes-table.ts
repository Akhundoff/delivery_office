import { useContext, useEffect } from "react";
import { useSearchParams } from "@shared/hooks";
import { useCargoesTableColumns } from "./use-cargoes-table-columns";
import { CargoesTableContext } from "../../context";

export const useCargoesTable = () => {
  const { handleFetch } = useContext(CargoesTableContext);
  const columns = useCargoesTableColumns(handleFetch);
  const { searchParams, remove } = useSearchParams<{ reFetchCargoesTable?: string }>();

  useEffect(() => {
    (async () => {
      if (searchParams.reFetchCargoesTable) {
        remove.current('reFetchCargoesTable');
        await handleFetch();
      }
    })();
  }, [handleFetch, remove, searchParams.reFetchCargoesTable]);

  return { columns };
};
