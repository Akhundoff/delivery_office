import { FC } from "react";
import { NextTableProvider } from "@shared/modules/next-table/context/provider";
import { PageContent } from "@shared/styled/page-content";
import { ProductTypesTableContext } from "../context";
import { productTypesTableFetchUseCase } from "../use-cases/table-fetch";
import { ProductTypesTable, ProductTypesActionBar } from "../containers";

export const ProductTypesPage: FC = () => {
  return (
    <PageContent $contain={true}>
      <NextTableProvider
        context={ProductTypesTableContext}
        onFetch={productTypesTableFetchUseCase}
        name="product-types-table"
      >
        <ProductTypesActionBar />
        <ProductTypesTable />
      </NextTableProvider>
    </PageContent>
  );
};
