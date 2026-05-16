import { useCallback, useContext } from "react";
import { useMemo } from "react";
import { Column } from "react-table";
import { Dropdown, Modal } from "antd";
import * as Icons from "@ant-design/icons";
import { nextTableColumns } from "@shared/modules/next-table/helpers/next-table-columns";
import { useBackgroundNavigate } from "@shared/hooks";
import { FaqTableContext } from "../../context";
import { FaqService } from "../../services";
import { IFaq } from "../../interfaces";

export const useFaqTableColumns = (): Column<IFaq>[] => {
  const { handleFetch } = useContext(FaqTableContext);
  const navigate = useBackgroundNavigate();

  const handleDelete = useCallback((id: number) => {
    Modal.confirm({
      title: "Silmək istədiyinizə əminsiniz?",
      okText: "Sil",
      cancelText: "Ləğv et",
      okButtonProps: { danger: true },
      onOk: async () => {
        await FaqService.delete([id]);
        handleFetch();
      },
    });
  }, [handleFetch]);

  return useMemo<Column<IFaq>[]>(
    () => [
      { ...nextTableColumns.small, Header: "Kod", id: "id", accessor: (r) => r.id },
      { accessor: (r) => r.question, id: "question", Header: "Sual" },
      { accessor: (r) => r.answer, id: "answer", Header: "Cavab" },
      { accessor: (r) => r.sort, id: "sort", Header: "Sıralama" },
      { ...nextTableColumns.date, accessor: (r) => r.createdAt, id: "created_at", Header: "Tarix" },
      {
        ...nextTableColumns.actions,
        id: "actions",
        Header: "",
        Cell: ({ row }: any) => (
          <Dropdown
            menu={{
              items: [
                { key: "edit", label: "Düzəlt", icon: <Icons.EditOutlined />, onClick: () => navigate(`/faq/${row.original.id}/update`, { withBackground: true }) },
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
