import { FC } from "react";
import { NextTableProvider } from "@shared/modules/next-table/context/provider";
import { PageContent } from "@shared/styled/page-content";
import { RefundsTableContext } from "../context";
import { refundsTableFetchUseCase } from "../use-cases/table-fetch";
import { RefundsTable, RefundsActionBar } from "../containers";

export const RefundsPage: FC = () => {
  return (
    <PageContent $contain={true}>
      <NextTableProvider context={RefundsTableContext} onFetch={refundsTableFetchUseCase} name="refunds-table">
        <RefundsActionBar />
        <RefundsTable />
      </NextTableProvider>
    </PageContent>
  );
};
