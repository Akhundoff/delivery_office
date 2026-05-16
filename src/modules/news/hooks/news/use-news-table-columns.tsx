import { useCallback, useContext, useMemo } from "react";
import { Column } from "react-table";
import { Dropdown, Modal } from "antd";
import * as Icons from "@ant-design/icons";
import { nextTableColumns } from "@shared/modules/next-table/helpers/next-table-columns";
import { useBackgroundNavigate } from "@shared/hooks";
import { NewsTableContext } from "../../context";
import { NewsService } from "../../services";
import { INews } from "../../interfaces";

export const useNewsTableColumns = (): Column<INews>[] => {
  const { handleFetch } = useContext(NewsTableContext);
  const navigate = useBackgroundNavigate();

  const handleDelete = useCallback((id: number) => {
    Modal.confirm({
      title: "Silmək istədiyinizə əminsiniz?",
      okText: "Sil",
      cancelText: "Ləğv et",
      okButtonProps: { danger: true },
      onOk: async () => {
        await NewsService.delete([id]);
        handleFetch();
      },
    });
  }, [handleFetch]);

  return useMemo<Column<INews>[]>(
    () => [
      { ...nextTableColumns.small, Header: "Kod", id: "id", accessor: (r) => r.id },
      { accessor: (r) => r.title, id: "title", Header: "Başlıq" },
      { accessor: (r) => r.descr, id: "descr", Header: "Açıqlama" },
      { ...nextTableColumns.date, accessor: (r) => r.createdAt, id: "created_at", Header: "Tarix" },
      {
        ...nextTableColumns.actions,
        id: "actions",
        Header: "",
        Cell: ({ row }: any) => (
          <Dropdown
            menu={{
              items: [
                { key: "edit", label: "Düzəlt", icon: <Icons.EditOutlined />, onClick: () => navigate(`/news/${row.original.id}/update`, { withBackground: true }) },
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
