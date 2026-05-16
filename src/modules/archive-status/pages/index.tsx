import { FC } from "react";
import { NextTableProvider } from "@shared/modules/next-table/context/provider";
import { PageContent } from "@shared/styled/page-content";
import { ArchiveStatusTableContext } from "../context";
import { archiveStatusTableFetchUseCase } from "../use-cases/table-fetch";
import { ArchiveStatusTable, ArchiveStatusActionBar } from "../containers";

export const ArchiveStatusPage: FC = () => {
  return (
    <PageContent $contain={true}>
      <NextTableProvider context={ArchiveStatusTableContext} onFetch={archiveStatusTableFetchUseCase} name="archive-status-table">
        <ArchiveStatusActionBar />
        <ArchiveStatusTable />
      </NextTableProvider>
    </PageContent>
  );
};
