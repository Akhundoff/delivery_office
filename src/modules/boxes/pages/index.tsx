import { FC } from "react";
import { NextTableProvider } from "@shared/modules/next-table/context/provider";
import { PageContent } from "@shared/styled/page-content";
import { BoxesTableContext } from "../context";
import { useBoxesTable } from "../hooks";
import { BoxesTable, BoxesActionBar } from "../containers";

export const BoxesPage: FC = () => {
  const { onFetch } = useBoxesTable();
  return (
    <PageContent $contain={true}>
      <NextTableProvider context={BoxesTableContext} onFetch={onFetch} name="boxes-table">
        <BoxesActionBar />
        <BoxesTable />
      </NextTableProvider>
    </PageContent>
  );
};
