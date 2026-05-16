import { FC } from "react";
import { NextTableProvider } from "@shared/modules/next-table/context/provider";
import { PageContent } from "@shared/styled/page-content";
import { ProductTypesTableContext } from "../context";
import { useProductTypesTable } from "../hooks";
import { ProductTypesTable, ProductTypesActionBar } from "../containers";

export const ProductTypesPage: FC = () => {
  const { onFetch } = useProductTypesTable();

  return (
    <PageContent $contain={true}>
      <NextTableProvider
        context={ProductTypesTableContext}
        onFetch={onFetch}
        name="product-types-table"
      >
        <ProductTypesActionBar />
        <ProductTypesTable />
      </NextTableProvider>
    </PageContent>
  );
};
