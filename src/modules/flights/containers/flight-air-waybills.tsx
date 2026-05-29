import { FC, Fragment } from 'react';
import { Button, Popover, Result, Spin, Table } from 'antd';
import * as Icons from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { PageContent } from '@shared/styled/page-content';
import { useFlightAirWaybills } from '../hooks';

export const FlightAirWaybillsContainer: FC<{ id: string }> = ({ id }) => {
  const navigate = useNavigate();
  const { data, loading, error } = useFlightAirWaybills(id);

  if (loading) return <Spin style={{ display: 'block', margin: '48px auto' }} />;
  if (error) return <Result status='500' title={error} />;

  const popoverContent = data ? (
    <Fragment>
      <p>Toplam depesh sayı: {data.count} ədəd</p>
      <p>Toplam çəki: {data.totalWeight} KG</p>
    </Fragment>
  ) : null;

  return (
    <PageContent>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <Button icon={<Icons.LeftCircleOutlined />} type='text' onClick={() => navigate(`/flights/${id}`)}>
          Geri
        </Button>
        <span style={{ fontWeight: 600 }}>Uçuş #{id} — Göndərilən depeşlər</span>
        {data && (
          <Popover content={popoverContent}>
            <Button icon={<Icons.InfoCircleFilled />} size='small' />
          </Popover>
        )}
      </div>
      <Table size='small' pagination={{ pageSize: 20 }} bordered dataSource={data?.packages || []} rowKey='trackingNumber'>
        <Table.Column dataIndex='trackingNumber' title='Tracking number' />
        <Table.Column dataIndex='dispatchNumber' title='Depesh number' />
        <Table.Column dataIndex='airWaybillNumber' title='Air waybill number' />
        <Table.Column dataIndex='createdAt' title='Tarix' />
      </Table>
    </PageContent>
  );
};
