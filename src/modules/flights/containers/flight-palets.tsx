import { FC, useMemo } from 'react';
import { Col, Descriptions, Result, Row, Spin } from 'antd';
import { useFlightPalets } from '../hooks';
import { IFlightPalet } from '../interfaces';

export const FlightPaletsContainer: FC<{ flightId?: string | number }> = ({ flightId }) => {
  const { data, loading, error } = useFlightPalets(flightId);

  const totalCount = useMemo(() => data.reduce((acc, item) => acc + item.totalCount, 0), [data]);
  const totalWeight = useMemo(() => data.reduce((acc, item) => acc + item.totalWeight, 0), [data]);

  if (loading) return <Spin style={{ display: 'block', margin: '48px auto' }} />;
  if (error) return <Result status='500' title={error} />;
  if (!data.length) return <Result status='404' title='Məlumat tapılmadı' />;

  return (
    <div>
      <Row gutter={[16, 8]} style={{ marginBottom: 16 }}>
        <Col>Toplam bağlama: {totalCount}</Col>
        <Col>Toplam çəki: {totalWeight}</Col>
        <Col>Toplam pallet: {data.length}</Col>
      </Row>
      <Row gutter={[16, 16]}>
        {data.map((item: IFlightPalet) => (
          <Col key={item.id} span={24} lg={8}>
            <Descriptions size='small' bordered={true} column={1}>
              <Descriptions.Item label='Id'>{item.id}</Descriptions.Item>
              <Descriptions.Item label='Box'>{item.box}</Descriptions.Item>
              <Descriptions.Item label='Bağlama sayı'>{item.totalCount}</Descriptions.Item>
              <Descriptions.Item label='Bağlama çəkisi'>{item.totalWeight}</Descriptions.Item>
            </Descriptions>
          </Col>
        ))}
      </Row>
    </div>
  );
};
