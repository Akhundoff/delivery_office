import { FC } from "react";
import { NextTableProvider } from "@shared/modules/next-table/context/provider";
import { PageContent } from "@shared/styled/page-content";
import { BannersTableContext } from "../context";
import { bannersTableFetchUseCase } from "../use-cases/table-fetch";
import { BannersTable, BannersActionBar } from "../containers";

export const BannersPage: FC = () => {
  return (
    <PageContent $contain={true}>
      <NextTableProvider context={BannersTableContext} onFetch={bannersTableFetchUseCase} name="banners-table">
        <BannersActionBar />
        <BannersTable />
      </NextTableProvider>
    </PageContent>
  );
};
