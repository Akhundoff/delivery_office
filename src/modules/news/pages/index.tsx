import { FC } from "react";
import { NextTableProvider } from "@shared/modules/next-table/context/provider";
import { PageContent } from "@shared/styled/page-content";
import { NewsTableContext } from "../context";
import { newsTableFetchUseCase } from "../use-cases/table-fetch";
import { NewsTable, NewsActionBar } from "../containers";

export const NewsPage: FC = () => {
  return (
    <PageContent $contain={true}>
      <NextTableProvider context={NewsTableContext} onFetch={newsTableFetchUseCase} name="news-table">
        <NewsActionBar />
        <NewsTable />
      </NextTableProvider>
    </PageContent>
  );
};
