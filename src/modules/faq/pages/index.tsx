import { FC } from "react";
import { NextTableProvider } from "@shared/modules/next-table/context/provider";
import { PageContent } from "@shared/styled/page-content";
import { FaqTableContext } from "../context";
import { useFaqTable } from "../hooks";
import { FaqTable, FaqActionBar } from "../containers";

export const FaqPage: FC = () => {
  const { onFetch } = useFaqTable();

  return (
    <PageContent $contain={true}>
      <NextTableProvider context={FaqTableContext} onFetch={onFetch} name="faq-table">
        <FaqActionBar />
        <FaqTable />
      </NextTableProvider>
    </PageContent>
  );
};
