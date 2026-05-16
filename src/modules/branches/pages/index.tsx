import { FC } from "react";
import { NextTableProvider } from "@shared/modules/next-table/context/provider";
import { PageContent } from "@shared/styled/page-content";
import { BranchesTableContext } from "../context";
import { branchesTableFetchUseCase } from "../use-cases/table-fetch";
import { BranchesTable, BranchesActionBar } from "../containers";

export const BranchesPage: FC = () => {
  return (
    <PageContent $contain={true}>
      <NextTableProvider context={BranchesTableContext} onFetch={branchesTableFetchUseCase} name="branches-table">
        <BranchesActionBar />
        <BranchesTable />
      </NextTableProvider>
    </PageContent>
  );
};
