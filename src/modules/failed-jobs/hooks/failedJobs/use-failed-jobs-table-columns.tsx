import { Fragment, MouseEvent, useCallback, useContext, useMemo, useState } from "react";
import { Column } from "react-table";
import { Button, Dropdown, message, Modal, Space } from "antd";
import * as Icons from "@ant-design/icons";
import { nextTableColumns } from "@shared/modules/next-table/helpers/next-table-columns";
import { useBackgroundNavigate } from "@shared/hooks";
import { StopPropagation } from "@shared/components/stop-propagation";
import { Overflow } from "@shared/components/cells";
import { FailedJobsService } from "../../services";
import { IFailedJob } from "../../interfaces";
import { FailedJobsTableContext } from "../../context";

const BodyCell = ({ value }: { value: string }) => {
  const [open, setOpen] = useState<boolean>(false);

  const toggleModal = useCallback((event?: MouseEvent<HTMLElement>) => {
    event?.stopPropagation();
    setOpen((prev) => !prev);
  }, []);

  return (
    <Fragment>
      <Overflow onClick={toggleModal} $expand={false}>
        {value}
      </Overflow>
      <StopPropagation>
        <Modal footer={null} closable={false} destroyOnClose open={open} onCancel={toggleModal} width={576}>
          {value}
        </Modal>
      </StopPropagation>
    </Fragment>
  );
};

export const useFailedJobsTableColumns = (): Column<IFailedJob>[] => {
  const { handleFetch } = useContext(FailedJobsTableContext);
  const navigate = useBackgroundNavigate();

  const handleRemove = useCallback(
    (id: number) => {
      Modal.confirm({
        title: "Diqqət",
        content: "Bildirişi silməyə əminsinizmi?",
        okText: "Sil",
        cancelText: "Ləğv et",
        okButtonProps: { danger: true },
        onOk: async () => {
          const result = await FailedJobsService.remove(id);
          if (result.status === 200) {
            handleFetch();
          } else {
            message.error(result.data);
          }
        },
      });
    },
    [handleFetch],
  );

  const handleRetry = useCallback(
    (id: number) => {
      Modal.confirm({
        title: "Diqqət",
        content: "Bildirişi növbəyə göndərməyə əminsinizmi?",
        okText: "Növbəyə göndər",
        cancelText: "Ləğv et",
        onOk: async () => {
          const result = await FailedJobsService.retry(id);
          if (result.status === 200) {
            handleFetch();
            message.success("Əməliyyat müvəffəqiyyətlə başa çatdı.");
          } else {
            message.error(result.data);
          }
        },
      });
    },
    [handleFetch],
  );

  return useMemo<Column<IFailedJob>[]>(
    () => [
      {
        ...nextTableColumns.actions,
        Cell: ({ row: { original } }: any) => (
          <StopPropagation>
            <Dropdown
              menu={{
                items: [
                  { key: "remove", label: "Sil", icon: <Icons.DeleteOutlined />, danger: true, onClick: () => handleRemove(original.id) },
                  { key: "retry", label: "Növbəyə göndər", icon: <Icons.ReloadOutlined />, onClick: () => handleRetry(original.id) },
                ],
              }}
            >
              <Button icon={<Icons.MoreOutlined />} size="small" />
            </Dropdown>
          </StopPropagation>
        ),
      },
      { ...nextTableColumns.small, Header: "Kod", id: "id", accessor: (r) => r.id },
      { accessor: (r) => r.number, id: "number", Header: "Mobil nömrə" },
      {
        accessor: (r) => r.body,
        id: "body",
        Header: "Məzmun",
        Cell: ({ cell: { value } }: any) => <BodyCell value={value} />,
      },
      {
        ...nextTableColumns.small,
        accessor: (r) => r.dispatchData,
        id: "dispatchData",
        Header: "Ətraflı",
        Cell: ({ cell: { value }, row: { original } }: any) => {
          if (!value) return null;
          return (
            <Space size={8}>
              <Icons.FileTextOutlined
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/failed-jobs/preview", { withBackground: true, state: { failedJob: original } })}
              />
            </Space>
          );
        },
      },
      { ...nextTableColumns.date, accessor: (r) => r.failedAt, id: "failed_at", Header: "Tarix" },
    ],
    [navigate, handleRemove, handleRetry],
  );
};
