import { FC } from "react";
import { NextTableProvider } from "@shared/modules/next-table/context/provider";
import { PageContent } from "@shared/styled/page-content";
import { PlansTableContext } from "../context";
import { plansTableFetchUseCase } from "../use-cases/table-fetch";
import { PlansTable, PlansActionBar } from "../containers";

export const PlansPage: FC = () => {
  return (
    <PageContent $contain={true}>
      <NextTableProvider context={PlansTableContext} onFetch={plansTableFetchUseCase} name="plans-table">
        <PlansActionBar />
        <PlansTable />
      </NextTableProvider>
    </PageContent>
  );
};
