import { useMemo } from "react";
import { Column } from "react-table";
import { nextTableColumns } from "@shared/modules/next-table/helpers/next-table-columns";
import { IAzerpostQueue } from "../../interfaces";

export const useAzerpostQueuesTableColumns = (): Column<IAzerpostQueue>[] => {
  return useMemo<Column<IAzerpostQueue>[]>(
    () => [
      { ...nextTableColumns.small, Header: "Kod", id: "id", accessor: (r) => r.id },
      { accessor: (r) => r.objectId, id: "object_id", Header: "Obyekt kod" },
      { accessor: (r) => r.requestMethod, id: "request_method", Header: "Metod" },
      { accessor: (r) => r.statusCode, id: "status_code", Header: "Status kod" },
      {
        accessor: (r) => r.executed,
        id: "executed",
        Header: "Əməliyyat",
        Cell: ({ value }: any) => (value ? "İcra edilib" : "İcra edilməyib"),
      },
      { accessor: (r) => r.attempts, id: "attempts", Header: "Cəhd sayı" },
      { ...nextTableColumns.date, accessor: (r) => r.retryAt, id: "retry_at", Header: "Cəhd edildi" },
      { ...nextTableColumns.date, accessor: (r) => r.createdAt, id: "created_at", Header: "Yaradılma tarixi" },
    ],
    [],
  );
};
