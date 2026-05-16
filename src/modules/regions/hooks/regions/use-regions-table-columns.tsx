import { useContext, useMemo } from "react";
import { Column } from "react-table";
import { Button, Dropdown, MenuProps, Modal, message } from "antd";
import * as Icons from "@ant-design/icons";

import { StopPropagation } from "@shared/components/stop-propagation";
import { nextTableColumns } from "@shared/modules/next-table/helpers/next-table-columns";
import { useBackgroundNavigate } from "@shared/hooks";

import { RegionsService } from "../../services";
import { IRegion } from "../../interfaces";
import { RegionsTableContext } from "../../context";

export const useRegionsTableColumns = (): Column<IRegion>[] => {
  const { handleFetch } = useContext(RegionsTableContext);
  const navigate = useBackgroundNavigate();

  const actionsColumn = useMemo<Column<IRegion>>(
    () => ({
      ...nextTableColumns.actions,
      Cell: ({ row: { original } }: any) => {
        const items: MenuProps["items"] = [
          {
            key: "edit",
            label: "Düzəliş et",
            icon: <Icons.EditOutlined />,
            onClick: () =>
              navigate(`/regions/${original.id}/update`, {
                withBackground: true,
              }),
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
                content: "Rayonu silməyə əminsinizmi?",
                okText: "Sil",
                okType: "danger",
                cancelText: "Ləğv et",
                onOk: async () => {
                  const result = await RegionsService.delete([original.id]);
                  if (result.status === 200) {
                    handleFetch();
                  } else {
                    message.error(result.data as string);
                  }
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

  const baseColumns = useMemo<Column<IRegion>[]>(
    () => [
      {
        ...nextTableColumns.small,
        Header: "Kod",
        id: "id",
        accessor: (row) => row.id,
      },
      {
        accessor: (row) => row.name,
        id: "name",
        Header: "Ad",
      },
      {
        accessor: (row) => row.price,
        id: "price",
        Header: "Qiymət",
      },
      {
        accessor: (row) => row.shipping,
        id: "shipping",
        Header: "Çatdırılma",
      },
      {
        accessor: (row) => row.branches.map((b) => b.name).join(", "),
        id: "branches",
        Header: "Filiallar",
      },
      {
        ...nextTableColumns.date,
        accessor: (row) => row.createdAt,
        id: "created_at",
        Header: "Tarix",
      },
    ],
    [],
  );

  return useMemo(
    () => [actionsColumn, ...baseColumns],
    [actionsColumn, baseColumns],
  );
};
