import { useContext, useEffect } from "react";
import { useSearchParams } from "@shared/hooks";
import { useShopNamesTableColumns } from "./use-shop-names-table-columns";
import { ShopNamesTableContext } from "../../context";

export const useShopNamesTable = () => {
  const { handleFetch } = useContext(ShopNamesTableContext);
  const columns = useShopNamesTableColumns();
  const { searchParams, remove } = useSearchParams<{ reFetchShopNamesTable?: string }>();

  useEffect(() => {
    (async () => {
      if (searchParams.reFetchShopNamesTable) {
        remove.current('reFetchShopNamesTable');
        await handleFetch();
      }
    })();
  }, [handleFetch, remove, searchParams.reFetchShopNamesTable]);

  return { columns };
};
