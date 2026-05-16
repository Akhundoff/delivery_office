import { FC } from "react";
import { NextTableProvider } from "@shared/modules/next-table/context/provider";
import { PageContent } from "@shared/styled/page-content";
import { ArchiveStatusTableContext } from "../context";
import { useArchiveStatusTable } from "../hooks";
import { ArchiveStatusTable, ArchiveStatusActionBar } from "../containers";

export const ArchiveStatusPage: FC = () => {
  const { onFetch } = useArchiveStatusTable();

  return (
    <PageContent $contain={true}>
      <NextTableProvider context={ArchiveStatusTableContext} onFetch={onFetch} name="archive-status-table">
        <ArchiveStatusActionBar />
        <ArchiveStatusTable />
      </NextTableProvider>
    </PageContent>
  );
};
