import { FC } from "react";
import { NextTableProvider } from "@shared/modules/next-table/context/provider";
import { PageContent } from "@shared/styled/page-content";
import { NewsTableContext } from "../context";
import { useNewsTable } from "../hooks";
import { NewsTable, NewsActionBar } from "../containers";

export const NewsPage: FC = () => {
  const { onFetch } = useNewsTable();

  return (
    <PageContent $contain={true}>
      <NextTableProvider context={NewsTableContext} onFetch={onFetch} name="news-table">
        <NewsActionBar />
        <NewsTable />
      </NextTableProvider>
    </PageContent>
  );
};
