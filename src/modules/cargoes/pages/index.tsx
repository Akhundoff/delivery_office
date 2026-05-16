import { FC } from "react";
import { NextTableProvider } from "@shared/modules/next-table/context/provider";
import { PageContent } from "@shared/styled/page-content";
import { CargoesTableContext } from "../context";
import { useCargoesTable } from "../hooks";
import { CargoesTable, CargoesActionBar } from "../containers";

export const CargoesPage: FC = () => {
  const { onFetch } = useCargoesTable();
  return (
    <PageContent $contain={true}>
      <NextTableProvider context={CargoesTableContext} onFetch={onFetch} name="cargoes-table">
        <CargoesActionBar />
        <CargoesTable />
      </NextTableProvider>
    </PageContent>
  );
};
