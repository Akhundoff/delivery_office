import React, { FC, useContext } from 'react';
import { Button, Dropdown, Menu, Result, Space, Table, Tag, Tooltip, Spin } from 'antd';
import * as Icons from '@ant-design/icons';
import { useQuery } from 'react-query';

import { DetailActions, DetailActionCol, DetailCard, DetailCol, DetailDescriptions, DetailHeader, DetailPage, DetailRow } from '@shared/styled/detail';
import { SettingsContext } from '@modules/settings';
import { StatusesService } from '@modules/statuses/services';

import { useOrder } from '../hooks';
import { OrderStateTag } from '../components';
import { CouponTags, getCurrencySymbolByCountryId } from '../constants';

export const OrderDetail: FC<{ id: string }> = ({ id }) => {
  const settings = useContext(SettingsContext);
  const { data, isLoading, error, remove, updateStatus, openTimeline, openUpdate, openDeclaration } = useOrder(id);

  const { data: statusesResult } = useQuery(['statuses-for-order-detail', 1], () => StatusesService.getList({ per_page: 500, model_id: 1 }));
  const statuses = statusesResult?.status === 200 ? statusesResult.data.data : [];

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

  const country = settings.getCountry(data.countryId);
  const currency = getCurrencySymbolByCountryId(data.countryId);

  const title = (
    <Space size={8}>
      <Icons.LeftCircleOutlined style={{ cursor: 'pointer' }} onClick={() => window.history.back()} />
      <span>#{data.trackCode}</span>
    </Space>
  );

  const tags = (
    <Space size={4}>
      {country && <Tag>{country.name}</Tag>}
      <OrderStateTag id={data.status.id} name={data.status.name} />
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

        <DetailCol xs={24}>
          <DetailActions>
            <DetailActionCol>
              <Dropdown
                overlay={
                  <Menu>
                    {statuses.map((status) => (
                      <Menu.Item key={status.id} onClick={() => updateStatus(status.id)}>
                        {status.name}
                      </Menu.Item>
                    ))}
                  </Menu>
                }
              >
                <Button type='primary' icon={<Icons.AppstoreOutlined />} ghost>
                  Statusu dəyiş
                </Button>
              </Dropdown>
              {data.product.url && (
                <a href={data.product.url} target='_blank' rel='noreferrer noopener'>
                  <Button type='primary' icon={<Icons.LinkOutlined />} ghost>
                    Sifariş
                  </Button>
                </a>
              )}
            </DetailActionCol>
            <DetailActionCol>
              <Button disabled={!data.declaration} onClick={openDeclaration} type='primary' icon={<Icons.FileSearchOutlined />} ghost>
                Bağlama
              </Button>
            </DetailActionCol>
          </DetailActions>
        </DetailCol>

        <DetailCol xs={24} lg={12}>
          <DetailRow>
            <DetailCol xs={24}>
              <DetailCard title='Ümumi məlumat'>
                <DetailDescriptions>
                  <DetailDescriptions.Item label='İzləmə kodu'>#{data.trackCode}</DetailDescriptions.Item>
                  <DetailDescriptions.Item label='İcraçı'>{data.executor?.name || 'Qeyd olunmayıb'}</DetailDescriptions.Item>
                  <DetailDescriptions.Item label='Gözlənilən tarix'>{data.expectedAt || 'Qeyd olunmayıb'}</DetailDescriptions.Item>
                  <DetailDescriptions.Item label='Redaktə tarixi'>{data.updatedAt || 'Qeyd olunmayıb'}</DetailDescriptions.Item>
                  <DetailDescriptions.Item label='Yaradılma tarixi'>{data.createdAt || 'Qeyd olunmayıb'}</DetailDescriptions.Item>
                </DetailDescriptions>
              </DetailCard>
            </DetailCol>
            <DetailCol xs={24}>
              <DetailCard title='Ödəniş məlumatları'>
                <DetailDescriptions>
                  <DetailDescriptions.Item label='Məhsulun qiyməti'>
                    {data.product.price.toFixed(2)} {currency}
                  </DetailDescriptions.Item>
                  <DetailDescriptions.Item label='Daxili karqo qiyməti'>
                    {data.product.internalShippingPrice ? `${data.product.internalShippingPrice.toFixed(2)} ${currency}` : 'Qeyd olunmayıb'}
                  </DetailDescriptions.Item>
                  <DetailDescriptions.Item label='Status'>{data.paid ? 'Ödənilib' : 'Ödənilməyib'}</DetailDescriptions.Item>
                </DetailDescriptions>
              </DetailCard>
            </DetailCol>
          </DetailRow>
        </DetailCol>

        <DetailCol xs={24} lg={12}>
          <DetailCard title='Məhsul'>
            <DetailDescriptions>
              <DetailDescriptions.Item label='Mağaza'>{data.product.shop || 'Qeyd olunmayıb'}</DetailDescriptions.Item>
              <DetailDescriptions.Item label='Kateqoriya'>{data.product.type?.name || 'Qeyd olunmayıb'}</DetailDescriptions.Item>
              <DetailDescriptions.Item label='Rəng'>{data.product.color || 'Qeyd olunmayıb'}</DetailDescriptions.Item>
              <DetailDescriptions.Item label='Say'>{data.product.quantity} ədəd</DetailDescriptions.Item>
              <DetailDescriptions.Item label='Ölçü'>{data.product.size || 'Qeyd olunmayıb'}</DetailDescriptions.Item>
              <DetailDescriptions.Item label='Kupon'>{data.couponId ? CouponTags[data.couponId] : '-'}</DetailDescriptions.Item>
            </DetailDescriptions>
          </DetailCard>
        </DetailCol>

        {!!data.detailedDebts.length && (
          <DetailCol xs={24}>
            <DetailCard title='Borclar' bodyStyle={{ padding: 0 }}>
              <Table pagination={false} dataSource={data.detailedDebts} rowKey='id' size='small' bordered>
                <Table.Column width={100} key='param' title='Tipi' dataIndex='param' />
                <Table.Column width={150} key='amount' title='Məbləğ' dataIndex={['amount', 'difference']} render={(value) => `${value} ${currency}`} />
                <Table.Column width={150} key='status' title='Status' dataIndex={['status', 'name']} />
                <Table.Column key='description' title='Qeyd' dataIndex='description' />
                <Table.Column width={180} key='createdAt' title='Yaradılıb' dataIndex='createdAt' />
              </Table>
            </DetailCard>
          </DetailCol>
        )}

        <DetailCol xs={data.rejectionReason ? 12 : 24}>
          <DetailCard title='Açıqlama'>{data.description || 'Qeyd olunmayıb'}</DetailCard>
        </DetailCol>
        {data.rejectionReason && (
          <DetailCol xs={12}>
            <DetailCard title='Ləğv olunma səbəbi'>{data.rejectionReason}</DetailCard>
          </DetailCol>
        )}
      </DetailRow>
    </DetailPage>
  );
};
