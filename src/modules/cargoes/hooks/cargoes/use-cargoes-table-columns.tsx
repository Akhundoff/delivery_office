import { useContext, useMemo } from "react";
import { Column } from "react-table";
import { Button, Dropdown, MenuProps, Modal, message } from "antd";
import * as Icons from "@ant-design/icons";

import { StopPropagation } from "@shared/components/stop-propagation";
import { nextTableColumns } from "@shared/modules/next-table/helpers/next-table-columns";
import { useBackgroundNavigate } from "@shared/hooks";

import { CargoesService } from "../../services";
import { ICargo } from "../../interfaces";
import { CargoesTableContext } from "../../context";

export const useCargoesTableColumns = (): Column<ICargo>[] => {
  const { handleFetch } = useContext(CargoesTableContext);
  const navigate = useBackgroundNavigate();

  const actionsColumn = useMemo<Column<ICargo>>(
    () => ({
      ...nextTableColumns.actions,
      Cell: ({ row: { original } }: any) => {
        const items: MenuProps["items"] = [
          {
            key: "edit",
            label: "Düzəliş et",
            icon: <Icons.EditOutlined />,
            onClick: () => navigate(`/cargoes/${original.id}/update`, { withBackground: true }),
          },
          { type: "divider" },
          {
            key: "delete",
            label: "Sil",
            icon: <Icons.DeleteOutlined />,
            danger: true,
            onClick: () => {
              Modal.confirm({
                title: "Diqqət",
                content: "Karqonu silməyə əminsinizmi?",
                okText: "Sil",
                okType: "danger",
                cancelText: "Ləğv et",
                onOk: async () => {
                  const result = await CargoesService.delete([original.id]);
                  if (result.status === 200) handleFetch();
                  else message.error(result.data as string);
                },
              });
            },
          },
        ];
        return (
          <StopPropagation>
            <Dropdown menu={{ items }} trigger={["hover"]}>
              <Button icon={<Icons.MoreOutlined />} size="small" />
            </Dropdown>
          </StopPropagation>
        );
      },
    }),
    [navigate, handleFetch],
  );

  const baseColumns = useMemo<Column<ICargo>[]>(
    () => [
      { ...nextTableColumns.small, Header: "Kod", id: "id", accessor: (r) => r.id },
      { accessor: (r) => r.name, id: "cargo_name", Header: "Ad" },
      { accessor: (r) => r.description || "—", id: "descr", Header: "Açıqlama" },
      { ...nextTableColumns.date, accessor: (r) => r.createdAt, id: "created_at", Header: "Tarix" },
    ],
    [],
  );

  return useMemo(() => [actionsColumn, ...baseColumns], [actionsColumn, baseColumns]);
};
