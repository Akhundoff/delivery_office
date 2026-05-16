import { FC } from "react";
import { NextTableProvider } from "@shared/modules/next-table/context/provider";
import { PageContent } from "@shared/styled/page-content";
import { PlansTableContext } from "../context";
import { usePlansTable } from "../hooks";
import { PlansTable, PlansActionBar } from "../containers";

export const PlansPage: FC = () => {
  const { onFetch } = usePlansTable();
  return (
    <PageContent $contain={true}>
      <NextTableProvider context={PlansTableContext} onFetch={onFetch} name="plans-table">
        <PlansActionBar />
        <PlansTable />
      </NextTableProvider>
    </PageContent>
  );
};
