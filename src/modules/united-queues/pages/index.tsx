import { FC } from "react";
import { NextTableProvider } from "@shared/modules/next-table/context/provider";
import { PageContent } from "@shared/styled/page-content";
import { UnitedQueuesTableContext } from "../context";
import { useUnitedQueuesTable } from "../hooks";
import { UnitedQueuesTable, UnitedQueuesActionBar } from "../containers";

export const UnitedQueuesPage: FC = () => {
  const { onFetch } = useUnitedQueuesTable();

  return (
    <PageContent $contain={true}>
      <NextTableProvider context={UnitedQueuesTableContext} onFetch={onFetch} name="united-queues-table">
        <UnitedQueuesActionBar />
        <UnitedQueuesTable />
      </NextTableProvider>
    </PageContent>
  );
};
