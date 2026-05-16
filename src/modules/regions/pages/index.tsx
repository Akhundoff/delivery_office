import { FC } from "react";
import { NextTableProvider } from "@shared/modules/next-table/context/provider";
import { PageContent } from "@shared/styled/page-content";
import { RegionsTableContext } from "../context";
import { useRegionsTable } from "../hooks";
import { RegionsTable, RegionsActionBar } from "../containers";

export const RegionsPage: FC = () => {
  const { onFetch } = useRegionsTable();

  return (
    <PageContent $contain={true}>
      <NextTableProvider
        context={RegionsTableContext}
        onFetch={onFetch}
        name="regions-table"
      >
        <RegionsActionBar />
        <RegionsTable />
      </NextTableProvider>
    </PageContent>
  );
};
