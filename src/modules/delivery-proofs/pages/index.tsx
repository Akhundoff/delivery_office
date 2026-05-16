import { FC } from "react";
import { NextTableProvider } from "@shared/modules/next-table/context/provider";
import { PageContent } from "@shared/styled/page-content";
import { DeliveryProofsTableContext } from "../context";
import { useDeliveryProofsTable } from "../hooks";
import { DeliveryProofsTable, DeliveryProofsActionBar } from "../containers";

export const DeliveryProofsPage: FC = () => {
  const { onFetch } = useDeliveryProofsTable();

  return (
    <PageContent $contain={true}>
      <NextTableProvider context={DeliveryProofsTableContext} onFetch={onFetch} name="delivery-proofs-table">
        <DeliveryProofsActionBar />
        <DeliveryProofsTable />
      </NextTableProvider>
    </PageContent>
  );
};
