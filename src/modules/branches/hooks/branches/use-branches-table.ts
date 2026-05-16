import { useContext, useEffect } from "react";
import { useSearchParams } from "@shared/hooks";
import { useBranchesTableColumns } from "./use-branches-table-columns";
import { BranchesTableContext } from "../../context";

export const useBranchesTable = () => {
  const { handleFetch } = useContext(BranchesTableContext);
  const columns = useBranchesTableColumns(handleFetch);
  const { searchParams, remove } = useSearchParams<{ reFetchBranchesTable?: string }>();

  useEffect(() => {
    (async () => {
      if (searchParams.reFetchBranchesTable) {
        remove.current('reFetchBranchesTable');
        await handleFetch();
      }
    })();
  }, [handleFetch, remove, searchParams.reFetchBranchesTable]);

  return { columns };
};
