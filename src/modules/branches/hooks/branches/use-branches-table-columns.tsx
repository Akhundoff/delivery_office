import { useContext, useMemo } from "react";
import { Column } from "react-table";
import { Button, Dropdown, MenuProps, Modal, Tag, message } from "antd";
import * as Icons from "@ant-design/icons";

import { StopPropagation } from "@shared/components/stop-propagation";
import { nextTableColumns } from "@shared/modules/next-table/helpers/next-table-columns";
import { useBackgroundNavigate } from "@shared/hooks";

import { BranchesTableContext } from "../../context";
import { BranchesService } from "../../services";
import { IBranchListItem } from "../../interfaces";

export const useBranchesTableColumns = (): Column<IBranchListItem>[] => {
  const navigate = useBackgroundNavigate();
  const { handleFetch } = useContext(BranchesTableContext);

  const actionsColumn = useMemo<Column<IBranchListItem>>(
    () => ({
      ...nextTableColumns.actions,
      Cell: ({ row: { original } }: any) => {
        const items: MenuProps["items"] = [
          {
            key: "edit",
            label: "Düzəliş et",
            icon: <Icons.EditOutlined />,
            onClick: () =>
              navigate(`/branches/${original.id}/update`, { withBackground: true }),
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
                content: "Filialı silməyə əminsinizmi?",
                okText: "Sil",
                okType: "danger",
                cancelText: "Ləğv et",
                onOk: async () => {
                  const result = await BranchesService.delete([original.id]);
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

  const baseColumns = useMemo<Column<IBranchListItem>[]>(
    () => [
      { ...nextTableColumns.small, Header: "Kod", id: "id", accessor: (r) => r.id },
      { accessor: (r) => r.name, id: "name", Header: "Ad" },
      { accessor: (r) => r.address, id: "address", Header: "Ünvan" },
      { accessor: (r) => r.phone, id: "phone", Header: "Telefon" },
      {
        accessor: (r) => r.isBranch,
        id: "is_branch",
        Header: "Filial",
        Cell: ({ value }: any) => value ? <Tag color="blue">Bəli</Tag> : <Tag>Xeyr</Tag>,
      },
      {
        accessor: (r) => r.status?.name,
        id: "state_name",
        Header: "Status",
        Cell: ({ value }: any) => value ? <Tag color="green">{value}</Tag> : null,
      },
      {
        ...nextTableColumns.date,
        accessor: (r) => r.createdAt,
        id: "created_at",
        Header: "Tarix",
      },
    ],
    [],
  );

  return useMemo(() => [actionsColumn, ...baseColumns], [actionsColumn, baseColumns]);
};
