import { FC } from "react";
import { NextTableProvider } from "@shared/modules/next-table/context/provider";
import { PageContent } from "@shared/styled/page-content";
import { BannersTableContext } from "../context";
import { useBannersTable } from "../hooks";
import { BannersTable, BannersActionBar } from "../containers";

export const BannersPage: FC = () => {
  const { onFetch } = useBannersTable();

  return (
    <PageContent $contain={true}>
      <NextTableProvider context={BannersTableContext} onFetch={onFetch} name="banners-table">
        <BannersActionBar />
        <BannersTable />
      </NextTableProvider>
    </PageContent>
  );
};
