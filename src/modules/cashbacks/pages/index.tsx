import { FC } from "react";
import { NextTableProvider } from "@shared/modules/next-table/context/provider";
import { PageContent } from "@shared/styled/page-content";
import { CashbacksTableContext } from "../context";
import { useCashbacksTable } from "../hooks";
import { CashbacksTable, CashbacksActionBar } from "../containers";

export const CashbacksPage: FC = () => {
  const { onFetch } = useCashbacksTable();

  return (
    <PageContent $contain={true}>
      <NextTableProvider context={CashbacksTableContext} onFetch={onFetch} name="cashbacks-table">
        <CashbacksActionBar />
        <CashbacksTable />
      </NextTableProvider>
    </PageContent>
  );
};
