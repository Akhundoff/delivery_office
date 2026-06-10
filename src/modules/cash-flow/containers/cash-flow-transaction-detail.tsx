import { FC, Fragment, useContext } from 'react';
import { Button, Result, Space, Spin, Tooltip } from 'antd';
import * as Icons from '@ant-design/icons';
import { NavLink, useNavigate } from 'react-router-dom';
import { MeContext } from '@modules/me/context/context';
import { DetailCard, DetailCol, DetailDescriptions, DetailHeader, DetailPage, DetailRow } from '@shared/styled/detail';
import { useCashFlowTransactionDetail } from '../hooks';

const renderType = (value: string) => {
  if (value === 'income') return 'Mədaxil';
  if (value === 'expense') return 'Məxaric';
  return null;
};

export const CashFlowTransactionDetail: FC<{ id: string }> = ({ id }) => {
  const navigate = useNavigate();
  const { can } = useContext(MeContext);
  const { data, isLoading, remove } = useCashFlowTransactionDetail(id);

  if (isLoading)
    return (
      <DetailPage>
        <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
          <Spin size='large' />
        </div>
      </DetailPage>
    );

  if (!data)
    return (
      <DetailPage>
        <Result status='404' title='Məlumat tapılmadı' />
      </DetailPage>
    );

  const title = (
    <Space size={8}>
      <Icons.LeftCircleOutlined style={{ cursor: 'pointer' }} onClick={() => navigate(-1)} />
      <span>Tranzaksiya - {data.id}</span>
    </Space>
  );

  const extra = can('cashbox_operations.cud')
    ? [
        <Tooltip key='edit' title='Düzəliş et'>
          <NavLink to={`/cash-flow/transactions/${id}/update`}>
            <Button type='link' icon={<Icons.EditOutlined />} />
          </NavLink>
        </Tooltip>,
        <Tooltip key='delete' title='Sil'>
          <Button type='link' danger onClick={remove} icon={<Icons.DeleteOutlined />} />
        </Tooltip>,
      ]
    : [];

  return (
    <DetailPage>
      <DetailHeader title={title} subTitle={data.executor.name} extra={extra} />
      <DetailRow>
        <DetailCol xs={24} lg={12}>
          <DetailCard title='Ümumi məlumat'>
            <DetailDescriptions>
              <DetailDescriptions.Item label='Kod'>#{data.id}</DetailDescriptions.Item>
              <DetailDescriptions.Item label='İcraçı'>{data.executor.name}</DetailDescriptions.Item>
              {data.isTransfer && (
                <Fragment>
                  <DetailDescriptions.Item label='Əməliyyat'>{renderType(data.type)}</DetailDescriptions.Item>
                  <DetailDescriptions.Item label='Kateqoriya'>
                    {data.operation.name} - {data.operation.child.name}
                  </DetailDescriptions.Item>
                  <DetailDescriptions.Item label='Status'>{data.status.name}</DetailDescriptions.Item>
                </Fragment>
              )}
              <DetailDescriptions.Item label='Əməliyyat tarixi'>{data.operatedAt}</DetailDescriptions.Item>
              <DetailDescriptions.Item label='Yaradılma tarixi'>{data.createdAt}</DetailDescriptions.Item>
            </DetailDescriptions>
          </DetailCard>
        </DetailCol>

        {!data.isTransfer && (
          <DetailCol xs={24} lg={12}>
            <DetailCard title='Xüsusi məlumat'>
              <DetailDescriptions>
                <DetailDescriptions.Item label='Hesab'>{data.cashRegister.name}</DetailDescriptions.Item>
                <DetailDescriptions.Item label='Əvvəlki balans'>
                  {data.balance.previous} {data.cashRegister.currency.code}
                </DetailDescriptions.Item>
                <DetailDescriptions.Item label='Məbləğ'>
                  {data.amount} {data.cashRegister.currency.code}
                </DetailDescriptions.Item>
                <DetailDescriptions.Item label='Əməliyyat'>{renderType(data.type)}</DetailDescriptions.Item>
                <DetailDescriptions.Item label='Kateqoriya'>
                  {data.operation.name} - {data.operation.child.name}
                </DetailDescriptions.Item>
                <DetailDescriptions.Item label='Status'>{data.status.name}</DetailDescriptions.Item>
              </DetailDescriptions>
            </DetailCard>
          </DetailCol>
        )}

        {data.isTransfer && data.target && (
          <DetailCol xs={24} lg={12}>
            <DetailRow>
              <DetailCol xs={24}>
                <DetailCard title='Kassadan'>
                  <DetailDescriptions>
                    <DetailDescriptions.Item label='Hesab'>{data.cashRegister.name}</DetailDescriptions.Item>
                    <DetailDescriptions.Item label='Məbləğ'>
                      {data.amount} {data.cashRegister.currency.code}
                    </DetailDescriptions.Item>
                    <DetailDescriptions.Item label='Əvvəlki hesab'>{data.balance.previous}</DetailDescriptions.Item>
                  </DetailDescriptions>
                </DetailCard>
              </DetailCol>
              <DetailCol xs={24}>
                <DetailCard title='Kassaya'>
                  <DetailDescriptions>
                    <DetailDescriptions.Item label='Hesab'>{data.target.cashRegister.name}</DetailDescriptions.Item>
                    <DetailDescriptions.Item label='Məbləğ'>
                      {data.target.amount} {data.target.cashRegister.currency.code}
                    </DetailDescriptions.Item>
                    <DetailDescriptions.Item label='Əvvəlki hesab'>{data.transferBalance.previous}</DetailDescriptions.Item>
                  </DetailDescriptions>
                </DetailCard>
              </DetailCol>
            </DetailRow>
          </DetailCol>
        )}
      </DetailRow>
      <DetailCard title='Açıqlama'>{data.description || 'Qeyd olunmayıb'}</DetailCard>
    </DetailPage>
  );
};
