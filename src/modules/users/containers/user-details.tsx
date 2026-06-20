import { FC, useCallback, useContext } from 'react';
import { Button, Dropdown, Modal, Result, Space, Spin, Statistic, Table, Tag, Tooltip, message } from 'antd';
import * as Icons from '@ant-design/icons';
import dayjs from 'dayjs';

import { useBackgroundNavigate } from '@shared/hooks';
import { DetailCard, DetailCol, DetailDescriptions, DetailHeader, DetailPage, DetailRow } from '@shared/styled/detail';
import { MeContext } from '@modules/me';
import { useGetUserById, useGetDiscountStats } from '../hooks';
import { UsersService } from '../services';

const roleLabels: Record<string, string> = {
  admin: 'Admin',
  warehouseman: 'Anbardar',
  'back-office': 'Back Office',
  partner: 'Partner',
  user: 'İstifadəçi',
};

const roleColors: Record<string, string> = {
  admin: 'red',
  warehouseman: 'blue',
  'back-office': 'orange',
  partner: 'purple',
  user: 'green',
};

export const UserDetails: FC<{ id: string }> = ({ id }) => {
  const navigate = useBackgroundNavigate();
  const { can } = useContext(MeContext);
  const { data, isLoading, error, refetch } = useGetUserById(id);
  const stats = useGetDiscountStats(id);

  const onDelete = useCallback(() => {
    Modal.confirm({
      title: 'İstifadəçini sil',
      content: 'Bu əməliyyat geri alına bilməz. Davam etmək istəyirsiniz?',
      okText: 'Sil',
      okType: 'danger',
      cancelText: 'Ləğv et',
      onOk: async () => {
        const result = await UsersService.deleteUser(id);
        if (result.status === 200) {
          message.success('İstifadəçi silindi');
          navigate('/users', { withBackground: false });
        } else {
          message.error(result.data as string);
        }
      },
    });
  }, [id, navigate]);

  const onToggleBlock = useCallback(() => {
    if (!data) return;
    Modal.confirm({
      title: 'Diqqət',
      content: data.isBlocked ? 'İstifadəçini blokdan çıxarmağa əminsinizmi?' : 'İstifadəçini bloklamağa əminsinizmi?',
      okText: 'Bəli',
      cancelText: 'Ləğv et',
      onOk: async () => {
        const result = await UsersService.blockUsers([id], !data.isBlocked);
        if (result.status === 200) refetch();
        else message.error(result.data as string);
      },
    });
  }, [data, id, refetch]);

  const onUpdateRole = useCallback(
    (role: string) => {
      Modal.confirm({
        title: 'Diqqət',
        content: 'Səlahiyyəti dəyişməyə əminsinizmi?',
        okText: 'Bəli',
        cancelText: 'Ləğv et',
        onOk: async () => {
          const result = await UsersService.updateUserRole([id], role);
          if (result.status === 200) refetch();
          else message.error(result.data as string);
        },
      });
    },
    [id, refetch],
  );

  const onDeleteDiscount = useCallback(
    (discountId: number) => {
      Modal.confirm({
        title: 'Endirimi sil',
        content: 'Endirimi silməyə əminsinizmi?',
        okText: 'Sil',
        okType: 'danger',
        cancelText: 'Ləğv et',
        onOk: async () => {
          const result = await UsersService.removeDiscount(discountId);
          if (result.status === 200) refetch();
          else message.error(result.data as string);
        },
      });
    },
    [refetch],
  );

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
        <Result status="500" title="Xəta baş verdi" subTitle={(error as Error)?.message || 'Məlumatlar əldə edilə bilmədi'} />
      </DetailPage>
    );
  }

  const title = (
    <Space size={8}>
      <Icons.LeftCircleOutlined style={{ cursor: 'pointer' }} onClick={() => navigate(-1)} />
      <span>#{data.id}</span>
    </Space>
  );

  const tags = (
    <Space size={4}>
      <Tag color={roleColors[data.role]}>{roleLabels[data.role] || data.role}</Tag>
      {data.isBlocked ? <Tag color="red">Bloklu</Tag> : <Tag color="green">Aktiv</Tag>}
    </Space>
  );

  const roleMenuItems = [
    { key: 'client', label: 'Müştəri', onClick: () => onUpdateRole('client') },
    { key: 'admin', label: 'Admin', onClick: () => onUpdateRole('admin') },
    { key: 'warehouseman', label: 'Anbardar', onClick: () => onUpdateRole('warehouseman') },
    { key: 'back-office', label: 'Back Office', onClick: () => onUpdateRole('back-office') },
    { key: 'partner', label: 'Partner', onClick: () => onUpdateRole('partner') },
  ];

  const extra = (
    <Space size={8}>
      {data.role !== 'user' && can('changeuserpermissions') && (
        <Tooltip title="İcazələr">
          <Button type="link" icon={<Icons.SettingOutlined />} onClick={() => navigate(`/users/${id}/permissions`, { withBackground: true })} />
        </Tooltip>
      )}
      <Dropdown menu={{ items: roleMenuItems }} trigger={['click']}>
        <Tooltip title="Səlahiyyəti dəyiş">
          <Button type="link" icon={<Icons.AppstoreAddOutlined />} />
        </Tooltip>
      </Dropdown>
      <Tooltip title={data.isBlocked ? 'Blokdan çıxar' : 'Blokla'}>
        <Button type="link" icon={data.isBlocked ? <Icons.UnlockOutlined /> : <Icons.LockOutlined />} onClick={onToggleBlock} />
      </Tooltip>
      <Button type="link" icon={<Icons.EditOutlined />} onClick={() => navigate(`/users/${id}/update`, { withBackground: true })}>
        Düzəliş et
      </Button>
      <Button type="link" danger icon={<Icons.DeleteOutlined />} onClick={onDelete}>
        Sil
      </Button>
    </Space>
  );

  const navButtons = (
    <Space wrap size={8}>
      <Tooltip title={`Ümumi: ${data.counts.orders.all} | Təhvil: ${data.counts.orders.handedOver}`}>
        <Button ghost type="primary" onClick={() => navigate(`/orders?user_id=${data.id}`, { withBackground: false })}>
          Sifarişlər
        </Button>
      </Tooltip>
      <Tooltip title={`Ümumi: ${data.counts.declarations.all} | Təhvil: ${data.counts.declarations.handedOver}`}>
        <Button ghost type="primary" onClick={() => navigate(`/declarations?user_id=${data.id}`, { withBackground: false })}>
          Bağlamalar
        </Button>
      </Tooltip>
      <Tooltip title={`Ümumi: ${data.counts.couriers.all} | Təhvil: ${data.counts.couriers.handedOver}`}>
        <Button ghost type="primary" onClick={() => navigate(`/couriers?user_id=${data.id}`, { withBackground: false })}>
          Kuryerlər
        </Button>
      </Tooltip>
      <Tooltip title={`Mədaxil: ${data.counts.transactions.income} | Məxaric: ${data.counts.transactions.outcome}`}>
        <Button ghost type="primary" onClick={() => navigate(`/balance?user_id=${data.id}`, { withBackground: false })}>
          Balans əməliyyatları
        </Button>
      </Tooltip>
      <Button ghost type="primary" onClick={() => navigate(`/notifier/email?user_id=${data.id}`, { withBackground: false })}>
        Emaillər
      </Button>
      <Button ghost type="primary" onClick={() => navigate(`/notifier/sms?user_id=${data.id}`, { withBackground: false })}>
        SMSlər
      </Button>
      {can('user_discount') && (
        <Button ghost type="primary" onClick={() => navigate(`/users/${id}/create-discount`, { withBackground: true })}>
          Endirim tətbiq et
        </Button>
      )}
    </Space>
  );

  return (
    <DetailPage>
      <DetailRow>
        <DetailCol xs={24}>
          <DetailHeader title={title} subTitle={`${data.firstname} ${data.lastname}`} tags={tags} extra={extra} />
        </DetailCol>

        <DetailCol xs={24}>{navButtons}</DetailCol>

        <DetailCol xs={24} lg={4}>
          <DetailCard>
            <Statistic title="Balans (USD)" value={data.balance.usd} precision={2} prefix="$" />
          </DetailCard>
        </DetailCol>
        <DetailCol xs={24} lg={4}>
          <DetailCard>
            <Statistic title="Balans (TRY)" value={data.balance.try} precision={2} prefix="₺" />
          </DetailCard>
        </DetailCol>
        <DetailCol xs={24} lg={4}>
          <DetailCard>
            <Statistic title="Borc (TRY)" value={data.debt.try} precision={2} prefix="₺" />
          </DetailCard>
        </DetailCol>
        <DetailCol xs={24} lg={4}>
          <DetailCard>
            <Statistic title="Cari ay (USD)" value={data.spending.currentMonth.usd} precision={2} prefix="$" />
          </DetailCard>
        </DetailCol>
        <DetailCol xs={24} lg={8}>
          <DetailCard>
            <Statistic title="Cari ay kəşbək" value={data.cashback.currentCashback} precision={2} suffix="$" prefix={<Icons.PercentageOutlined />} />
          </DetailCard>
        </DetailCol>

        <DetailCol xs={24} lg={8}>
          <DetailCard title="Şəxsi məlumatlar">
            <DetailDescriptions>
              <DetailDescriptions.Item label="Ad">{data.firstname}</DetailDescriptions.Item>
              <DetailDescriptions.Item label="Soyad">{data.lastname}</DetailDescriptions.Item>
              <DetailDescriptions.Item label="Cinsi">{data.gender === 'male' ? 'Kişi' : 'Qadın'}</DetailDescriptions.Item>
              <DetailDescriptions.Item label="Təvəllüd">{data.birthDate ? dayjs(data.birthDate).format('DD.MM.YYYY') : '—'}</DetailDescriptions.Item>
              <DetailDescriptions.Item label="Ş.V nömrəsi">{data.passport.number || '—'}</DetailDescriptions.Item>
              <DetailDescriptions.Item label="FİN kod">{data.passport.secret || '—'}</DetailDescriptions.Item>
            </DetailDescriptions>
          </DetailCard>
        </DetailCol>

        <DetailCol xs={24} lg={8}>
          <DetailCard title="Sistem məlumatları">
            <DetailDescriptions>
              <DetailDescriptions.Item label="Səlahiyyət">{roleLabels[data.role] || data.role}</DetailDescriptions.Item>
              <DetailDescriptions.Item label="Bloklanma statusu">{data.isBlocked ? 'Bloklanıb' : 'Aktivdir'}</DetailDescriptions.Item>
              <DetailDescriptions.Item label="Admin filialı">{data.adminBranchName || '—'}</DetailDescriptions.Item>
              <DetailDescriptions.Item label="Admin şirkəti">{data.adminCompanyName || '—'}</DetailDescriptions.Item>
              <DetailDescriptions.Item label="Yaradılma tarixi">{dayjs(data.createdAt).format('DD.MM.YYYY HH:mm')}</DetailDescriptions.Item>
            </DetailDescriptions>
          </DetailCard>
        </DetailCol>

        <DetailCol xs={24} lg={8}>
          <DetailCard title="Əlaqə məlumatları">
            <DetailDescriptions>
              <DetailDescriptions.Item label="Email">{data.email}</DetailDescriptions.Item>
              <DetailDescriptions.Item label="Telefon">
                <Space size={8}>
                  <span>{data.phoneNumber || '—'}</span>
                  {data.phoneNumber && (
                    <a href={`https://wa.me/${data.phoneNumber.replace(/\D/g, '')}`} target="_blank" rel="noreferrer">
                      <Icons.WhatsAppOutlined style={{ color: '#25d366', fontSize: 16 }} />
                    </a>
                  )}
                </Space>
              </DetailDescriptions.Item>
              <DetailDescriptions.Item label="Ünvan">{data.address || '—'}</DetailDescriptions.Item>
              <DetailDescriptions.Item label="Filial">{data.branch.name || '—'}</DetailDescriptions.Item>
              <DetailDescriptions.Item label="Email bildirişi">{data.sendEmail ? 'Aktiv' : 'Deaktiv'}</DetailDescriptions.Item>
              <DetailDescriptions.Item label="SMS bildirişi">{data.sendSms ? 'Aktiv' : 'Deaktiv'}</DetailDescriptions.Item>
            </DetailDescriptions>
          </DetailCard>
        </DetailCol>

        <DetailCol xs={24} lg={8}>
          <DetailCard title="Kəşbək məlumatları">
            <DetailDescriptions>
              <DetailDescriptions.Item label="Cari ay kəşbək">{data.cashback.currentCashback} $</DetailDescriptions.Item>
              <DetailDescriptions.Item label="Təsdiqlənmiş kəşbək">{data.cashback.totalCashbackApproved} $</DetailDescriptions.Item>
              <DetailDescriptions.Item label="Gözlənilən kəşbək">{data.cashback.totalCashbackPending} $</DetailDescriptions.Item>
            </DetailDescriptions>
          </DetailCard>
        </DetailCol>

        <DetailCol xs={24} lg={8}>
          <DetailCard title="Statistika">
            <DetailDescriptions column={{ xs: 1, md: 2 } as any}>
              <DetailDescriptions.Item label="Bəyannamələr (Ümumi)">{data.counts.declarations.all}</DetailDescriptions.Item>
              <DetailDescriptions.Item label="Bəyannamələr (Təhvil)">{data.counts.declarations.handedOver}</DetailDescriptions.Item>
              <DetailDescriptions.Item label="Sifarişlər (Ümumi)">{data.counts.orders.all}</DetailDescriptions.Item>
              <DetailDescriptions.Item label="Sifarişlər (Təhvil)">{data.counts.orders.handedOver}</DetailDescriptions.Item>
              <DetailDescriptions.Item label="Kuryerlər (Ümumi)">{data.counts.couriers.all}</DetailDescriptions.Item>
              <DetailDescriptions.Item label="Kuryerlər (Təhvil)">{data.counts.couriers.handedOver}</DetailDescriptions.Item>
              <DetailDescriptions.Item label="Mədaxil əməliyyatları">{data.counts.transactions.income}</DetailDescriptions.Item>
              <DetailDescriptions.Item label="Məxaric əməliyyatları">{data.counts.transactions.outcome}</DetailDescriptions.Item>
            </DetailDescriptions>
          </DetailCard>
        </DetailCol>

        <DetailCol xs={24} lg={12}>
          <DetailCard title="Endirimlər">
            {data.discounts.length ? (
              <Table rowKey="id" size="small" bordered pagination={false} dataSource={data.discounts}>
                <Table.Column dataIndex="id" title="Kod" width={60} />
                <Table.Column dataIndex="countryName" title="Ölkə" />
                <Table.Column dataIndex="causerName" title="Kim tərəfindən" />
                <Table.Column dataIndex="discount" title="Endirim (%)" />
                <Table.Column dataIndex="discountDate" title="Tarix" />
                <Table.Column dataIndex="descr" title="Qeyd" />
                <Table.Column
                  key="actions"
                  width={60}
                  render={(_: any, row: any) => (
                    <Button size="small" danger onClick={() => onDeleteDiscount(row.id)}>
                      Sil
                    </Button>
                  )}
                />
              </Table>
            ) : (
              <span style={{ color: '#999' }}>Endirim yoxdur</span>
            )}
          </DetailCard>
        </DetailCol>

        <DetailCol xs={24} lg={12}>
          <DetailCard title="Aylıq statistika">
            {stats.data?.length ? (
              <Table rowKey="date" size="small" bordered pagination={false} dataSource={stats.data} loading={stats.isLoading}>
                <Table.Column dataIndex="monthName" title="Ay" />
                <Table.Column dataIndex="weight" title="Çəki" />
                <Table.Column dataIndex="quantity" title="Say" />
                <Table.Column dataIndex="deliveryPrice" title="Çatdırılma qiyməti" />
              </Table>
            ) : (
              <span style={{ color: '#999' }}>Bağlaması yoxdur</span>
            )}
          </DetailCard>
        </DetailCol>
      </DetailRow>
    </DetailPage>
  );
};
