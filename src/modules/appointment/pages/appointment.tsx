import { FC, Fragment, useMemo, useState } from 'react';
import { Card, Col, Descriptions, Menu, Result, Row, Spin, Statistic, Tag } from 'antd';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import * as Icons from '@ant-design/icons';
import { Column } from 'react-table';

import { PageContent } from '@shared/styled/page-content';
import { HeadPortal } from '@modules/layout/components/head-portal';
import { StyledActionBar } from '@shared/styled/action-bar';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { NextTable } from '@shared/modules/next-table/containers';
import { nextTableColumns } from '@shared/modules/next-table/helpers/next-table-columns';

import { UsersService } from '@modules/users/services';
import { IDeclaration } from '@modules/declarations/interfaces';
import { declarationsTableFetchUseCase } from '@modules/declarations/use-cases/declarations-table-fetch';
import { IOrder } from '@modules/orders/interfaces';
import { ordersTableFetchUseCase } from '@modules/orders/use-cases/table-fetch';
import { ITransaction } from '@modules/transactions/interfaces';
import { transactionsTableFetchUseCase } from '@modules/transactions/use-cases/table-fetch';
import { ICourier } from '@modules/couriers/interfaces';
import { couriersTableFetchUseCase } from '@modules/couriers/use-cases/table-fetch';

import {
    AppointmentDeclarationsTableContext,
    AppointmentOrdersTableContext,
    AppointmentTransactionsTableContext,
    AppointmentCouriersTableContext,
} from '../context';

type Section = 'declarations' | 'orders' | 'couriers' | 'transactions';

const declarationColumns: Column<IDeclaration>[] = [
    { ...nextTableColumns.small, id: 'id', accessor: (r) => r.id, Header: 'Kod' },
    { ...nextTableColumns.smaller, id: 'track_code', accessor: (r) => r.trackCode, Header: 'İzləmə kodu', Cell: ({ cell: { value } }: any) => <Tag>{value}</Tag> },
    { accessor: (r) => r.status?.name, id: 'status_id', Header: 'Status' },
    { ...nextTableColumns.smaller, id: 'paid', accessor: (r) => r.paid, Header: 'Ödəniş', Cell: ({ cell: { value } }: any) => value ? <Icons.CheckOutlined style={{ color: '#52c41a' }} /> : <Icons.CloseOutlined style={{ color: '#ff4d4f' }} /> },
    { ...nextTableColumns.date, id: 'created_at', accessor: (r) => r.createdAt, Header: 'Tarix' },
];

const orderColumns: Column<IOrder>[] = [
    { ...nextTableColumns.small, id: 'id', accessor: (r) => r.id, Header: 'Kod' },
    { ...nextTableColumns.smaller, id: 'track_code', accessor: (r) => r.trackCode, Header: 'İzləmə kodu', Cell: ({ cell: { value } }: any) => <Tag>{value}</Tag> },
    { accessor: (r) => r.status?.name, id: 'status_id', Header: 'Status' },
    { ...nextTableColumns.date, id: 'created_at', accessor: (r) => r.createdAt, Header: 'Tarix' },
];

const transactionColumns: Column<ITransaction>[] = [
    { ...nextTableColumns.small, id: 'id', accessor: (r) => r.id, Header: 'Kod' },
    { accessor: (r) => r.amount.value, id: 'amount', Header: 'Məbləğ', Cell: ({ row: { original } }: any) => `${original.amount.value} ${original.amount.currency}` },
    { accessor: (r) => r.type?.name, id: 'type', Header: 'Növ' },
    { ...nextTableColumns.date, id: 'created_at', accessor: (r) => r.createdAt, Header: 'Tarix' },
];

const courierColumns: Column<ICourier>[] = [
    { ...nextTableColumns.small, id: 'id', accessor: (r) => r.id, Header: 'Kod' },
    { accessor: (r) => r.recipient, id: 'recipient', Header: 'Alıcı' },
    { accessor: (r) => r.status?.name, id: 'status_id', Header: 'Status' },
    { ...nextTableColumns.date, id: 'created_at', accessor: (r) => r.createdAt, Header: 'Tarix' },
];

export const AppointmentPage: FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const [section, setSection] = useState<Section>('declarations');

    const { data: userResult, isLoading } = useQuery(['appointment-user', userId], () => UsersService.getUserById(userId!), { enabled: !!userId });

    const userDefaultState = useMemo(() => ({ filters: [{ id: 'user_id', value: userId }] }), [userId]);

    if (isLoading) return <Spin size='large' style={{ display: 'block', padding: 40 }} />;

    const user = userResult?.status === 200 ? userResult.data : null;

    if (!user) return <Result status='404' title='İstifadəçi tapılmadı.' />;

    return (
        <PageContent>
            <HeadPortal>
                <StyledActionBar $flex>
                    <Menu selectedKeys={[section]} onSelect={({ key }) => setSection(key as Section)} mode='horizontal' style={{ background: 'transparent', border: 'none' }}>
                        <Menu.Item key='declarations'>Bağlamalar</Menu.Item>
                        <Menu.Item key='orders'>Sifarişlər</Menu.Item>
                        <Menu.Item key='couriers'>Kuryerlər</Menu.Item>
                        <Menu.Item key='transactions'>Balans əməliyyatları</Menu.Item>
                    </Menu>
                </StyledActionBar>
            </HeadPortal>

            <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
                <Col span={24} lg={6} xl={4}>
                    <Card size='small'>
                        <Statistic title='Balans (USD)' value={user.balance.usd} prefix='$' precision={2} />
                    </Card>
                </Col>
                <Col span={24} lg={6} xl={4}>
                    <Card size='small'>
                        <Statistic title='Balans (TRY)' value={user.balance.try} prefix='₺' precision={2} />
                    </Card>
                </Col>
                <Col span={24} lg={12} xl={16}>
                    <Descriptions size='small' bordered column={4}>
                        <Descriptions.Item label='ID'>{user.id}</Descriptions.Item>
                        <Descriptions.Item label='Ad Soyad'>{user.fullName}</Descriptions.Item>
                        <Descriptions.Item label='FİN Kod'>{user.passport.secret || '—'}</Descriptions.Item>
                        <Descriptions.Item label='Telefon'>{user.phoneNumber || '—'}</Descriptions.Item>
                    </Descriptions>
                </Col>
            </Row>

            {section === 'declarations' && (
                <NextTableProvider context={AppointmentDeclarationsTableContext} onFetch={declarationsTableFetchUseCase} name={`appointment-declarations-${userId}`} defaultState={userDefaultState} useCache={false}>
                    <NextTable context={AppointmentDeclarationsTableContext} columns={declarationColumns as any} />
                </NextTableProvider>
            )}
            {section === 'orders' && (
                <NextTableProvider context={AppointmentOrdersTableContext} onFetch={ordersTableFetchUseCase} name={`appointment-orders-${userId}`} defaultState={userDefaultState} useCache={false}>
                    <NextTable context={AppointmentOrdersTableContext} columns={orderColumns as any} />
                </NextTableProvider>
            )}
            {section === 'couriers' && (
                <NextTableProvider context={AppointmentCouriersTableContext} onFetch={couriersTableFetchUseCase} name={`appointment-couriers-${userId}`} defaultState={userDefaultState} useCache={false}>
                    <NextTable context={AppointmentCouriersTableContext} columns={courierColumns as any} />
                </NextTableProvider>
            )}
            {section === 'transactions' && (
                <Fragment>
                    <NextTableProvider context={AppointmentTransactionsTableContext} onFetch={transactionsTableFetchUseCase} name={`appointment-transactions-${userId}`} defaultState={userDefaultState} useCache={false}>
                        <NextTable context={AppointmentTransactionsTableContext} columns={transactionColumns as any} />
                    </NextTableProvider>
                </Fragment>
            )}
        </PageContent>
    );
};
