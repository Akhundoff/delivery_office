import { useContext, useEffect } from "react";
import { useSearchParams } from "@shared/hooks";
import { useCountriesTableColumns } from "./use-countries-table-columns";
import { CountriesTableContext } from "../../context";

export const useCountriesTable = () => {
  const { handleFetch } = useContext(CountriesTableContext);
  const columns = useCountriesTableColumns(handleFetch);
  const { searchParams, remove } = useSearchParams<{ reFetchCountriesTable?: string }>();

  useEffect(() => {
    (async () => {
      if (searchParams.reFetchCountriesTable) {
        remove.current('reFetchCountriesTable');
        await handleFetch();
      }
    })();
  }, [handleFetch, remove, searchParams.reFetchCountriesTable]);

  return { columns };
};
