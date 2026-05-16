import { useContext, useEffect } from "react";
import { useSearchParams } from "@shared/hooks";
import { usePlansTableColumns } from "./use-plans-table-columns";
import { PlansTableContext } from "../../context";

export const usePlansTable = () => {
  const { handleFetch } = useContext(PlansTableContext);
  const columns = usePlansTableColumns();
  const { searchParams, remove } = useSearchParams<{ reFetchPlansTable?: string }>();

  useEffect(() => {
    (async () => {
      if (searchParams.reFetchPlansTable) {
        remove.current('reFetchPlansTable');
        await handleFetch();
      }
    })();
  }, [handleFetch, remove, searchParams.reFetchPlansTable]);

  return { columns };
};
