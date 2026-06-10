import { FC } from 'react';
import { Button, Result, Space, Spin, Tag, Tooltip } from 'antd';
import * as Icons from '@ant-design/icons';
import { DetailPage, DetailHeader, DetailCard, DetailDescriptions, DetailRow, DetailCol } from '@shared/styled/detail';
import { useCourierDetail } from '../hooks';

export const CourierDetail: FC<{ id: string }> = ({ id }) => {
  const { data, isLoading, error, remove, openTimeline, openUpdate } = useCourierDetail(id);

  if (isLoading) {
    return (
      <DetailPage>
        <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
          <Spin size='large' />
        </div>
      </DetailPage>
    );
  }

  if (error || !data) {
    return (
      <DetailPage>
        <Result status='500' title='Xəta baş verdi' subTitle={error || 'Məlumatlar əldə edilə bilmədi'} />
      </DetailPage>
    );
  }

  const title = (
    <Space size={8}>
      <Icons.LeftCircleOutlined style={{ cursor: 'pointer' }} onClick={() => window.history.back()} />
      <span>#{data.id}</span>
    </Space>
  );

  const tags = (
    <Space size={4}>
      <Tag>{data.status.name}</Tag>
    </Space>
  );

  const extra = [
    <Tooltip key='timeline' title='Status xəritəsi'>
      <Button type='link' onClick={openTimeline} icon={<Icons.FieldTimeOutlined />} />
    </Tooltip>,
    <Tooltip key='edit' title='Düzəliş et'>
      <Button type='link' onClick={openUpdate} icon={<Icons.EditOutlined />} />
    </Tooltip>,
    <Tooltip key='delete' title='Sil'>
      <Button type='link' danger onClick={remove} icon={<Icons.DeleteOutlined />} />
    </Tooltip>,
  ];

  return (
    <DetailPage>
      <DetailRow>
        <DetailCol xs={24}>
          <DetailHeader title={title} subTitle={data.user.name} tags={tags} extra={extra} />
        </DetailCol>
        <DetailCol xs={24} lg={12}>
          <DetailCard title='Ümumi məlumat'>
            <DetailDescriptions>
              <DetailDescriptions.Item label='Kod'>#{data.id}</DetailDescriptions.Item>
              <DetailDescriptions.Item label='Müştəri'>{data.user.name}</DetailDescriptions.Item>
              <DetailDescriptions.Item label='Status'>{data.status.name}</DetailDescriptions.Item>
              <DetailDescriptions.Item label='Alıcı'>{data.recipient}</DetailDescriptions.Item>
              <DetailDescriptions.Item label='Telefon'>{data.phoneNumber}</DetailDescriptions.Item>
              <DetailDescriptions.Item label='Ünvan'>{data.address}</DetailDescriptions.Item>
              <DetailDescriptions.Item label='Region'>{data.region.name}</DetailDescriptions.Item>
              <DetailDescriptions.Item label='Filial'>{data.branch.name}</DetailDescriptions.Item>
              <DetailDescriptions.Item label='Çatdırılma qiyməti'>{data.price.toFixed(2)} AZN</DetailDescriptions.Item>
              <DetailDescriptions.Item label='Kuryer qiyməti'>{data.courierPrice.toFixed(2)} AZN</DetailDescriptions.Item>
              <DetailDescriptions.Item label='Cəmi qiymət'>{data.totalPrice.toFixed(2)} AZN</DetailDescriptions.Item>
              <DetailDescriptions.Item label='Ödənilib'>{data.paid ? 'Bəli' : 'Xeyr'}</DetailDescriptions.Item>
              <DetailDescriptions.Item label='Bağlama sayı'>{data.declarations.length}</DetailDescriptions.Item>
              <DetailDescriptions.Item label='Azerpost'>{data.isAzerpost ? 'Bəli' : 'Xeyr'}</DetailDescriptions.Item>
              <DetailDescriptions.Item label='Yaradılma tarixi'>{data.createdAt}</DetailDescriptions.Item>
            </DetailDescriptions>
          </DetailCard>
        </DetailCol>
        <DetailCol xs={24}>
          <DetailCard title='Açıqlama'>{data.description || 'Qeyd olunmayıb'}</DetailCard>
        </DetailCol>
      </DetailRow>
    </DetailPage>
  );
};
