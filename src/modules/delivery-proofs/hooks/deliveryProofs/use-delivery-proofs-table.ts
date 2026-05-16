import { useDeliveryProofsTableColumns } from "./use-delivery-proofs-table-columns";

export const useDeliveryProofsTable = () => {
  const columns = useDeliveryProofsTableColumns();
  return { columns };
};
