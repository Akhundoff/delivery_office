import { FC } from "react";
import { NextTableProvider } from "@shared/modules/next-table/context/provider";
import { PageContent } from "@shared/styled/page-content";
import { LogsTableContext } from "../context";
import { logsTableFetchUseCase } from "../use-cases/table-fetch";
import { LogsTable, LogsActionBar } from "../containers";

export const LogsPage: FC = () => {
  return (
    <PageContent $contain={true}>
      <NextTableProvider context={LogsTableContext} onFetch={logsTableFetchUseCase} name="logs-table">
        <LogsActionBar />
        <LogsTable />
      </NextTableProvider>
    </PageContent>
  );
};
