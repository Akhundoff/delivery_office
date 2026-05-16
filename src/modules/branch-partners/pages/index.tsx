import { FC } from "react";
import { NextTableProvider } from "@shared/modules/next-table/context/provider";
import { PageContent } from "@shared/styled/page-content";
import { BranchPartnersTableContext } from "../context";
import { useBranchPartnersTable } from "../hooks";
import { BranchPartnersTable, BranchPartnersActionBar } from "../containers";

export const BranchPartnersPage: FC = () => {
  const { onFetch } = useBranchPartnersTable();

  return (
    <PageContent $contain={true}>
      <NextTableProvider
        context={BranchPartnersTableContext}
        onFetch={onFetch}
        name="branch-partners-table"
      >
        <BranchPartnersActionBar />
        <BranchPartnersTable />
      </NextTableProvider>
    </PageContent>
  );
};
