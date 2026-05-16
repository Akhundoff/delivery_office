import { useContext, useMemo } from "react";
import { Column } from "react-table";
import { Button, Dropdown, MenuProps, Modal, message } from "antd";
import * as Icons from "@ant-design/icons";

import { StopPropagation } from "@shared/components/stop-propagation";
import { nextTableColumns } from "@shared/modules/next-table/helpers/next-table-columns";
import { useBackgroundNavigate } from "@shared/hooks";

import { ReturnTypesTableContext } from "../../context";
import { ReturnTypesService } from "../../services";
import { IReturnType } from "../../interfaces";

export const useReturnTypesTableColumns = (): Column<IReturnType>[] => {
  const navigate = useBackgroundNavigate();
  const { handleFetch } = useContext(ReturnTypesTableContext);

  const actionsColumn = useMemo<Column<IReturnType>>(
    () => ({
      ...nextTableColumns.actions,
      Cell: ({ row: { original } }: any) => {
        const items: MenuProps["items"] = [
          {
            key: "edit",
            label: "Düzəliş et",
            icon: <Icons.EditOutlined />,
            onClick: () =>
              navigate(`/return-types/${original.id}/update`, {
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
                content: "İadə səbəbini silməyə əminsinizmi?",
                okText: "Sil",
                okType: "danger",
                cancelText: "Ləğv et",
                onOk: async () => {
                  const result = await ReturnTypesService.delete([
                    original.id,
                  ]);
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

  const baseColumns = useMemo<Column<IReturnType>[]>(
    () => [
      {
        ...nextTableColumns.small,
        Header: "Kod",
        id: "id",
        accessor: (row) => row.id,
      },
      {
        accessor: (row) => row.name,
        id: "reason",
        Header: "Ad",
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
