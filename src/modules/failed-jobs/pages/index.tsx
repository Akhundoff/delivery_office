import { FC } from "react";
import { NextTableProvider } from "@shared/modules/next-table/context/provider";
import { PageContent } from "@shared/styled/page-content";
import { FailedJobsTableContext } from "../context";
import { failedJobsTableFetchUseCase } from "../use-cases/table-fetch";
import { FailedJobsTable, FailedJobsActionBar } from "../containers";

export const FailedJobsPage: FC = () => {
  return (
    <PageContent $contain={true}>
      <NextTableProvider context={FailedJobsTableContext} onFetch={failedJobsTableFetchUseCase} name="failed-jobs-table">
        <FailedJobsActionBar />
        <FailedJobsTable />
      </NextTableProvider>
    </PageContent>
  );
};
