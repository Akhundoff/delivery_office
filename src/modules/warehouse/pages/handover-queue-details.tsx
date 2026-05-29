import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Card, Col, Descriptions, Result, Row, Space, Spin } from 'antd';
import * as Icons from '@ant-design/icons';
import { PageContent } from '@shared/styled/page-content';
import { useHandoverQueue } from '../hooks';

export const HandoverQueueDetailsPage: FC = () => {
    const { queueId } = useParams<{ queueId: string }>();
    const { queue, updateStatus, removeMutation, removeItem, handover, remove } = useHandoverQueue(queueId!);

    if (queue.isLoading) {
        return (
            <PageContent>
                <Spin style={{ display: 'block', padding: '60px 0', textAlign: 'center' }} />
            </PageContent>
        );
    }

    if (queue.error) return <PageContent><Result status="500" title={(queue.error as Error).message} /></PageContent>;
    if (!queue.data) return null;

    const data = queue.data;
    const packagesPaid = data.packages && (data.packages.smallPackage || data.packages.mediumPackage || data.packages.bigPackage);

    return (
        <PageContent
            title={`Növbə #${queueId} - ${data.declarations.length} bağlama`}
            extra={
                <Space size={8}>
                    <Button danger loading={removeMutation.isLoading} icon={<Icons.CloseCircleOutlined />} onClick={remove}>
                        Ləğv et
                    </Button>
                    <Button type="primary" loading={updateStatus.isLoading} icon={<Icons.CheckCircleOutlined />} onClick={handover}>
                        Təhvil verdim
                    </Button>
                </Space>
            }
        >
            <Row gutter={[12, 12]}>
                <Col xs={24} lg={12}>
                    <Card size="small" title="Müştəri">
                        <Descriptions column={1} size="small">
                            <Descriptions.Item label="Kod">#{data.user.id}</Descriptions.Item>
                            <Descriptions.Item label="Ad">{data.user.fullName}</Descriptions.Item>
                            <Descriptions.Item label="İcraçı">{data.cashier.fullName || '—'}</Descriptions.Item>
                            <Descriptions.Item label="Status">{data.status.name}</Descriptions.Item>
                        </Descriptions>
                    </Card>
                </Col>
                <Col xs={24} lg={12}>
                    <Card size="small" title="Paketlər">
                        {packagesPaid ? (
                            <Space direction="vertical">
                                <span>Kiçik: {data.packages?.smallPackage}</span>
                                <span>Orta: {data.packages?.mediumPackage}</span>
                                <span>Böyük: {data.packages?.bigPackage}</span>
                            </Space>
                        ) : (
                            <span>Paket üçün ödəniş edilməyib</span>
                        )}
                    </Card>
                </Col>
                {data.boxes.map((box) => (
                    <Col key={box.id} xs={24}>
                        <Card size="small" type="inner" title={`${box.name} - ${box.items.length} bağlama`}>
                            <Row gutter={[12, 12]}>
                                {box.items.map((item) => (
                                    <Col key={item.id} xs={24} lg={6}>
                                        <Card
                                            size="small"
                                            title={item.trackCode}
                                            extra={<Button size="small" onClick={() => removeItem.mutate(item.id)} danger icon={<Icons.DeleteOutlined />} />}
                                        >
                                            <Descriptions column={1} size="small">
                                                <Descriptions.Item label="Məhsul tipi">{item.productType?.name || 'Qeyd olunmayıb'}</Descriptions.Item>
                                                <Descriptions.Item label="Çəki">{item.weight ? `${item.weight} kq` : 'Qeyd olunmayıb'}</Descriptions.Item>
                                                <Descriptions.Item label="Mağaza">{item.shop || 'Qeyd olunmayıb'}</Descriptions.Item>
                                            </Descriptions>
                                        </Card>
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
