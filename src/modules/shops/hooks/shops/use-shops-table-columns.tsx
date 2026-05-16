import { useCallback, useContext, useMemo } from "react";
import { Column } from "react-table";
import { Dropdown, Modal } from "antd";
import * as Icons from "@ant-design/icons";
import { nextTableColumns } from "@shared/modules/next-table/helpers/next-table-columns";
import { useBackgroundNavigate } from "@shared/hooks";
import { ShopsService } from "../../services";
import { IShop } from "../../interfaces";
import { ShopsTableContext } from "../../context";

export const useShopsTableColumns = (): Column<IShop>[] => {
  const { handleFetch } = useContext(ShopsTableContext);
  const navigate = useBackgroundNavigate();

  const handleDelete = useCallback((id: number) => {
    Modal.confirm({
      title: "Silmək istədiyinizə əminsiniz?",
      okText: "Sil",
      cancelText: "Ləğv et",
      okButtonProps: { danger: true },
      onOk: async () => {
        await ShopsService.delete([id]);
        handleFetch();
      },
    });
  }, [handleFetch]);

  return useMemo<Column<IShop>[]>(
    () => [
      { ...nextTableColumns.small, Header: "Kod", id: "id", accessor: (r) => r.id },
      { accessor: (r) => r.label, id: "label", Header: "Ad" },
      { accessor: (r) => r.url, id: "url", Header: "URL" },
      { accessor: (r) => r.categoryName, id: "category_name", Header: "Kateqoriya" },
      {
        ...nextTableColumns.actions,
        id: "actions",
        Header: "",
        Cell: ({ row }: any) => (
          <Dropdown
            menu={{
              items: [
                { key: "edit", label: "Düzəlt", icon: <Icons.EditOutlined />, onClick: () => navigate(`/shops/${row.original.id}/update`, { withBackground: true }) },
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
