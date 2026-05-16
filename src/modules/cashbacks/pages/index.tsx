import { FC } from "react";
import { NextTableProvider } from "@shared/modules/next-table/context/provider";
import { PageContent } from "@shared/styled/page-content";
import { CashbacksTableContext } from "../context";
import { cashbacksTableFetchUseCase } from "../use-cases/table-fetch";
import { CashbacksTable, CashbacksActionBar } from "../containers";

export const CashbacksPage: FC = () => {
  return (
    <PageContent $contain={true}>
      <NextTableProvider context={CashbacksTableContext} onFetch={cashbacksTableFetchUseCase} name="cashbacks-table">
        <CashbacksActionBar />
        <CashbacksTable />
      </NextTableProvider>
    </PageContent>
  );
};
