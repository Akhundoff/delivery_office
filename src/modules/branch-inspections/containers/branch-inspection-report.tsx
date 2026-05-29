import { FC, useCallback, useState } from 'react';
import { Button, Card, Col, Collapse, Descriptions, List, Modal, Progress, Row, Spin, Statistic, Tag, Tooltip, Typography, message } from 'antd';
import { useParams } from 'react-router-dom';
import * as Icons from '@ant-design/icons';
import { useCloseModal } from '@shared/hooks';
import { BranchInspectionsService } from '../services';
import { useInspectionReport } from '../hooks';

const { Text } = Typography;

export const BranchInspectionReport: FC = () => {
  const { id } = useParams<{ id: string }>();
  const [closeModal] = useCloseModal();
  const [exportLoading, setExportLoading] = useState(false);

  const { data, isFetching } = useInspectionReport(id);

  const handleExportExcel = useCallback(async () => {
    setExportLoading(true);
    const result = await BranchInspectionsService.exportReport(id!);
    if (result.status === 200) {
      const url = URL.createObjectURL(result.data as Blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `yoxlanis_${id}_hesabati.xlsx`;
      link.click();
      URL.revokeObjectURL(url);
      message.success('Excel faylı uğurla endirildi');
    } else {
      message.error(result.data as string);
    }
    setExportLoading(false);
  }, [id]);

  const expected = data?.expected_parcels_count.value || 0;
  const scanRate = data && expected ? Math.round((data.scanned_parcels_count.value / expected) * 100) : 0;
  const completionRate = data && expected ? Math.round((data.correct_parcels_count.value / expected) * 100) : 0;

  const tracksPanel = (key: string, header: string, color: string, tracks?: string[]) =>
    tracks && tracks.length > 0
      ? {
          key,
          label: (
            <span>
              <strong>{header}</strong> <Tag color={color}>{tracks.length} ədəd</Tag>
            </span>
          ),
          children: (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 8, maxHeight: 400, overflowY: 'auto', padding: 8, backgroundColor: '#fafafa', borderRadius: 4 }}>
              {tracks.map((track, idx) => (
                <Tag key={idx} color={color} style={{ margin: 0, fontFamily: 'monospace' }}>
                  {track}
                </Tag>
              ))}
            </div>
          ),
        }
      : null;

  const collapseItems = [
    tracksPanel('missing', 'İtkin bağlamalar', 'error', data?.missing_parcels_tracks.value),
    tracksPanel('extra', 'Artıq bağlamalar', 'warning', data?.extra_parcels_tracks.value),
    tracksPanel('foreign', 'Başqa filialın bağlamaları', 'processing', data?.foreign_scanned_parcels_tracks.value),
  ].filter(Boolean) as { key: string; label: JSX.Element; children: JSX.Element }[];

  return (
    <Modal
      width={1400}
      open
      title={`Filial yoxlanışı hesabatı #${id}`}
      onCancel={() => closeModal('/branch-inspections')}
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <Button onClick={() => closeModal('/branch-inspections')}>Bağla</Button>
          <Button type="primary" icon={<Icons.FileExcelOutlined />} loading={exportLoading} onClick={handleExportExcel}>
            Excel endir
          </Button>
        </div>
      }
    >
      <Spin spinning={isFetching}>
        <Row gutter={[24, 24]}>
          <Col xs={24}>
            <Card title="Ümumi Nəticə" size="small">
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={6}>
                  <Statistic title="Gözlənilən" value={data?.expected_parcels_count.value} prefix={<Icons.InboxOutlined />} valueStyle={{ color: '#1890ff' }} />
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Statistic title="Scan edilən" value={data?.scanned_parcels_count.value} prefix={<Icons.ScanOutlined />} valueStyle={{ color: '#722ed1' }} />
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Statistic title="Düzgün" value={data?.correct_parcels_count.value} prefix={<Icons.CheckCircleOutlined />} valueStyle={{ color: '#52c41a' }} />
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Statistic title="İcra müddəti" value={data?.duration_minutes.value} suffix="dəqiqə" prefix={<Icons.ClockCircleOutlined />} valueStyle={{ color: '#fa8c16' }} />
                </Col>
              </Row>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title="Tamamlanma Göstəriciləri" size="small">
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text strong>
                    Scan tamamlanma dərəcəsi{' '}
                    <Tooltip title="(Scan edilən / Gözlənilən) × 100%">
                      <Icons.QuestionCircleOutlined style={{ color: '#8c8c8c' }} />
                    </Tooltip>
                  </Text>
                  <Text strong>{scanRate}%</Text>
                </div>
                <Progress percent={scanRate} status={scanRate === 100 ? 'success' : scanRate > 70 ? 'normal' : 'exception'} />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text strong>
                    Düzgünlük dərəcəsi{' '}
                    <Tooltip title="(Düzgün / Gözlənilən) × 100%">
                      <Icons.QuestionCircleOutlined style={{ color: '#8c8c8c' }} />
                    </Tooltip>
                  </Text>
                  <Text strong>{completionRate}%</Text>
                </div>
                <Progress percent={completionRate} status={completionRate === 100 ? 'success' : completionRate > 80 ? 'normal' : 'exception'} />
              </div>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title="İcra Məlumatları" size="small">
              <Descriptions bordered column={1} size="small">
                <Descriptions.Item label="İcraçı">
                  <Tag color="green" icon={<Icons.UserOutlined />}>
                    {data?.executed_by.name}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Başlanma tarixi">{data?.started_at.value}</Descriptions.Item>
                <Descriptions.Item label="Tamamlanma tarixi">{data?.completed_at.value}</Descriptions.Item>
                <Descriptions.Item label="Hesabat tarixi">{data?.created_at.value}</Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title="Problem Göstəriciləri" size="small">
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <Statistic title="İtkin bağlamalar" value={data?.missing_parcels_count.value} prefix={<Icons.WarningOutlined />} valueStyle={{ color: '#ff4d4f' }} />
                </Col>
                <Col xs={24} sm={12}>
                  <Statistic title="Artıq bağlamalar" value={data?.extra_parcels_count.value} prefix={<Icons.ExclamationCircleOutlined />} valueStyle={{ color: '#fa8c16' }} />
                </Col>
                <Col xs={24} sm={12}>
                  <Statistic title="Başqa filialın bağlamaları" value={data?.foreign_scanned_parcels_count.value} prefix={<Icons.SwapOutlined />} valueStyle={{ color: '#1890ff' }} />
                </Col>
                <Col xs={24} sm={12}>
                  <Statistic title="Düzgün scan edilənlər" value={data?.correct_parcels_count.value} prefix={<Icons.CheckCircleOutlined />} valueStyle={{ color: '#52c41a' }} />
                </Col>
              </Row>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title="Hesabat Xülasəsi" size="small">
              <List size="small">
                <List.Item>
                  <List.Item.Meta avatar={<Icons.CheckCircleOutlined style={{ fontSize: 20, color: '#52c41a' }} />} title={`${data?.correct_parcels_count.value ?? 0} düzgün bağlama`} description="Filialda olmalı idi və düzgün scan edildi" />
                </List.Item>
                <List.Item>
                  <List.Item.Meta avatar={<Icons.WarningOutlined style={{ fontSize: 20, color: '#ff4d4f' }} />} title={`${data?.missing_parcels_count.value ?? 0} itkin bağlama`} description="Filialda olmalı idi, lakin tapılmadı" />
                </List.Item>
                <List.Item>
                  <List.Item.Meta avatar={<Icons.ExclamationCircleOutlined style={{ fontSize: 20, color: '#fa8c16' }} />} title={`${data?.extra_parcels_count.value ?? 0} artıq bağlama`} description="Scan edildi, lakin statusu uyğun deyil" />
                </List.Item>
                <List.Item>
                  <List.Item.Meta avatar={<Icons.SwapOutlined style={{ fontSize: 20, color: '#1890ff' }} />} title={`${data?.foreign_scanned_parcels_count.value ?? 0} yad bağlama`} description="Başqa filialın bağlaması burada tapıldı" />
                </List.Item>
              </List>
            </Card>
          </Col>

          {collapseItems.length > 0 && (
            <Col xs={24}>
              <Card title="Ətraflı Siyahılar" size="small">
                <Collapse accordion items={collapseItems} />
              </Card>
            </Col>
          )}
        </Row>
      </Spin>
    </Modal>
  );
};
