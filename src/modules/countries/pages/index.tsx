import { FC } from "react";
import { NextTableProvider } from "@shared/modules/next-table/context/provider";
import { PageContent } from "@shared/styled/page-content";
import { CountriesTableContext } from "../context";
import { countriesTableFetchUseCase } from "../use-cases/table-fetch";
import { CountriesTable, CountriesActionBar } from "../containers";

export const CountriesPage: FC = () => {
  return (
    <PageContent $contain={true}>
      <NextTableProvider context={CountriesTableContext} onFetch={countriesTableFetchUseCase} name="countries-table">
        <CountriesActionBar />
        <CountriesTable />
      </NextTableProvider>
    </PageContent>
  );
};
