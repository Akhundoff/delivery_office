import { FC } from "react";
import { NextTableProvider } from "@shared/modules/next-table/context/provider";
import { PageContent } from "@shared/styled/page-content";
import { ModelsTableContext } from "../context";
import { useModelsTable } from "../hooks";
import { ModelsTable, ModelsActionBar } from "../containers";

export const ModelsPage: FC = () => {
  const { onFetch } = useModelsTable();
  return (
    <PageContent $contain={true}>
      <NextTableProvider context={ModelsTableContext} onFetch={onFetch} name="models-table">
        <ModelsActionBar />
        <ModelsTable />
      </NextTableProvider>
    </PageContent>
  );
};
