import { FC } from "react";
import { NextTableProvider } from "@shared/modules/next-table/context/provider";
import { PageContent } from "@shared/styled/page-content";
import { LogsTableContext } from "../context";
import { useLogsTable } from "../hooks";
import { LogsTable, LogsActionBar } from "../containers";

export const LogsPage: FC = () => {
  const { onFetch } = useLogsTable();

  return (
    <PageContent $contain={true}>
      <NextTableProvider context={LogsTableContext} onFetch={onFetch} name="logs-table">
        <LogsActionBar />
        <LogsTable />
      </NextTableProvider>
    </PageContent>
  );
};
