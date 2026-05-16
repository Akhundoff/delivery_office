import { FC } from "react";
import { NextTableProvider } from "@shared/modules/next-table/context/provider";
import { PageContent } from "@shared/styled/page-content";
import { PopupsTableContext } from "../context";
import { popupsTableFetchUseCase } from "../use-cases/table-fetch";
import { PopupsTable, PopupsActionBar } from "../containers";

export const PopupsPage: FC = () => {
  return (
    <PageContent $contain={true}>
      <NextTableProvider context={PopupsTableContext} onFetch={popupsTableFetchUseCase} name="popups-table">
        <PopupsActionBar />
        <PopupsTable />
      </NextTableProvider>
    </PageContent>
  );
};
