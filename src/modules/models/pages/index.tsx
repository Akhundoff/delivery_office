import { FC } from "react";
import { NextTableProvider } from "@shared/modules/next-table/context/provider";
import { PageContent } from "@shared/styled/page-content";
import { ModelsTableContext } from "../context";
import { modelsTableFetchUseCase } from "../use-cases/table-fetch";
import { ModelsTable, ModelsActionBar } from "../containers";

export const ModelsPage: FC = () => {
  return (
    <PageContent $contain={true}>
      <NextTableProvider context={ModelsTableContext} onFetch={modelsTableFetchUseCase} name="models-table">
        <ModelsActionBar />
        <ModelsTable />
      </NextTableProvider>
    </PageContent>
  );
};
