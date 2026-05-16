import { FC } from "react";
import { NextTableProvider } from "@shared/modules/next-table/context/provider";
import { PageContent } from "@shared/styled/page-content";
import { AzerpostQueuesTableContext } from "../context";
import { useAzerpostQueuesTable } from "../hooks";
import { AzerpostQueuesTable, AzerpostQueuesActionBar } from "../containers";

export const AzerpostQueuesPage: FC = () => {
  const { onFetch } = useAzerpostQueuesTable();

  return (
    <PageContent $contain={true}>
      <NextTableProvider context={AzerpostQueuesTableContext} onFetch={onFetch} name="azerpost-queues-table">
        <AzerpostQueuesActionBar />
        <AzerpostQueuesTable />
      </NextTableProvider>
    </PageContent>
  );
};
