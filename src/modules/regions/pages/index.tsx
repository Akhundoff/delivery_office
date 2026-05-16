import { FC } from "react";
import { NextTableProvider } from "@shared/modules/next-table/context/provider";
import { PageContent } from "@shared/styled/page-content";
import { RegionsTableContext } from "../context";
import { regionsTableFetchUseCase } from "../use-cases/table-fetch";
import { RegionsTable, RegionsActionBar } from "../containers";

export const RegionsPage: FC = () => {
  return (
    <PageContent $contain={true}>
      <NextTableProvider
        context={RegionsTableContext}
        onFetch={regionsTableFetchUseCase}
        name="regions-table"
      >
        <RegionsActionBar />
        <RegionsTable />
      </NextTableProvider>
    </PageContent>
  );
};
