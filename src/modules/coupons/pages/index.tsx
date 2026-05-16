import { FC } from "react";
import { NextTableProvider } from "@shared/modules/next-table/context/provider";
import { PageContent } from "@shared/styled/page-content";
import { CouponsTableContext } from "../context";
import { useCouponsTable } from "../hooks";
import { CouponsTable, CouponsActionBar } from "../containers";

export const CouponsPage: FC = () => {
  const { onFetch } = useCouponsTable();

  return (
    <PageContent $contain={true}>
      <NextTableProvider context={CouponsTableContext} onFetch={onFetch} name="coupons-table">
        <CouponsActionBar />
        <CouponsTable />
      </NextTableProvider>
    </PageContent>
  );
};
