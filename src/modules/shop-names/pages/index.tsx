import { FC } from "react";
import { NextTableProvider } from "@shared/modules/next-table/context/provider";
import { PageContent } from "@shared/styled/page-content";
import { ShopNamesTableContext } from "../context";
import { useShopNamesTable } from "../hooks";
import { ShopNamesTable, ShopNamesActionBar } from "../containers";

export const ShopNamesPage: FC = () => {
  const { onFetch } = useShopNamesTable();
  return (
    <PageContent $contain={true}>
      <NextTableProvider context={ShopNamesTableContext} onFetch={onFetch} name="shop-names-table">
        <ShopNamesActionBar />
        <ShopNamesTable />
      </NextTableProvider>
    </PageContent>
  );
};
