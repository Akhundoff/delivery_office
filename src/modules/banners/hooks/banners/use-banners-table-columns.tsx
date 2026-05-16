import { useCallback, useContext, useMemo } from "react";
import { Column } from "react-table";
import { Dropdown, Modal, Tag } from "antd";
import * as Icons from "@ant-design/icons";
import { nextTableColumns } from "@shared/modules/next-table/helpers/next-table-columns";
import { useBackgroundNavigate } from "@shared/hooks";
import { BannersService } from "../../services";
import { bannerTypes } from "../../constants/banner-types";
import { IBanner } from "../../interfaces";
import { BannersTableContext } from "../../context";

export const useBannersTableColumns = (): Column<IBanner>[] => {
  const { handleFetch } = useContext(BannersTableContext);
  const navigate = useBackgroundNavigate();

  const handleDelete = useCallback((id: number) => {
    Modal.confirm({
      title: "Silmək istədiyinizə əminsiniz?",
      okText: "Sil",
      cancelText: "Ləğv et",
      okButtonProps: { danger: true },
      onOk: async () => {
        await BannersService.delete([id]);
        handleFetch();
      },
    });
  }, [handleFetch]);

  return useMemo<Column<IBanner>[]>(
    () => [
      { ...nextTableColumns.small, Header: "Kod", id: "id", accessor: (r) => r.id },
      { accessor: (r) => r.name, id: "name", Header: "Ad" },
      {
        accessor: (r) => r.type,
        id: "type",
        Header: "Tip",
        Cell: ({ value }: any) => {
          const bt = bannerTypes.find((t) => t.type === value);
          return bt ? <Tag>{bt.title}</Tag> : value;
        },
      },
      {
        accessor: (r) => r.active,
        id: "active",
        Header: "Aktiv",
        Cell: ({ value }: any) => <Tag color={value ? "green" : "red"}>{value ? "Bəli" : "Xeyr"}</Tag>,
      },
      { ...nextTableColumns.date, accessor: (r) => r.createdAt, id: "created_at", Header: "Tarix" },
      {
        ...nextTableColumns.actions,
        id: "actions",
        Header: "",
        Cell: ({ row }: any) => (
          <Dropdown
            menu={{
              items: [
                { key: "edit", label: "Düzəlt", icon: <Icons.EditOutlined />, onClick: () => navigate(`/banners/${row.original.id}/update`, { withBackground: true }) },
                { key: "delete", label: "Sil", icon: <Icons.DeleteOutlined />, danger: true, onClick: () => handleDelete(row.original.id) },
              ],
            }}
          >
            <Icons.MoreOutlined />
          </Dropdown>
        ),
      },
    ],
    [navigate, handleDelete],
  );
};
