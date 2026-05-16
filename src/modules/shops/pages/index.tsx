import { FC } from "react";
import { NextTableProvider } from "@shared/modules/next-table/context/provider";
import { PageContent } from "@shared/styled/page-content";
import { ShopsTableContext } from "../context";
import { shopsTableFetchUseCase } from "../use-cases/table-fetch";
import { ShopsTable, ShopsActionBar } from "../containers";

export const ShopsPage: FC = () => {
  return (
    <PageContent $contain={true}>
      <NextTableProvider context={ShopsTableContext} onFetch={shopsTableFetchUseCase} name="shops-table">
        <ShopsActionBar />
        <ShopsTable />
      </NextTableProvider>
    </PageContent>
  );
};
