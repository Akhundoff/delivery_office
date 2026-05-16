import { useMemo } from "react";
import { Column } from "react-table";
import { nextTableColumns } from "@shared/modules/next-table/helpers/next-table-columns";
import { IDeliveryProof } from "../../interfaces";

export const useDeliveryProofsTableColumns = (): Column<IDeliveryProof>[] => {
  return useMemo<Column<IDeliveryProof>[]>(
    () => [
      { ...nextTableColumns.small, Header: "Kod", id: "id", accessor: (r) => r.id },
      { accessor: (r) => r.trackCode, id: "track_code", Header: "İzləmə kodu" },
      { accessor: (r) => r.declarationId, id: "declaration_id", Header: "Bağlama ID" },
      { accessor: (r) => r.user?.name, id: "user_name", Header: "İstifadəçi" },
      { accessor: (r) => r.fileUrl, id: "file_url", Header: "Fayl" },
      { ...nextTableColumns.date, accessor: (r) => r.createdAt, id: "created_at", Header: "Tarix" },
    ],
    [],
  );
};
