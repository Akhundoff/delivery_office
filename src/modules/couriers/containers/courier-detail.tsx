import { FC } from 'react';
import { Button, Dropdown, MenuProps, Result, Space, Spin, Tooltip } from 'antd';
import * as Icons from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { DetailPage, DetailHeader, DetailCard, DetailDescriptions, DetailRow, DetailCol } from '@shared/styled/detail';
import { useCourierDetail } from '../hooks';
import { CourierStateTag } from '../components/courier-state-tag';

export const CourierDetail: FC<{ id: string }> = ({ id }) => {
  const { data, isLoading, error, statuses, updateStatus, remove, openTimeline, openUpdate } = useCourierDetail(id);

  if (isLoading) {
    return (
      <DetailPage>
        <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
          <Spin size="large" />
        </div>
      </DetailPage>
    );
  }

  if (error || !data) {
    return (
      <DetailPage>
        <Result status="500" title="Xəta baş verdi" subTitle={error || 'Məlumatlar əldə edilə bilmədi'} />
      </DetailPage>
    );
  }

  const statusMenuItems: MenuProps['items'] = statuses.map((s) => ({
    key: s.id,
    label: s.name,
    onClick: () => updateStatus(s.id),
  }));

  const title = (
    <Space size={8}>
      <Icons.LeftCircleOutlined style={{ cursor: 'pointer' }} onClick={() => window.history.back()} />
      <span>#{data.id}</span>
    </Space>
  );

  const tags = (
    <Space size={4}>
      <CourierStateTag id={data.status.id} name={data.status.name} />
    </Space>
  );

  const extra = [
    <Dropdown key="status" menu={{ items: statusMenuItems }} trigger={['click']}>
      <Button ghost type="primary" icon={<Icons.AppstoreOutlined />}>
        Statusu dəyiş
      </Button>
    </Dropdown>,
    <Tooltip key="timeline" title="Status xəritəsi">
      <Button type="link" onClick={openTimeline} icon={<Icons.FieldTimeOutlined />} />
    </Tooltip>,
    <Tooltip key="edit" title="Düzəliş et">
      <Button type="link" onClick={openUpdate} icon={<Icons.EditOutlined />} />
    </Tooltip>,
    <Tooltip key="delete" title="Sil">
      <Button type="link" danger onClick={remove} icon={<Icons.DeleteOutlined />} />
    </Tooltip>,
  ];

  return (
    <DetailPage>
      <DetailRow>
        <DetailCol xs={24}>
          <DetailHeader title={title} subTitle={data.user.name} tags={tags} extra={extra} />
        </DetailCol>
        <DetailCol xs={24} lg={12}>
          <DetailCard title="Ümumi məlumat">
            <DetailDescriptions>
              <DetailDescriptions.Item label="Kod">#{data.id}</DetailDescriptions.Item>
              <DetailDescriptions.Item label="Müştəri">
                <Link to={`/users/${data.user.id}`}>{data.user.name}</Link>
              </DetailDescriptions.Item>
              <DetailDescriptions.Item label="Status">{data.status.name}</DetailDescriptions.Item>
              <DetailDescriptions.Item label="Alıcı">{data.recipient}</DetailDescriptions.Item>
              <DetailDescriptions.Item label="Telefon">{data.phoneNumber}</DetailDescriptions.Item>
              <DetailDescriptions.Item label="Ünvan">{data.address}</DetailDescriptions.Item>
              <DetailDescriptions.Item label="Region">{data.region.name}</DetailDescriptions.Item>
              <DetailDescriptions.Item label="Filial">{data.branch.name}</DetailDescriptions.Item>
              <DetailDescriptions.Item label="Çatdırılma qiyməti">{data.price.toFixed(2)} AZN</DetailDescriptions.Item>
              <DetailDescriptions.Item label="Kuryer qiyməti">{data.courierPrice.toFixed(2)} AZN</DetailDescriptions.Item>
              <DetailDescriptions.Item label="Cəmi qiymət">{data.totalPrice.toFixed(2)} AZN</DetailDescriptions.Item>
              <DetailDescriptions.Item label="Ödənilib">{data.paid ? 'Bəli' : 'Xeyr'}</DetailDescriptions.Item>
              <DetailDescriptions.Item label="Bağlama sayı">
                {data.declarations.quantity} ədəd, {data.declarations.weight.toFixed(2)} kq
              </DetailDescriptions.Item>
              <DetailDescriptions.Item label="Azerpost">{data.isAzerpost ? 'Bəli' : 'Xeyr'}</DetailDescriptions.Item>
              <DetailDescriptions.Item label="Yaradılma tarixi">{data.createdAt}</DetailDescriptions.Item>
            </DetailDescriptions>
          </DetailCard>
        </DetailCol>
        <DetailCol xs={24}>
          <DetailCard title="Açıqlama">{data.description || 'Qeyd olunmayıb'}</DetailCard>
        </DetailCol>
        {data.declarations.items.length > 0 && (
          <DetailCol xs={24}>
            <DetailCard title={`Bağlamalar (${data.declarations.quantity} ədəd, ${data.declarations.weight.toFixed(2)} kq)`}>
              <DetailRow>
                {data.declarations.items.map((d) => (
                  <DetailCol xs={24} md={12} lg={8} key={d.id}>
                    <DetailCard
                      title={
                        <Link to={`/declarations/${d.id}`}>
                          #{d.trackCode} — {d.shop}
                        </Link>
                      }
                    >
                      <DetailDescriptions>
                        <DetailDescriptions.Item label="Q.İ kodu">{d.globalTrackCode || '—'}</DetailDescriptions.Item>
                        <DetailDescriptions.Item label="Çəki">{d.weight.toFixed(2)} kq</DetailDescriptions.Item>
                        <DetailDescriptions.Item label="Çatd. qiymət">{d.deliveryPrice.toFixed(2)} AZN</DetailDescriptions.Item>
                        <DetailDescriptions.Item label="Ödənilib">{d.paid ? 'Bəli' : 'Xeyr'}</DetailDescriptions.Item>
                      </DetailDescriptions>
                    </DetailCard>
                  </DetailCol>
                ))}
              </DetailRow>
            </DetailCard>
          </DetailCol>
        )}
        {data.azerpost && (
          <DetailCol xs={24}>
            <DetailCard title="Azərpoçt məlumatları">
              <DetailDescriptions>
                <DetailDescriptions.Item label="Order ID">{data.azerpost.orderId}</DetailDescriptions.Item>
                <DetailDescriptions.Item label="Vendor ID">{data.azerpost.vendorId}</DetailDescriptions.Item>
                <DetailDescriptions.Item label="Package ID">{data.azerpost.packageId}</DetailDescriptions.Item>
                <DetailDescriptions.Item label="Delivery Post Code">{data.azerpost.deliveryPostCode}</DetailDescriptions.Item>
                <DetailDescriptions.Item label="Package Weight">{data.azerpost.packageWeight}</DetailDescriptions.Item>
                <DetailDescriptions.Item label="Customer Address">{data.azerpost.customerAddress}</DetailDescriptions.Item>
                <DetailDescriptions.Item label="Ad">{data.azerpost.firstName}</DetailDescriptions.Item>
                <DetailDescriptions.Item label="Soyad">{data.azerpost.lastName}</DetailDescriptions.Item>
                <DetailDescriptions.Item label="Email">{data.azerpost.email}</DetailDescriptions.Item>
                <DetailDescriptions.Item label="Telefon">{data.azerpost.phoneNo}</DetailDescriptions.Item>
                <DetailDescriptions.Item label="Delivery Type">{data.azerpost.deliveryType}</DetailDescriptions.Item>
                <DetailDescriptions.Item label="Charge">{data.azerpost.charge}</DetailDescriptions.Item>
                <DetailDescriptions.Item label="Order Status">{data.azerpost.orderStatus}</DetailDescriptions.Item>
                <DetailDescriptions.Item label="Tarix">{data.azerpost.createdAt}</DetailDescriptions.Item>
              </DetailDescriptions>
            </DetailCard>
            {data.azerpost.history.length > 0 && (
              <DetailCard title="Azərpoçt keçmişi">
                <DetailRow>
                  {data.azerpost.history.map((h, i) => (
                    <DetailCol xs={24} md={12} lg={8} key={i}>
                      <DetailCard>
                        <DetailDescriptions>
                          <DetailDescriptions.Item label="Tarix">{h.createdAt}</DetailDescriptions.Item>
                          <DetailDescriptions.Item label="Ətraflı">{h.details}</DetailDescriptions.Item>
                        </DetailDescriptions>
                      </DetailCard>
                    </DetailCol>
                  ))}
                </DetailRow>
              </DetailCard>
            )}
          </DetailCol>
        )}
      </DetailRow>
    </DetailPage>
  );
};
