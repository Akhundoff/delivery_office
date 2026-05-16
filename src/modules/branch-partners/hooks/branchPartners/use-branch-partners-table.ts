import { useContext, useEffect } from "react";
import { useSearchParams } from "@shared/hooks";
import { useBranchPartnersTableColumns } from "./use-branch-partners-table-columns";
import { BranchPartnersTableContext } from "../../context";

export const useBranchPartnersTable = () => {
  const { handleFetch } = useContext(BranchPartnersTableContext);
  const columns = useBranchPartnersTableColumns();
  const { searchParams, remove } = useSearchParams<{ reFetchBranchPartnersTable?: string }>();

  useEffect(() => {
    (async () => {
      if (searchParams.reFetchBranchPartnersTable) {
        remove.current('reFetchBranchPartnersTable');
        await handleFetch();
      }
    })();
  }, [handleFetch, remove, searchParams.reFetchBranchPartnersTable]);

  return { columns };
};
