import { FC } from "react";
import { NextTableProvider } from "@shared/modules/next-table/context/provider";
import { PageContent } from "@shared/styled/page-content";
import { StatusesTableContext } from "../context";
import { useStatusesTable } from "../hooks";
import { StatusesTable, StatusesActionBar } from "../containers";

export const StatusesPage: FC = () => {
  const { onFetch } = useStatusesTable();

  return (
    <PageContent $contain={true}>
      <NextTableProvider context={StatusesTableContext} onFetch={onFetch} name="statuses-table">
        <StatusesActionBar />
        <StatusesTable />
      </NextTableProvider>
    </PageContent>
  );
};
