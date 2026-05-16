import { FC } from "react";
import { NextTableProvider } from "@shared/modules/next-table/context/provider";
import { PageContent } from "@shared/styled/page-content";
import { DeliveryProofsTableContext } from "../context";
import { deliveryProofsTableFetchUseCase } from "../use-cases/table-fetch";
import { DeliveryProofsTable, DeliveryProofsActionBar } from "../containers";

export const DeliveryProofsPage: FC = () => {
  return (
    <PageContent $contain={true}>
      <NextTableProvider context={DeliveryProofsTableContext} onFetch={deliveryProofsTableFetchUseCase} name="delivery-proofs-table">
        <DeliveryProofsActionBar />
        <DeliveryProofsTable />
      </NextTableProvider>
    </PageContent>
  );
};
