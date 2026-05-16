import { FC } from "react";
import { NextTableProvider } from "@shared/modules/next-table/context/provider";
import { PageContent } from "@shared/styled/page-content";
import { PopupsTableContext } from "../context";
import { usePopupsTable } from "../hooks";
import { PopupsTable, PopupsActionBar } from "../containers";

export const PopupsPage: FC = () => {
  const { onFetch } = usePopupsTable();

  return (
    <PageContent $contain={true}>
      <NextTableProvider context={PopupsTableContext} onFetch={onFetch} name="popups-table">
        <PopupsActionBar />
        <PopupsTable />
      </NextTableProvider>
    </PageContent>
  );
};
