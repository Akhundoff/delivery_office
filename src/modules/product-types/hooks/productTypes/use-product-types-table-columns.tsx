import { useMemo } from "react";
import { Column } from "react-table";
import { Button, Dropdown, MenuProps, Modal, Tag, message } from "antd";
import * as Icons from "@ant-design/icons";

import { StopPropagation } from "@shared/components/stop-propagation";
import { nextTableColumns } from "@shared/modules/next-table/helpers/next-table-columns";
import { useBackgroundNavigate } from "@shared/hooks";

import { ProductTypesService } from "../../services";
import { IProductType } from "../../interfaces";

export const useProductTypesTableColumns = (handleFetch: () => void): Column<IProductType>[] => {
  const navigate = useBackgroundNavigate();

  const actionsColumn = useMemo<Column<IProductType>>(
    () => ({
      ...nextTableColumns.actions,
      Cell: ({ row: { original } }: any) => {
        const items: MenuProps["items"] = [
          {
            key: "edit",
            label: "Düzəliş et",
            icon: <Icons.EditOutlined />,
            onClick: () =>
              navigate(`/product-types/${original.id}/update`, {
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
                content: "Məhsul tipini silməyə əminsinizmi?",
                okText: "Sil",
                okType: "danger",
                cancelText: "Ləğv et",
                onOk: async () => {
                  const result = await ProductTypesService.delete([original.id]);
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

  const baseColumns = useMemo<Column<IProductType>[]>(
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
        Header: "Ad (AZ)",
      },
      {
        accessor: (row) => row.nameEn,
        id: "name_en",
        Header: "Ad (EN)",
      },
      {
        accessor: (row) => row.nameRu,
        id: "name_ru",
        Header: "Ad (RU)",
      },
      {
        accessor: (row) => row.status?.name,
        id: "state_name",
        Header: "Status",
        Cell: ({ value }: any) =>
          value ? <Tag color="blue">{value}</Tag> : null,
      },
    ],
    [],
  );

  return useMemo(
    () => [actionsColumn, ...baseColumns],
    [actionsColumn, baseColumns],
  );
};
