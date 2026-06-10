import React, { FC } from 'react';
import { Col, Row, Typography } from 'antd';
import Icon from '@ant-design/icons';
import { NavLink } from 'react-router-dom';
import { BoxOutlined, ClientsOutlined, CourierCarOutlined, CourierOutlined, OrdersOutlined, PersonsOutlined, RegionOutlined, TransactionOutlined, TransferOutlined } from '@shared/assets/icons';

const CardLink: FC<{ to: string; icon: React.ReactNode; title: string }> = ({ to, icon, title }) => (
    <NavLink to={to} style={{ display: 'block', padding: '3rem 0', background: '#fff', height: '100%', textAlign: 'center', color: '#0A4755', textDecoration: 'none' }}>
        <div style={{ fontSize: 40 }}>{icon}</div>
        <h1 style={{ margin: 0 }}>{title}</h1>
    </NavLink>
);

export const StatisticsOverviewPage: FC = () => (
    <div>
        <Row gutter={[12, 12]}>
            <Col xs={24}>
                <Typography.Title level={3} style={{ marginBottom: 0 }}>Statistikalar</Typography.Title>
            </Col>
            <Col xs={24} lg={8}>
                <CardLink to='/statistics/orders/by-status' icon={<Icon component={OrdersOutlined} style={{ fontSize: 40 }} />} title='Statuslar üzrə sifarişlər' />
            </Col>
            <Col xs={24} lg={8}>
                <CardLink to='/statistics/orders/by-admin' icon={<Icon component={PersonsOutlined} style={{ fontSize: 40 }} />} title='Adminlər üzrə sifarişlər' />
            </Col>
            <Col xs={24} lg={8}>
                <CardLink to='/statistics/declarations/by-status' icon={<Icon component={BoxOutlined} style={{ fontSize: 40 }} />} title='Statuslar üzrə bağlamalar' />
            </Col>
            <Col xs={24} lg={8}>
                <CardLink to='/statistics/qizil-onluq' icon={<Icon component={BoxOutlined} style={{ fontSize: 40 }} />} title='Qızıl onluq' />
            </Col>
            <Col xs={24} lg={8}>
                <CardLink to='/statistics/transactions/by-user' icon={<Icon component={TransactionOutlined} style={{ fontSize: 40 }} />} title='Balans artımı' />
            </Col>
            <Col xs={24} lg={8}>
                <CardLink to='/statistics/transactions/payment-counts/by-payment-types' icon={<Icon component={TransactionOutlined} style={{ fontSize: 40 }} />} title='Balans artımı ödəniş tipinə görə' />
            </Col>
            <Col xs={24} lg={8}>
                <CardLink to='/statistics/cashflow-transactions' icon={<Icon component={TransferOutlined} style={{ fontSize: 40 }} />} title='Cashflow transaction' />
            </Col>
            <Col xs={24} lg={8}>
                <CardLink to='/statistics/users/counts' icon={<Icon component={ClientsOutlined} style={{ fontSize: 40 }} />} title='Müştərilər' />
            </Col>
            <Col xs={24} lg={8}>
                <CardLink to='/statistics/couriers/counts' icon={<Icon component={CourierOutlined} style={{ fontSize: 40 }} />} title='Kuryer təhvil' />
            </Col>
            <Col xs={24} lg={8}>
                <CardLink to='/statistics/couriers/counts/by-regions' icon={<Icon component={CourierCarOutlined} style={{ fontSize: 40 }} />} title='Rayonlar üzrə kuryer təhvil' />
            </Col>
            <Col xs={24} lg={8}>
                <CardLink to='/statistics/couriers/overview/counts/by-regions' icon={<Icon component={RegionOutlined} style={{ fontSize: 40 }} />} title='Rayonlar üzrə ümumi' />
            </Col>
            <Col xs={24} lg={8}>
                <CardLink to='/statistics/transactions/payment-types/by-declarations' icon={<Icon component={BoxOutlined} style={{ fontSize: 40 }} />} title='Bağlamalara görə ödəniş üsulları' />
            </Col>
            <Col xs={24} lg={8}>
                <CardLink to='/statistics/plans' icon={<Icon component={OrdersOutlined} style={{ fontSize: 40 }} />} title='Tariflər üzrə statistika' />
            </Col>
        </Row>
    </div>
);
