import { useMemo } from "react";
import { Column } from "react-table";
import { nextTableColumns } from "@shared/modules/next-table/helpers/next-table-columns";
import { useBackgroundNavigate } from "@shared/hooks";
import { ILog } from "../../interfaces";

export const useLogsTableColumns = (): Column<ILog>[] => {
  const navigate = useBackgroundNavigate();

  return useMemo<Column<ILog>[]>(
    () => [
      { ...nextTableColumns.small, Header: "Kod", id: "id", accessor: (r) => r.id },
      {
        accessor: (r) => r.title,
        id: "title",
        Header: "Əməliyyat",
        Cell: ({ row, value }: any) => (
          <span
            style={{ color: "#1677ff", cursor: "pointer" }}
            onClick={() => navigate(`/logs/${row.original.id}/detail`, { withBackground: true })}
          >
            {value}
          </span>
        ),
      },
      { accessor: (r) => r.action, id: "action", Header: "Fəaliyyət" },
      { accessor: (r) => r.modelName, id: "model_name", Header: "Model" },
      { accessor: (r) => r.userName, id: "user_name", Header: "İstifadəçi" },
      { ...nextTableColumns.date, accessor: (r) => r.createdAt, id: "created_at", Header: "Tarix" },
    ],
    [navigate],
  );
};
