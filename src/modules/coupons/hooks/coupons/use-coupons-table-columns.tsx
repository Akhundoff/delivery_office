import { useMemo } from "react";
import { Column } from "react-table";
import { Tag } from "antd";
import { nextTableColumns } from "@shared/modules/next-table/helpers/next-table-columns";
import { ICoupon } from "../../interfaces";

export const useCouponsTableColumns = (): Column<ICoupon>[] => {
  return useMemo<Column<ICoupon>[]>(
    () => [
      { ...nextTableColumns.small, Header: "Kod", id: "id", accessor: (r) => r.id },
      { accessor: (r) => r.name, id: "name", Header: "Ad" },
      { accessor: (r) => r.tag, id: "tag", Header: "Teq" },
      { accessor: (r) => `${r.amount} ${r.currency}`, id: "amount", Header: "Məbləğ" },
      { accessor: (r) => r.count, id: "count", Header: "Limit" },
      { accessor: (r) => r.country?.name, id: "country_name", Header: "Ölkə" },
      {
        accessor: (r) => r.state?.name,
        id: "state_name",
        Header: "Status",
        Cell: ({ value }: any) => value ? <Tag color="blue">{value}</Tag> : null,
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
