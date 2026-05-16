import { useMemo } from "react";
import { Column } from "react-table";
import { Tag } from "antd";
import { nextTableColumns } from "@shared/modules/next-table/helpers/next-table-columns";
import { ICashback } from "../../interfaces";

export const useCashbacksTableColumns = (): Column<ICashback>[] => {
  return useMemo<Column<ICashback>[]>(
    () => [
      { ...nextTableColumns.small, Header: "Kod", id: "id", accessor: (r) => r.id },
      { accessor: (r) => r.client.name, id: "user_name", Header: "İstifadəçi" },
      { accessor: (r) => r.amount, id: "cashback", Header: "Məbləğ" },
      { accessor: (r) => r.count, id: "cashback_count", Header: "Say" },
      {
        accessor: (r) => r.status?.name,
        id: "state_name",
        Header: "Status",
        Cell: ({ value }: any) => value ? <Tag color="blue">{value}</Tag> : null,
      },
    ],
    [],
  );
};
