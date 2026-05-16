import { useCouponsTableColumns } from "./use-coupons-table-columns";

export const useCouponsTable = () => {
  const columns = useCouponsTableColumns();
  return { columns };
};
