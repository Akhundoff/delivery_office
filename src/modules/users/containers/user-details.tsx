import { FC, useCallback } from 'react';
import { Button, Modal, Result, Space, Spin, Statistic, Tag } from 'antd';
import * as Icons from '@ant-design/icons';
import { message } from 'antd';
import dayjs from 'dayjs';

import { useBackgroundNavigate } from '@shared/hooks';
import { DetailCard, DetailCol, DetailDescriptions, DetailHeader, DetailPage, DetailRow } from '@shared/styled/detail';
import { useGetUserById } from '../hooks';
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
    const { data, isLoading, error } = useGetUserById(id);

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
                <Result status='500' title='Xəta baş verdi' subTitle={(error as Error)?.message || 'Məlumatlar əldə edilə bilmədi'} />
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
            {data.isBlocked ? <Tag color='red'>Bloklu</Tag> : <Tag color='green'>Aktiv</Tag>}
        </Space>
    );

    const extra = (
        <Space size={8}>
            <Button type='link' icon={<Icons.EditOutlined />} onClick={() => navigate(`/users/${id}/update`, { withBackground: true })}>
                Düzəliş et
            </Button>
            <Button type='link' danger icon={<Icons.DeleteOutlined />} onClick={onDelete}>
                Sil
            </Button>
        </Space>
    );

    return (
        <DetailPage>
            <DetailRow>
                <DetailCol xs={24}>
                    <DetailHeader title={title} subTitle={`${data.firstname} ${data.lastname}`} tags={tags} extra={extra} />
                </DetailCol>

                <DetailCol xs={24} lg={8}>
                    <DetailCard>
                        <Statistic title='Balans (USD)' value={data.balance.usd} precision={2} prefix='$' />
                    </DetailCard>
                </DetailCol>
                <DetailCol xs={24} lg={8}>
                    <DetailCard>
                        <Statistic title='Balans (TRY)' value={data.balance.try} precision={2} prefix='₺' />
                    </DetailCard>
                </DetailCol>
                <DetailCol xs={24} lg={8}>
                    <DetailCard>
                        <Statistic title='Bəyannamə sayı' value={data.counts.declarations.all} />
                    </DetailCard>
                </DetailCol>

                <DetailCol xs={24} lg={8}>
                    <DetailCard title='Şəxsi məlumatlar'>
                        <DetailDescriptions>
                            <DetailDescriptions.Item label='Ad'>{data.firstname}</DetailDescriptions.Item>
                            <DetailDescriptions.Item label='Soyad'>{data.lastname}</DetailDescriptions.Item>
                            <DetailDescriptions.Item label='Cinsi'>{data.gender === 'male' ? 'Kişi' : 'Qadın'}</DetailDescriptions.Item>
                            <DetailDescriptions.Item label='Təvəllüd'>{data.birthDate ? dayjs(data.birthDate).format('DD.MM.YYYY') : '—'}</DetailDescriptions.Item>
                            <DetailDescriptions.Item label='Ş.V nömrəsi'>{data.passport.number || '—'}</DetailDescriptions.Item>
                            <DetailDescriptions.Item label='FİN kod'>{data.passport.secret || '—'}</DetailDescriptions.Item>
                        </DetailDescriptions>
                    </DetailCard>
                </DetailCol>

                <DetailCol xs={24} lg={8}>
                    <DetailCard title='Sistem məlumatları'>
                        <DetailDescriptions>
                            <DetailDescriptions.Item label='Səlahiyyət'>{roleLabels[data.role] || data.role}</DetailDescriptions.Item>
                            <DetailDescriptions.Item label='Bloklanma statusu'>{data.isBlocked ? 'Bloklanıb' : 'Aktivdir'}</DetailDescriptions.Item>
                            <DetailDescriptions.Item label='Admin filialı'>{data.adminBranchName || '—'}</DetailDescriptions.Item>
                            <DetailDescriptions.Item label='Admin şirkəti'>{data.adminCompanyName || '—'}</DetailDescriptions.Item>
                            <DetailDescriptions.Item label='Yaradılma tarixi'>{dayjs(data.createdAt).format('DD.MM.YYYY HH:mm')}</DetailDescriptions.Item>
                        </DetailDescriptions>
                    </DetailCard>
                </DetailCol>

                <DetailCol xs={24} lg={8}>
                    <DetailCard title='Əlaqə məlumatları'>
                        <DetailDescriptions>
                            <DetailDescriptions.Item label='Email'>{data.email}</DetailDescriptions.Item>
                            <DetailDescriptions.Item label='Telefon'>{data.phoneNumber || '—'}</DetailDescriptions.Item>
                            <DetailDescriptions.Item label='Ünvan'>{data.address || '—'}</DetailDescriptions.Item>
                            <DetailDescriptions.Item label='Filial'>{data.branch.name || '—'}</DetailDescriptions.Item>
                            <DetailDescriptions.Item label='Email bildirişi'>{data.sendEmail ? 'Aktiv' : 'Deaktiv'}</DetailDescriptions.Item>
                            <DetailDescriptions.Item label='SMS bildirişi'>{data.sendSms ? 'Aktiv' : 'Deaktiv'}</DetailDescriptions.Item>
                        </DetailDescriptions>
                    </DetailCard>
                </DetailCol>

                <DetailCol xs={24}>
                    <DetailCard title='Statistika'>
                        <DetailDescriptions column={{ xs: 1, md: 2, lg: 4 } as any}>
                            <DetailDescriptions.Item label='Bəyannamələr (Ümumi)'>{data.counts.declarations.all}</DetailDescriptions.Item>
                            <DetailDescriptions.Item label='Bəyannamələr (Təhvil)'>{data.counts.declarations.handedOver}</DetailDescriptions.Item>
                            <DetailDescriptions.Item label='Sifarişlər (Ümumi)'>{data.counts.orders.all}</DetailDescriptions.Item>
                            <DetailDescriptions.Item label='Sifarişlər (Təhvil)'>{data.counts.orders.handedOver}</DetailDescriptions.Item>
                            <DetailDescriptions.Item label='Kuryerlər (Ümumi)'>{data.counts.couriers.all}</DetailDescriptions.Item>
                            <DetailDescriptions.Item label='Kuryerlər (Təhvil)'>{data.counts.couriers.handedOver}</DetailDescriptions.Item>
                            <DetailDescriptions.Item label='Mədaxil əməliyyatları'>{data.counts.transactions.income}</DetailDescriptions.Item>
                            <DetailDescriptions.Item label='Məxaric əməliyyatları'>{data.counts.transactions.outcome}</DetailDescriptions.Item>
                        </DetailDescriptions>
                    </DetailCard>
                </DetailCol>
            </DetailRow>
        </DetailPage>
    );
};
