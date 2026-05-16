import { useContext, useEffect } from "react";
import { useSearchParams } from "@shared/hooks";
import { useFaqTableColumns } from "./use-faq-table-columns";
import { FaqTableContext } from "../../context";

export const useFaqTable = () => {
  const { handleFetch } = useContext(FaqTableContext);
  const columns = useFaqTableColumns(handleFetch);
  const { searchParams, remove } = useSearchParams<{ reFetchFaqTable?: string }>();

  useEffect(() => {
    (async () => {
      if (searchParams.reFetchFaqTable) {
        remove.current('reFetchFaqTable');
        await handleFetch();
      }
    })();
  }, [handleFetch, remove, searchParams.reFetchFaqTable]);

  return { columns };
};
