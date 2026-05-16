import { FC } from "react";
import { NextTableProvider } from "@shared/modules/next-table/context/provider";
import { PageContent } from "@shared/styled/page-content";
import { UnitedQueuesTableContext } from "../context";
import { unitedQueuesTableFetchUseCase } from "../use-cases/table-fetch";
import { UnitedQueuesTable, UnitedQueuesActionBar } from "../containers";

export const UnitedQueuesPage: FC = () => {
  return (
    <PageContent $contain={true}>
      <NextTableProvider context={UnitedQueuesTableContext} onFetch={unitedQueuesTableFetchUseCase} name="united-queues-table">
        <UnitedQueuesActionBar />
        <UnitedQueuesTable />
      </NextTableProvider>
    </PageContent>
  );
};
