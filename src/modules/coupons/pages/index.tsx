import { FC } from "react";
import { NextTableProvider } from "@shared/modules/next-table/context/provider";
import { PageContent } from "@shared/styled/page-content";
import { CouponsTableContext } from "../context";
import { couponsTableFetchUseCase } from "../use-cases/table-fetch";
import { CouponsTable, CouponsActionBar } from "../containers";

export const CouponsPage: FC = () => {
  return (
    <PageContent $contain={true}>
      <NextTableProvider context={CouponsTableContext} onFetch={couponsTableFetchUseCase} name="coupons-table">
        <CouponsActionBar />
        <CouponsTable />
      </NextTableProvider>
    </PageContent>
  );
};
