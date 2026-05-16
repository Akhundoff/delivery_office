import { FC } from "react";
import { NextTableProvider } from "@shared/modules/next-table/context/provider";
import { PageContent } from "@shared/styled/page-content";
import { BranchPartnersTableContext } from "../context";
import { branchPartnersTableFetchUseCase } from "../use-cases/table-fetch";
import { BranchPartnersTable, BranchPartnersActionBar } from "../containers";

export const BranchPartnersPage: FC = () => {
  return (
    <PageContent $contain={true}>
      <NextTableProvider
        context={BranchPartnersTableContext}
        onFetch={branchPartnersTableFetchUseCase}
        name="branch-partners-table"
      >
        <BranchPartnersActionBar />
        <BranchPartnersTable />
      </NextTableProvider>
    </PageContent>
  );
};
