import { useContext, useMemo } from "react";
import { Column } from "react-table";
import { Button, Dropdown, MenuProps, Modal, Tag, message } from "antd";
import * as Icons from "@ant-design/icons";

import { StopPropagation } from "@shared/components/stop-propagation";
import { nextTableColumns } from "@shared/modules/next-table/helpers/next-table-columns";
import { useBackgroundNavigate } from "@shared/hooks";

import { BranchPartnersTableContext } from "../../context";
import { BranchPartnersService } from "../../services";
import { IBranchPartner } from "../../interfaces";

export const useBranchPartnersTableColumns = (): Column<IBranchPartner>[] => {
  const navigate = useBackgroundNavigate();
  const { handleFetch } = useContext(BranchPartnersTableContext);

  const actionsColumn = useMemo<Column<IBranchPartner>>(
    () => ({
      ...nextTableColumns.actions,
      Cell: ({ row: { original } }: any) => {
        const items: MenuProps["items"] = [
          {
            key: "edit",
            label: "Düzəliş et",
            icon: <Icons.EditOutlined />,
            onClick: () =>
              navigate(`/branch-partners/${original.id}/update`, {
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
                content: "Şirkəti silməyə əminsinizmi?",
                okText: "Sil",
                okType: "danger",
                cancelText: "Ləğv et",
                onOk: async () => {
                  const result = await BranchPartnersService.delete([original.id]);
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

  const baseColumns = useMemo<Column<IBranchPartner>[]>(
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
        accessor: (row) => row.contact,
        id: "contact",
        Header: "Əlaqə",
      },
      {
        accessor: (row) => row.isOwner,
        id: "is_owner",
        Header: "Sahib",
        Cell: ({ value }: any) =>
          value ? <Tag color="green">Bəli</Tag> : <Tag>Xeyr</Tag>,
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
