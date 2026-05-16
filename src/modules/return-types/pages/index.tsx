import { FC } from "react";
import { NextTableProvider } from "@shared/modules/next-table/context/provider";
import { PageContent } from "@shared/styled/page-content";
import { ReturnTypesTableContext } from "../context";
import { useReturnTypesTable } from "../hooks";
import { ReturnTypesTable, ReturnTypesActionBar } from "../containers";

export const ReturnTypesPage: FC = () => {
  const { onFetch } = useReturnTypesTable();

  return (
    <PageContent $contain={true}>
      <NextTableProvider
        context={ReturnTypesTableContext}
        onFetch={onFetch}
        name="return-types-table"
      >
        <ReturnTypesActionBar />
        <ReturnTypesTable />
      </NextTableProvider>
    </PageContent>
  );
};
