import { FC, useMemo, useState } from 'react';
import { Badge, Card, Col, Descriptions, Input, Modal, Row, Spin, Table, Tag } from 'antd';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import * as Icons from '@ant-design/icons';
import { useCloseModal } from '@shared/hooks';
import { BranchInspectionsService } from '../services';
import { useBranchInspectionById } from '../hooks';
import { IScan } from '../interfaces';

const getStatusColor = (stateId: number) => {
  if (stateId === 157) return 'success';
  if (stateId === 156) return 'processing';
  return 'default';
};

export const BranchInspectionDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const [closeModal] = useCloseModal();
  const [searchText, setSearchText] = useState('');

  const { data, isFetching } = useBranchInspectionById(id);
  const { data: scans = [], isFetching: scansLoading } = useQuery(
    ['branch-inspection-scans', id],
    async () => {
      const result = await BranchInspectionsService.getScans(id!);
      if (result.status === 200) return result.data;
      throw new Error(result.data as string);
    },
    { enabled: !!id },
  );

  const filteredScans = useMemo(() => {
    if (!searchText.trim()) return scans;
    const s = searchText.toLowerCase().trim();
    return scans.filter((scan) => (scan.trackCode?.toString() || '').toLowerCase().includes(s) || (scan.barcode || '').toLowerCase().includes(s));
  }, [scans, searchText]);

  return (
    <Modal width={1200} open title="Filial yoxlanışı ətraflı məlumat" onCancel={() => closeModal('/branch-inspections')} footer={null}>
      <Spin spinning={isFetching}>
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            <Card title="Ümumi məlumat" size="small">
              <Descriptions bordered column={1} size="small">
                <Descriptions.Item label="Yoxlanış №">
                  <strong>#{data?.id}</strong>
                </Descriptions.Item>
                <Descriptions.Item label="Filial">
                  <Tag color="blue" icon={<Icons.BankOutlined />}>
                    {data?.branch.name}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Status">
                  <Badge status={getStatusColor(data?.stateId || 0) as any} text={data?.state?.name || '-'} />
                </Descriptions.Item>
                <Descriptions.Item label="Qeyd">{data?.note || '-'}</Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title="Tarix məlumatları" size="small">
              <Descriptions bordered column={1} size="small">
                <Descriptions.Item label="Son tarix">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{data?.deadline.value}</span>
                    {data?.completedAt ? (
                      <Tag color="success" icon={<Icons.CheckCircleOutlined />}>
                        Tamamlanıb
                      </Tag>
                    ) : (
                      <Tag color="warning" icon={<Icons.ClockCircleOutlined />}>
                        {data?.deadline.left}
                      </Tag>
                    )}
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="Başlanma tarixi">{data?.startedAt || <Tag>Başlanmayıb</Tag>}</Descriptions.Item>
                <Descriptions.Item label="Tamamlanma tarixi">{data?.completedAt || <Tag>Tamamlanmayıb</Tag>}</Descriptions.Item>
                <Descriptions.Item label="Yaradılma tarixi">{data?.createdAt}</Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title="İstifadəçi məlumatları" size="small">
              <Descriptions bordered column={1} size="small">
                <Descriptions.Item label="Yaradan">
                  <Tag color="purple" icon={<Icons.UserAddOutlined />}>
                    {data?.createdByUser.name}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="İcraçı">
                  {data?.executedByUser ? (
                    <Tag color="green" icon={<Icons.UserOutlined />}>
                      {data.executedByUser.name}
                    </Tag>
                  ) : (
                    <Tag>Təyin edilməyib</Tag>
                  )}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          <Col xs={24}>
            <Card
              size="small"
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Scan edilmiş bağlamalar</span>
                  <Tag color="blue">{scans.length} ədəd</Tag>
                </div>
              }
            >
              <Input placeholder="İzləmə kodu və ya barkod ilə axtar..." prefix={<Icons.SearchOutlined />} value={searchText} onChange={(e) => setSearchText(e.target.value)} style={{ marginBottom: 16 }} allowClear />
              <Table dataSource={filteredScans} rowKey="id" loading={scansLoading} pagination={{ pageSize: 50, showSizeChanger: false }} size="small" scroll={{ x: 800 }}>
                <Table.Column title="№" key="index" width={60} render={(_, __, index) => index + 1} />
                <Table.Column title="İzləmə kodu" dataIndex="trackCode" key="trackCode" render={(text) => <Tag color="blue" style={{ fontFamily: 'monospace' }}>{text}</Tag>} />
                <Table.Column title="Barkod" dataIndex="barcode" key="barcode" render={(text, record: IScan) => <Tag color={record.trendyol && record.trendyol > 0 ? 'purple' : 'default'} style={{ fontFamily: 'monospace' }}>{text || record.trackCode?.toString() || '-'}</Tag>} />
                <Table.Column
                  title="Tip"
                  dataIndex="trendyol"
                  key="trendyol"
                  width={120}
                  render={(trendyol: number | null, record: IScan) => {
                    if (record.partnerId) return <Tag color="orange">Partner</Tag>;
                    if (trendyol === 1) return <Tag color="purple">Trendyol</Tag>;
                    if (trendyol === 2) return <Tag color="blue">Temu</Tag>;
                    return <Tag color="green">Findex</Tag>;
                  }}
                />
                <Table.Column title="Scan tarixi" dataIndex="scannedAt" key="scannedAt" width={180} />
                <Table.Column title="Bağlama ID" dataIndex="declarationId" key="declarationId" width={100} />
              </Table>
            </Card>
          </Col>
        </Row>
      </Spin>
    </Modal>
  );
};
