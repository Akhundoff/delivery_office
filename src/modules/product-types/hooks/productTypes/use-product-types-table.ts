import { useContext, useEffect } from "react";
import { useSearchParams } from "@shared/hooks";
import { useProductTypesTableColumns } from "./use-product-types-table-columns";
import { ProductTypesTableContext } from "../../context";

export const useProductTypesTable = () => {
  const { handleFetch } = useContext(ProductTypesTableContext);
  const columns = useProductTypesTableColumns();
  const { searchParams, remove } = useSearchParams<{ reFetchProductTypesTable?: string }>();

  useEffect(() => {
    (async () => {
      if (searchParams.reFetchProductTypesTable) {
        remove.current('reFetchProductTypesTable');
        await handleFetch();
      }
    })();
  }, [handleFetch, remove, searchParams.reFetchProductTypesTable]);

  return { columns };
};
