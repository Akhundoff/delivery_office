import { FC } from "react";
import { NextTableProvider } from "@shared/modules/next-table/context/provider";
import { PageContent } from "@shared/styled/page-content";
import { FaqTableContext } from "../context";
import { faqTableFetchUseCase } from "../use-cases/table-fetch";
import { FaqTable, FaqActionBar } from "../containers";

export const FaqPage: FC = () => {
  return (
    <PageContent $contain={true}>
      <NextTableProvider context={FaqTableContext} onFetch={faqTableFetchUseCase} name="faq-table">
        <FaqActionBar />
        <FaqTable />
      </NextTableProvider>
    </PageContent>
  );
};
