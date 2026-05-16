import { useContext, useMemo } from "react";
import { Column } from "react-table";
import { Button, Dropdown, MenuProps, Modal, message } from "antd";
import * as Icons from "@ant-design/icons";
import { StopPropagation } from "@shared/components/stop-propagation";
import { nextTableColumns } from "@shared/modules/next-table/helpers/next-table-columns";
import { useBackgroundNavigate } from "@shared/hooks";
import { BoxesTableContext } from "../../context";
import { BoxesService } from "../../services";
import { IBox } from "../../interfaces";

export const useBoxesTableColumns = (): Column<IBox>[] => {
  const navigate = useBackgroundNavigate();
  const { handleFetch } = useContext(BoxesTableContext);

  const actionsColumn = useMemo<Column<IBox>>(
    () => ({
      ...nextTableColumns.actions,
      Cell: ({ row: { original } }: any) => {
        const items: MenuProps["items"] = [
          { key: "edit", label: "Düzəliş et", icon: <Icons.EditOutlined />, onClick: () => navigate(`/boxes/${original.id}/update`, { withBackground: true }) },
          { type: "divider" },
          {
            key: "delete", label: "Sil", icon: <Icons.DeleteOutlined />, danger: true,
            onClick: () => Modal.confirm({ title: "Diqqət", content: "Yeşiyi silməyə əminsinizmi?", okText: "Sil", okType: "danger", cancelText: "Ləğv et",
              onOk: async () => { const r = await BoxesService.delete([original.id]); if (r.status === 200) handleFetch(); else message.error(r.data as string); },
            }),
          },
        ];
        return <StopPropagation><Dropdown menu={{ items }} trigger={["hover"]}><Button icon={<Icons.MoreOutlined />} size="small" /></Dropdown></StopPropagation>;
      },
    }),
    [navigate, handleFetch],
  );

  const baseColumns = useMemo<Column<IBox>[]>(
    () => [
      { ...nextTableColumns.small, Header: "Kod", id: "id", accessor: (r) => r.id },
      { accessor: (r) => r.name, id: "container_name", Header: "Ad" },
      { accessor: (r) => r.branch?.name || "—", id: "branch_id", Header: "Filial" },
      { accessor: (r) => r.user?.name || "—", id: "user_id", Header: "İstifadəçi" },
      { ...nextTableColumns.small, accessor: (r) => r.declarationCount, id: "declaration_count", Header: "Bağlama sayı", filterable: false },
      { ...nextTableColumns.date, accessor: (r) => r.createdAt, id: "created_at", Header: "Tarix" },
    ],
    [],
  );

  return useMemo(() => [actionsColumn, ...baseColumns], [actionsColumn, baseColumns]);
};
