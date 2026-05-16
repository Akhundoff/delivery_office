import { FC } from "react";
import { NextTableProvider } from "@shared/modules/next-table/context/provider";
import { PageContent } from "@shared/styled/page-content";
import { CargoesTableContext } from "../context";
import { cargoesTableFetchUseCase } from "../use-cases/table-fetch";
import { CargoesTable, CargoesActionBar } from "../containers";

export const CargoesPage: FC = () => {
  return (
    <PageContent $contain={true}>
      <NextTableProvider context={CargoesTableContext} onFetch={cargoesTableFetchUseCase} name="cargoes-table">
        <CargoesActionBar />
        <CargoesTable />
      </NextTableProvider>
    </PageContent>
  );
};
