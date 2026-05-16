import { FC } from "react";
import { NextTableProvider } from "@shared/modules/next-table/context/provider";
import { PageContent } from "@shared/styled/page-content";
import { BoxesTableContext } from "../context";
import { boxesTableFetchUseCase } from "../use-cases/table-fetch";
import { BoxesTable, BoxesActionBar } from "../containers";

export const BoxesPage: FC = () => {
  return (
    <PageContent $contain={true}>
      <NextTableProvider context={BoxesTableContext} onFetch={boxesTableFetchUseCase} name="boxes-table">
        <BoxesActionBar />
        <BoxesTable />
      </NextTableProvider>
    </PageContent>
  );
};
