import { FC } from "react";
import { NextTableProvider } from "@shared/modules/next-table/context/provider";
import { PageContent } from "@shared/styled/page-content";
import { ShopsTableContext } from "../context";
import { useShopsTable } from "../hooks";
import { ShopsTable, ShopsActionBar } from "../containers";

export const ShopsPage: FC = () => {
  const { onFetch } = useShopsTable();

  return (
    <PageContent $contain={true}>
      <NextTableProvider context={ShopsTableContext} onFetch={onFetch} name="shops-table">
        <ShopsActionBar />
        <ShopsTable />
      </NextTableProvider>
    </PageContent>
  );
};
