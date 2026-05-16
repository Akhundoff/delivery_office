import { FC } from "react";
import { NextTableProvider } from "@shared/modules/next-table/context/provider";
import { PageContent } from "@shared/styled/page-content";
import { AzerpostQueuesTableContext } from "../context";
import { azerpostQueuesTableFetchUseCase } from "../use-cases/table-fetch";
import { AzerpostQueuesTable, AzerpostQueuesActionBar } from "../containers";

export const AzerpostQueuesPage: FC = () => {
  return (
    <PageContent $contain={true}>
      <NextTableProvider context={AzerpostQueuesTableContext} onFetch={azerpostQueuesTableFetchUseCase} name="azerpost-queues-table">
        <AzerpostQueuesActionBar />
        <AzerpostQueuesTable />
      </NextTableProvider>
    </PageContent>
  );
};
