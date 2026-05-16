import { FC } from "react";
import { NextTableProvider } from "@shared/modules/next-table/context/provider";
import { PageContent } from "@shared/styled/page-content";
import { BranchesTableContext } from "../context";
import { useBranchesTable } from "../hooks";
import { BranchesTable, BranchesActionBar } from "../containers";

export const BranchesPage: FC = () => {
  const { onFetch } = useBranchesTable();

  return (
    <PageContent $contain={true}>
      <NextTableProvider context={BranchesTableContext} onFetch={onFetch} name="branches-table">
        <BranchesActionBar />
        <BranchesTable />
      </NextTableProvider>
    </PageContent>
  );
};
