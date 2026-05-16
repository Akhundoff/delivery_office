import { FC } from "react";
import { NextTableProvider } from "@shared/modules/next-table/context/provider";
import { PageContent } from "@shared/styled/page-content";
import { ShopNamesTableContext } from "../context";
import { shopNamesTableFetchUseCase } from "../use-cases/table-fetch";
import { ShopNamesTable, ShopNamesActionBar } from "../containers";

export const ShopNamesPage: FC = () => {
  return (
    <PageContent $contain={true}>
      <NextTableProvider context={ShopNamesTableContext} onFetch={shopNamesTableFetchUseCase} name="shop-names-table">
        <ShopNamesActionBar />
        <ShopNamesTable />
      </NextTableProvider>
    </PageContent>
  );
};
