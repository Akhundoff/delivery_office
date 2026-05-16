import { FC } from "react";
import { NextTableProvider } from "@shared/modules/next-table/context/provider";
import { PageContent } from "@shared/styled/page-content";
import { ReturnTypesTableContext } from "../context";
import { returnTypesTableFetchUseCase } from "../use-cases/table-fetch";
import { ReturnTypesTable, ReturnTypesActionBar } from "../containers";

export const ReturnTypesPage: FC = () => {
  return (
    <PageContent $contain={true}>
      <NextTableProvider
        context={ReturnTypesTableContext}
        onFetch={returnTypesTableFetchUseCase}
        name="return-types-table"
      >
        <ReturnTypesActionBar />
        <ReturnTypesTable />
      </NextTableProvider>
    </PageContent>
  );
};
