import { useMemo } from "react";
import { Column } from "react-table";
import { nextTableColumns } from "@shared/modules/next-table/helpers/next-table-columns";
import { IArchiveStatus } from "../../interfaces";

export const useArchiveStatusTableColumns = (): Column<IArchiveStatus>[] => {
  return useMemo<Column<IArchiveStatus>[]>(
    () => [
      { ...nextTableColumns.small, Header: "Kod", id: "id", accessor: (r) => r.id },
      { accessor: (r) => r.user?.name, id: "user_name", Header: "İstifadəçi" },
      { accessor: (r) => r.model?.name, id: "model_name", Header: "Model" },
      { accessor: (r) => r.objectId, id: "object_id", Header: "Obyekt ID" },
      { accessor: (r) => r.state?.name, id: "state_name", Header: "Status" },
      { ...nextTableColumns.date, accessor: (r) => r.createdAt, id: "created_at", Header: "Tarix" },
    ],
    [],
  );
};
