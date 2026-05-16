import { useMemo } from "react";
import { Column } from "react-table";
import { Tag } from "antd";
import { nextTableColumns } from "@shared/modules/next-table/helpers/next-table-columns";
import { IStatus } from "../../interfaces";

export const useStatusesTableColumns = (): Column<IStatus>[] => {
  return useMemo<Column<IStatus>[]>(
    () => [
      { ...nextTableColumns.small, Header: "Kod", id: "id", accessor: (r) => r.id },
      { accessor: (r) => r.name, id: "name", Header: "Ad" },
      { accessor: (r) => r.nameEn, id: "name_en", Header: "Ad (EN)" },
      { accessor: (r) => r.model?.name, id: "model_name", Header: "Model" },
      {
        accessor: (r) => r.freely,
        id: "freely",
        Header: "Sərbəst",
        Cell: ({ value }: any) => value ? <Tag color="green">Bəli</Tag> : <Tag>Xeyr</Tag>,
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
