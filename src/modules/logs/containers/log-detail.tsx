import { FC } from "react";
import { Modal, Spin, Table } from "antd";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { useCloseModal } from "@shared/hooks";
import { LogsService } from "../services";

export const LogDetail: FC = () => {
  const { id } = useParams<{ id: string }>();
  const [closeModal] = useCloseModal();

  const { data, isLoading } = useQuery(
    ["log-detail", id],
    async () => {
      const result = await LogsService.getById(id!);
      if (result.status === 200) return result.data;
      throw new Error(result.data as string);
    },
    { enabled: !!id },
  );

  const buildRows = () => {
    if (!data) return [];
    const allKeys = new Set([
      ...Object.keys(data.newValue ?? {}),
      ...Object.keys(data.oldValue ?? {}),
    ]);
    return Array.from(allKeys).map((key) => ({
      key,
      field: key,
      oldValue: data.oldValue?.[key] != null ? String(data.oldValue[key]) : "—",
      newValue: data.newValue?.[key] != null ? String(data.newValue[key]) : "—",
    }));
  };

  const columns = [
    { title: "Sahə", dataIndex: "field", key: "field", width: 200 },
    { title: "Köhnə dəyər", dataIndex: "oldValue", key: "oldValue" },
    { title: "Yeni dəyər", dataIndex: "newValue", key: "newValue" },
  ];

  return (
    <Modal
      open={true}
      onCancel={() => closeModal("/logs")}
      title={`#${id} kodlu əməliyyatdakı dəyişikliklər`}
      footer={null}
      width={768}
    >
      {isLoading ? (
        <Spin style={{ display: "block", padding: "40px 0", textAlign: "center" }} />
      ) : (
        <Table dataSource={buildRows()} columns={columns} pagination={false} size="small" />
      )}
    </Modal>
  );
};
