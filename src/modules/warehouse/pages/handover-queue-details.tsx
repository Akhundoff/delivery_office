import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Avatar, Button, Card, Col, Result, Row, Space, Spin } from 'antd';
import * as Icons from '@ant-design/icons';
import { PageContent } from '@shared/styled/page-content';
import { HandoverItemCard, HandoverItemInfo } from '../components';
import { useHandoverQueue } from '../hooks';
import { defaultFilterEnabled } from '../utils';

export const HandoverQueueDetailsPage: FC = () => {
  const hasPrintedRef = useRef(false);
  const { queueId } = useParams<{ queueId: string }>();
  const [checkPrint] = useState(defaultFilterEnabled());
  const { queue, updateStatus, removeMutation, removeItem, handover, remove, handlePrint } = useHandoverQueue(queueId!);

  useEffect(() => {
    if (queue.data && checkPrint && !hasPrintedRef.current) {
      handlePrint(queue.data);
      hasPrintedRef.current = true;
    }
  }, [checkPrint, queue.data, handlePrint]);

  const renderPackage = useMemo(() => {
    if (!queue.data) return null;
    if (queue.data.packages && Object.values(queue.data.packages).every((elem) => elem === 0)) return <span>Paket üçün ödəniş edilməyib</span>;
    return (
      <Space direction="vertical">
        <span>Kiçik: {queue.data?.packages?.smallPackage}</span>
        <span>Orta: {queue.data?.packages?.mediumPackage}</span>
        <span>Böyük: {queue.data?.packages?.bigPackage}</span>
      </Space>
    );
  }, [queue.data]);

  if (queue.isLoading) {
    return (
      <PageContent>
        <Spin style={{ display: 'block', padding: '60px 0', textAlign: 'center' }} />
      </PageContent>
    );
  }

  if (queue.error)
    return (
      <PageContent>
        <Result status="500" title={(queue.error as Error).message} />
      </PageContent>
    );
  if (!queue.data) return null;

  const data = queue.data;

  return (
    <PageContent
      title={`Növbə #${queueId} - ${data.declarations.length} bağlama`}
      extra={
        <Space size={8}>
          <Button loading={queue.isLoading} icon={<Icons.PrinterOutlined />} onClick={() => handlePrint()}>
            Çap et
          </Button>
          <Button danger loading={removeMutation.isLoading} icon={<Icons.CheckCircleOutlined />} onClick={remove}>
            Ləğv et
          </Button>
          <Button type="primary" loading={updateStatus.isLoading} icon={<Icons.CheckCircleOutlined />} onClick={handover}>
            Təhvil verdim
          </Button>
        </Space>
      }
    >
      <Space style={{ width: '100%', justifyContent: 'space-between', paddingRight: 150, marginBottom: 16 }}>
        <Space>
          <Avatar src="https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png" />
          <div>
            <div style={{ fontWeight: 600 }}>#{data.user.id}</div>
            <div>{data.user.fullName}</div>
          </div>
        </Space>
        {renderPackage}
      </Space>
      <Row gutter={[12, 12]}>
        {data.boxes.map((box) => (
          <Col key={box.id} xs={24}>
            <Card size="small" type="inner" title={`${box.name} - ${box.items.length} bağlama`}>
              <Row gutter={[12, 12]}>
                {box.items.map((item) => (
                  <Col key={item.id} xs={24} lg={6}>
                    <HandoverItemCard extra={<Button onClick={() => removeItem.mutate(item.id)} danger icon={<Icons.DeleteOutlined />} />} title={item.trackCode}>
                      <HandoverItemInfo size="small" column={1}>
                        <HandoverItemInfo.Item label="Məhsul tipi">{item.productType?.name || 'Qeyd olunmayıb'}</HandoverItemInfo.Item>
                        <HandoverItemInfo.Item label="Çəki">{item.weight ? item.weight + ' kq' : 'Qeyd olunmayıb'}</HandoverItemInfo.Item>
                        <HandoverItemInfo.Item label="Mağaza">{item.shop || 'Qeyd olunmayıb'}</HandoverItemInfo.Item>
                      </HandoverItemInfo>
                    </HandoverItemCard>
                  </Col>
                ))}
              </Row>
            </Card>
          </Col>
        ))}
      </Row>
    </PageContent>
  );
};
