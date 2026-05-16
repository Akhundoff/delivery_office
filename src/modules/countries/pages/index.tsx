import { FC } from "react";
import { NextTableProvider } from "@shared/modules/next-table/context/provider";
import { PageContent } from "@shared/styled/page-content";
import { CountriesTableContext } from "../context";
import { useCountriesTable } from "../hooks";
import { CountriesTable, CountriesActionBar } from "../containers";

export const CountriesPage: FC = () => {
  const { onFetch } = useCountriesTable();

  return (
    <PageContent $contain={true}>
      <NextTableProvider context={CountriesTableContext} onFetch={onFetch} name="countries-table">
        <CountriesActionBar />
        <CountriesTable />
      </NextTableProvider>
    </PageContent>
  );
};
