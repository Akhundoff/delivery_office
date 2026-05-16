import { useContext, useEffect } from "react";
import { useSearchParams } from "@shared/hooks";
import { useBannersTableColumns } from "./use-banners-table-columns";
import { BannersTableContext } from "../../context";

export const useBannersTable = () => {
  const { handleFetch } = useContext(BannersTableContext);
  const columns = useBannersTableColumns();
  const { searchParams, remove } = useSearchParams<{ reFetchBannersTable?: string }>();

  useEffect(() => {
    (async () => {
      if (searchParams.reFetchBannersTable) {
        remove.current('reFetchBannersTable');
        await handleFetch();
      }
    })();
  }, [handleFetch, remove, searchParams.reFetchBannersTable]);

  return { columns };
};
