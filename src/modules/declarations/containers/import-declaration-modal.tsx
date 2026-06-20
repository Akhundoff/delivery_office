import React, { useCallback, useState } from 'react';
import { Button, Col, Form, Modal, Row, Space, Table, Typography, Upload, message } from 'antd';
import * as Icons from '@ant-design/icons';
import { useQuery } from 'react-query';
import { useCloseModal } from '@shared/hooks';
import { DeclarationsService } from '../services';
import { IExportDeclarationTask } from '../interfaces';

const iconMap: Record<number, React.ReactNode> = {
  131: <Icons.FileDoneOutlined />,
  132: <Icons.LoadingOutlined />,
  134: <Icons.DownloadOutlined />,
};

const ExportTasksTable: React.FC = () => {
  const [fetchCount, setFetchCount] = useState(0);
  const isCheckBtnEnabled = fetchCount > 50;
  const refetchInterval = isCheckBtnEnabled ? false : 3000;

  const { data, refetch } = useQuery<IExportDeclarationTask[]>(
    ['declarations', 'export-tasks'],
    async () => {
      const result = await DeclarationsService.getExportTasks();
      setFetchCount((prev) => prev + 1);
      if (result.status === 200) return result.data;
      return [];
    },
    { refetchInterval },
  );

  const handleDownload = useCallback(async (id: string) => {
    const result = await DeclarationsService.downloadExportTask(id);
    if (result.status === 200) {
      message.success('Sənəd yüklənir');
      const a = document.createElement('a');
      a.href = URL.createObjectURL(result.data as Blob);
      a.download = `declarations_excel_${Math.round(Math.random() * 1000)}.xls`;
      a.click();
      a.remove();
    } else {
      message.error(result.data as string);
    }
  }, []);

  return (
    <Table
      size="small"
      bordered
      pagination={{ pageSize: 5 }}
      dataSource={data || []}
      rowKey="id"
      footer={() => (
        <Button icon={<Icons.SearchOutlined />} disabled={!isCheckBtnEnabled} type="text" onClick={() => refetch()}>
          Yoxla
        </Button>
      )}
    >
      <Table.Column
        key="id"
        dataIndex="id"
        title="#"
        render={(value, record: IExportDeclarationTask) => {
          const isCompleted = record.status?.id === 134;
          const btnValue = iconMap[record.status?.id] ?? value;
          return (
            <Button disabled={!isCompleted} onClick={() => handleDownload(value)} type="text">
              {btnValue}
            </Button>
          );
        }}
      />
      <Table.Column key="status" dataIndex="status" title="Status" render={(value) => value?.name} />
      <Table.Column key="createdAt" dataIndex="createdAt" title="Tarix" />
    </Table>
  );
};

export const ImportDeclarationModal: React.FC = () => {
  const [closeModal] = useCloseModal();
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = useCallback(async (file: File) => {
    setIsUploading(true);
    message.loading({ key: 'import-decl', content: 'Sənəd yüklənir...', duration: 0 });
    const result = await DeclarationsService.importExcel(file);
    message.destroy('import-decl');
    setIsUploading(false);
    if (result.status === 200) {
      message.success((result.data as any)?.message || 'Sənəd qəbul edildi');
    } else {
      message.error(result.data as string);
    }
    return false;
  }, []);

  return (
    <Modal
      open
      width={768}
      onCancel={() => closeModal('/declarations')}
      okButtonProps={{ hidden: true }}
      title={
        <div style={{ lineHeight: 1.2 }}>
          <Typography.Title level={4} style={{ margin: 0 }}>
            İzləmə Kodları üzrə Məlumat İdxalı
          </Typography.Title>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            Excel faylında bir sütunda toplu izləmə kodlarınızı qeyd edin, sistem həmin bağlamaların daha geniş məlumatlarını təqdim edəcək.
          </Typography.Text>
        </div>
      }
    >
      <Row gutter={[24, 16]}>
        <Col span={14}>
          <Form layout="vertical">
            <Form.Item>
              <Upload.Dragger maxCount={1} showUploadList={false} disabled={isUploading} beforeUpload={handleUpload}>
                <Space direction="vertical" size={12}>
                  <Typography.Text type="secondary" style={{ fontSize: 14 }}>
                    Sənədi yükləmək üçün klikləyin və ya sürüşdürün
                  </Typography.Text>
                  <Button style={{ borderRadius: 8 }} icon={<Icons.UploadOutlined />} loading={isUploading}>
                    Import
                  </Button>
                </Space>
              </Upload.Dragger>
            </Form.Item>
          </Form>
          <ExportTasksTable />
        </Col>
        <Col span={10}>
          <Typography.Title level={5}>Qaydalar</Typography.Title>
          <ul style={{ paddingLeft: 20 }}>
            <li>
              İmport ediləcək excel faylında <Typography.Text strong>izləmə kodları</Typography.Text> və ya <Typography.Text strong>qlobal izləmə kodları</Typography.Text> bir sütun boyunca qeyd
              edilməlidir.
            </li>
            <li>İzləmə və ya global izləmə kodlarını sistem özü ayıracaq.</li>
            <li>Qarşısında FDX prefixi olarsa, sistem özü silə bilər.</li>
            <li>İmport ediləcək excel faylının yalnız 1 sütunu olmalıdır.</li>
            <li>İmport uğurla qəbul olduqdan sonra, məlumatlar hazır olduqdan sonra soldakı siyahıda görünəcək.</li>
          </ul>
        </Col>
      </Row>
    </Modal>
  );
};
