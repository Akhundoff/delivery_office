import { useMemo } from "react";
import { Column } from "react-table";
import { Tag } from "antd";
import { nextTableColumns } from "@shared/modules/next-table/helpers/next-table-columns";
import { IRefund } from "../../interfaces";

export const useRefundsTableColumns = (): Column<IRefund>[] => {
  return useMemo<Column<IRefund>[]>(
    () => [
      { ...nextTableColumns.small, Header: "Kod", id: "id", accessor: (r) => r.id },
      { accessor: (r) => r.trackCode, id: "track_code", Header: "İzləmə kodu" },
      { accessor: (r) => r.refundNumber, id: "return_number", Header: "İadə №" },
      { accessor: (r) => r.user?.name, id: "user_name", Header: "İstifadəçi" },
      { accessor: (r) => r.shopName, id: "shop_name", Header: "Mağaza" },
      { accessor: (r) => r.productType?.name, id: "product_type", Header: "Məhsul tipi" },
      {
        accessor: (r) => r.state?.name,
        id: "state_name",
        Header: "Status",
        Cell: ({ value }: any) => value ? <Tag color="orange">{value}</Tag> : null,
      },
      {
        ...nextTableColumns.date,
        accessor: (r) => r.createdAt,
        id: "created_at",
        Header: "Tarix",
      },
    ],
    [],
  );
};
