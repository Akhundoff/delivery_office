import { FC, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { Button, Card, Col, Descriptions, Modal, Result, Row, Space, Spin, Tooltip, message } from 'antd';
import * as Icons from '@ant-design/icons';
import { PageContent } from '@shared/styled/page-content';
import { useBackgroundNavigate } from '@shared/hooks';
import { RefundsService } from '../services';

export const RefundDetails: FC<{ id: string }> = ({ id }) => {
  const navigate = useNavigate();
  const bgNavigate = useBackgroundNavigate();

  const { data, isLoading } = useQuery(['refund-detail', id], async () => {
    const result = await RefundsService.getById(id);
    if (result.status === 200) return result.data;
    throw new Error(result.data as string);
  });

  const remove = useCallback(() => {
    Modal.confirm({
      title: 'Diqqət',
      content: 'İadəni silməyə əminsinizmi?',
      okText: 'Sil',
      okType: 'danger',
      cancelText: 'Ləğv et',
      onOk: async () => {
        const result = await RefundsService.delete([Number(id)]);
        if (result.status === 200) {
          navigate('/refunds');
        } else {
          message.error(result.data as string);
        }
      },
    });
  }, [id, navigate]);

  if (isLoading) {
    return (
      <PageContent>
        <Spin size="large" style={{ display: 'block', padding: 40 }} />
      </PageContent>
    );
  }

  if (!data) {
    return (
      <PageContent>
        <Result status="404" title="İadə tapılmadı" />
      </PageContent>
    );
  }

  return (
    <PageContent>
      <Space style={{ marginBottom: 16 }} size={12}>
        <Icons.LeftCircleOutlined onClick={() => navigate(-1 as any)} style={{ fontSize: 20, cursor: 'pointer' }} />
        <span style={{ fontSize: 18, fontWeight: 600 }}>#{data.id}</span>
        <Tooltip title="Düzəliş et">
          <Button type="link" icon={<Icons.EditOutlined />} onClick={() => bgNavigate(`/refunds/${data.id}/update`, { withBackground: true })} />
        </Tooltip>
        <Tooltip title="Sil">
          <Button type="link" danger icon={<Icons.DeleteOutlined />} onClick={remove} />
        </Tooltip>
      </Space>
      <Row gutter={16}>
        <Col xs={24} lg={12}>
          <Card title="Ümumi məlumat" size="small">
            <Descriptions column={1} size="small" bordered>
              <Descriptions.Item label="Kod">{data.id || 'Qeyd olunmayıb'}</Descriptions.Item>
              <Descriptions.Item label="Müştəri kodu">{data.user?.id || 'Qeyd olunmayıb'}</Descriptions.Item>
              <Descriptions.Item label="Müştəri adı">{data.user?.name || 'Qeyd olunmayıb'}</Descriptions.Item>
              <Descriptions.Item label="Bağlama trak kodu">{data.trackCode || 'Qeyd olunmayıb'}</Descriptions.Item>
              <Descriptions.Item label="Kargo firması">{data.cargo?.name || 'Qeyd olunmayıb'}</Descriptions.Item>
              <Descriptions.Item label="İstiqamət">{data.direction || 'Qeyd olunmayıb'}</Descriptions.Item>
              <Descriptions.Item label="Sənəd">
                {data.file ? (
                  <a href={data.file} target="_blank" rel="noreferrer noopener">
                    Sənədə bax
                  </a>
                ) : (
                  'Mövcud deyil'
                )}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card size="small">
            <Descriptions column={1} size="small" bordered>
              <Descriptions.Item label="İadə numarası">{data.refundNumber || 'Qeyd olunmayıb'}</Descriptions.Item>
              <Descriptions.Item label="Bağlama kateqoriyası">{data.productType?.name || 'Qeyd olunmayıb'}</Descriptions.Item>
              <Descriptions.Item label="Mağaza">{data.shopName || 'Qeyd olunmayıb'}</Descriptions.Item>
              <Descriptions.Item label="Say">{data.quantity || 'Qeyd olunmayıb'}</Descriptions.Item>
              <Descriptions.Item label="Qiymət">{data.price || 'Qeyd olunmayıb'}</Descriptions.Item>
              <Descriptions.Item label="Status">{data.state?.name || 'Qeyd olunmayıb'}</Descriptions.Item>
              <Descriptions.Item label="Şərh">{data.description || 'Qeyd olunmayıb'}</Descriptions.Item>
              <Descriptions.Item label="Yaradılma tarixi">{data.createdAt || 'Qeyd olunmayıb'}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </PageContent>
  );
};
