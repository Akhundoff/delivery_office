import { FC, useContext } from 'react';
import { Button, Descriptions, Dropdown, MenuProps, Modal, Result, Space, Spin, Tag, message } from 'antd';
import * as Icons from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { DetailActions, DetailActionCol, DetailCard, DetailCol, DetailDescriptions, DetailHeader, DetailPage, DetailRow } from '@shared/styled/detail';
import { StatusesService } from '@modules/statuses/services';
import { MeContext } from '@modules/me';
import { useFlightById } from '../hooks';
import { FlightsService } from '../services';

export const FlightDetailsContainer: FC<{ id: string }> = ({ id }) => {
  const navigate = useNavigate();
  const { can } = useContext(MeContext);
  const { data, loading, error, fetch } = useFlightById(id);

  const { data: statusesResult } = useQuery(['statuses-for-flight-detail', 8], () => StatusesService.getList({ per_page: 500, model_id: 8 }));
  const { data: trendyolStatusesResult } = useQuery(['trendyol-statuses-for-flight-detail', 43], () => StatusesService.getList({ per_page: 500, model_id: 43 }));

  const statuses = statusesResult?.status === 200 ? statusesResult.data.data : [];
  const trendyolStatuses = trendyolStatusesResult?.status === 200 ? trendyolStatusesResult.data.data : [];

  const changeStatus = (statusId: number, statusName: string) => {
    Modal.confirm({
      title: 'Diqqət',
      content: `Statusu "${statusName}" olaraq dəyişmək istədiyinizdən əminsinizmi?`,
      onOk: async () => {
        const result = await FlightsService.changeStatus(id, statusId);
        if (result.status === 200) {
          message.success('Status dəyişdirildi');
          fetch();
        } else message.error(result.data as string);
      },
    });
  };

  const changeTrendyolStatus = (statusId: number, statusName: string) => {
    Modal.confirm({
      title: 'Diqqət',
      content: `Trendyol statusunu "${statusName}" olaraq dəyişmək istədiyinizdən əminsinizmi?`,
      onOk: async () => {
        const result = await FlightsService.changeTrendyolStatus(id, statusId);
        if (result.status === 200) {
          message.success('Status dəyişdirildi');
          fetch();
        } else message.error(result.data as string);
      },
    });
  };

  const customsInspection = () => {
    Modal.confirm({
      title: 'Diqqət',
      content: `${data?.total} ədəd bağlama Gömrük rəsmiləşdirilməsi statusuna keçirmək istədiyinizdən əminsinizmi? Bu uçuşdakı bütün bağlamalar dərhal Gömrük rəsmiləşdirilməsi statusuna keçiriləcək.`,
      okText: 'Bəli',
      cancelText: 'Xeyr',
      onOk: async () => {
        message.loading({ key: 'customs', content: 'Gözləyin...', duration: 0 });
        const result = await FlightsService.setCustomsClearance(id);
        if (result.status === 200) {
          message.success({ key: 'customs', content: 'Status dəyişdirildi' });
          fetch();
        } else {
          message.error({ key: 'customs', content: result.data as string });
        }
      },
    });
  };

  const statusMenuItems: MenuProps['items'] = statuses.map((s) => ({ key: s.id, label: s.name, onClick: () => changeStatus(s.id, s.name) }));
  const trendyolStatusMenuItems: MenuProps['items'] = trendyolStatuses.map((s) => ({ key: s.id, label: s.name, onClick: () => changeTrendyolStatus(s.id, s.name) }));

  if (loading) {
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

  const title = (
    <Space size={8}>
      <Icons.LeftCircleOutlined style={{ cursor: 'pointer' }} onClick={() => navigate(-1)} />
      <span>
        #{data.id} — {data.name}
      </span>
    </Space>
  );

  const extra = [
    <Button key="airwaybills" type="text" icon={<Icons.FieldTimeOutlined />} onClick={() => navigate(`/flights/${id}/air-waybills`)}>
      Depeşlər
    </Button>,
    <Button key="packages" type="text" icon={<Icons.UnorderedListOutlined />} onClick={() => navigate(`/flights/${id}/packages`)}>
      Paketlər
    </Button>,
    ...(data.trendyol === 1
      ? [
          <Button key="palets" type="text" icon={<Icons.AppstoreOutlined />} onClick={() => navigate(`/flights/${id}/palets`)}>
            Paletlər
          </Button>,
        ]
      : []),
  ];

  return (
    <DetailPage>
      <DetailRow>
        <DetailCol xs={24}>
          <DetailHeader title={title} extra={extra} />
        </DetailCol>
        <DetailCol xs={24}>
          <DetailActions>
            <DetailActionCol>
              <Dropdown menu={{ items: statusMenuItems }}>
                <Button type="primary" ghost icon={<Icons.EditFilled />}>
                  Statusu dəyiş
                </Button>
              </Dropdown>
              {data.trendyol === 1 && (
                <Dropdown menu={{ items: trendyolStatusMenuItems }}>
                  <Button type="primary" ghost icon={<Icons.EditFilled />}>
                    Trendyol Statusu dəyiş
                  </Button>
                </Dropdown>
              )}
              {data.trendyol === 0 && can('parcel_state_bulk_change') && (
                <Button type="primary" ghost icon={<Icons.SafetyCertificateOutlined />} onClick={customsInspection}>
                  Gömrük yoxlanışında
                </Button>
              )}
              <Button type="primary" ghost icon={<Icons.CalendarOutlined />} onClick={() => navigate(`/flights/${id}/current-month/update`)}>
                Cari ayı dəyiş
              </Button>
              <Button type="primary" ghost icon={<Icons.UploadOutlined />} onClick={() => navigate(`/flights/${id}/manifest/upload`)}>
                Manifest yüklə
              </Button>
              <Button type="primary" ghost icon={<Icons.EditOutlined />} onClick={() => navigate(`/flights/${id}/update`)}>
                Düzəliş et
              </Button>
              {data.status.id === 29 && (
                <Dropdown
                  menu={{
                    items: [
                      { key: 'with-dispatch', label: 'Depeşli', onClick: () => navigate(`/flights/${id}/close/with-dispatch`) },
                      { key: 'without-dispatch', label: 'Depeşsiz', onClick: () => navigate(`/flights/${id}/close/without-dispatch`) },
                      { key: 'all', label: 'Hamısı', onClick: () => navigate(`/flights/${id}/close/all`) },
                    ],
                  }}
                >
                  <Button type="primary" ghost icon={<Icons.LockOutlined />}>
                    Uçuşu bağla
                  </Button>
                </Dropdown>
              )}
            </DetailActionCol>
          </DetailActions>
        </DetailCol>
        <DetailCol xs={24} lg={12}>
          <DetailCard title="Ümumi məlumat">
            <DetailDescriptions>
              <Descriptions.Item label="Kod">{data.id}</Descriptions.Item>
              <Descriptions.Item label="Ad">{data.name}</Descriptions.Item>
              <Descriptions.Item label="Başlama tarixi">{data.startedAt || '—'}</Descriptions.Item>
              <Descriptions.Item label="Bitmə tarixi">{data.endedAt || '—'}</Descriptions.Item>
              <Descriptions.Item label="Yaradılma tarixi">{data.createdAt || '—'}</Descriptions.Item>
              <Descriptions.Item label="Ölkə">{data.country?.name || '—'}</Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag>{data.status.name}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Qaimə">{data.airwaybill || '—'}</Descriptions.Item>
              <Descriptions.Item label="Provayder">{data.trendyol === 1 ? 'Trendyol' : data.trendyol === 2 ? 'Temu' : 'Daxili'}</Descriptions.Item>
            </DetailDescriptions>
          </DetailCard>
        </DetailCol>
        <DetailCol xs={24} lg={12}>
          <DetailCard title="Statistika">
            <DetailDescriptions>
              <Descriptions.Item label="Bağlama sayı">{data.total}</Descriptions.Item>
              <Descriptions.Item label="Tamamlanma">
                {data.completedDeclarations}/{data.total}
              </Descriptions.Item>
              <Descriptions.Item label="Çəki">{data.weight} kg</Descriptions.Item>
              <Descriptions.Item label="Həcmi çəki">{data.volume} kg</Descriptions.Item>
              <Descriptions.Item label="Məbləğ">{data.productPrice} ₺</Descriptions.Item>
              <Descriptions.Item label="Çat. məbləği">{data.deliveryPrice} $</Descriptions.Item>
            </DetailDescriptions>
          </DetailCard>
        </DetailCol>
      </DetailRow>
    </DetailPage>
  );
};
