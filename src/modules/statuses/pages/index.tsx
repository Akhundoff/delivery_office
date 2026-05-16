import { FC } from "react";
import { NextTableProvider } from "@shared/modules/next-table/context/provider";
import { PageContent } from "@shared/styled/page-content";
import { StatusesTableContext } from "../context";
import { statusesTableFetchUseCase } from "../use-cases/table-fetch";
import { StatusesTable, StatusesActionBar } from "../containers";

export const StatusesPage: FC = () => {
  return (
    <PageContent $contain={true}>
      <NextTableProvider context={StatusesTableContext} onFetch={statusesTableFetchUseCase} name="statuses-table">
        <StatusesActionBar />
        <StatusesTable />
      </NextTableProvider>
    </PageContent>
  );
};
