import { FC } from "react";
import { NextTableProvider } from "@shared/modules/next-table/context/provider";
import { PageContent } from "@shared/styled/page-content";
import { RefundsTableContext } from "../context";
import { useRefundsTable } from "../hooks";
import { RefundsTable, RefundsActionBar } from "../containers";

export const RefundsPage: FC = () => {
  const { onFetch } = useRefundsTable();

  return (
    <PageContent $contain={true}>
      <NextTableProvider context={RefundsTableContext} onFetch={onFetch} name="refunds-table">
        <RefundsActionBar />
        <RefundsTable />
      </NextTableProvider>
    </PageContent>
  );
};
