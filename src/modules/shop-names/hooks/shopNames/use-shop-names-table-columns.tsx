import { useContext, useMemo } from "react";
import { Column } from "react-table";
import { Button, Dropdown, MenuProps, Modal, message } from "antd";
import * as Icons from "@ant-design/icons";
import { StopPropagation } from "@shared/components/stop-propagation";
import { nextTableColumns } from "@shared/modules/next-table/helpers/next-table-columns";
import { useBackgroundNavigate } from "@shared/hooks";
import { ShopNamesTableContext } from "../../context";
import { ShopNamesService } from "../../services";
import { IShopName } from "../../interfaces";

export const useShopNamesTableColumns = (): Column<IShopName>[] => {
  const navigate = useBackgroundNavigate();
  const { handleFetch } = useContext(ShopNamesTableContext);

  const actionsColumn = useMemo<Column<IShopName>>(
    () => ({
      ...nextTableColumns.actions,
      Cell: ({ row: { original } }: any) => {
        const items: MenuProps["items"] = [
          { key: "edit", label: "Düzəliş et", icon: <Icons.EditOutlined />, onClick: () => navigate(`/shop-names/${original.id}/update`, { withBackground: true }) },
          { type: "divider" },
          {
            key: "delete", label: "Sil", icon: <Icons.DeleteOutlined />, danger: true,
            onClick: () => Modal.confirm({ title: "Diqqət", content: "Mağazanı silməyə əminsinizmi?", okText: "Sil", okType: "danger", cancelText: "Ləğv et",
              onOk: async () => { const r = await ShopNamesService.delete([original.id]); if (r.status === 200) handleFetch(); else message.error(r.data as string); },
            }),
          },
        ];
        return <StopPropagation><Dropdown menu={{ items }} trigger={["hover"]}><Button icon={<Icons.MoreOutlined />} size="small" /></Dropdown></StopPropagation>;
      },
    }),
    [navigate, handleFetch],
  );

  const baseColumns = useMemo<Column<IShopName>[]>(
    () => [
      { ...nextTableColumns.small, Header: "Kod", id: "id", accessor: (r) => r.id },
      { accessor: (r) => r.name, id: "name", Header: "Ad" },
      { accessor: (r) => r.countryName || "—", id: "country_id", Header: "Ölkə" },
      { ...nextTableColumns.date, accessor: (r) => r.createdAt, id: "created_at", Header: "Tarix" },
    ],
    [],
  );

  return useMemo(() => [actionsColumn, ...baseColumns], [actionsColumn, baseColumns]);
};
