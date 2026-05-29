import React, { FC } from 'react';
import { Col, Row, Typography } from 'antd';
import * as Icons from '@ant-design/icons';
import { NavLink } from 'react-router-dom';
import { PageContent } from '@shared/styled/page-content';

const CardLink: FC<{ to: string; icon: React.ReactNode; title: string }> = ({ to, icon, title }) => (
    <NavLink to={to} style={{ display: 'block', padding: '24px', background: '#fff', borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,.1)', textAlign: 'center', color: 'inherit', textDecoration: 'none' }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>{icon}</div>
        <Typography.Text strong>{title}</Typography.Text>
    </NavLink>
);

export const StatisticsOverviewPage: FC = () => (
    <PageContent>
        <Row gutter={[16, 16]}>
            <Col xs={24}>
                <Typography.Title level={3} style={{ marginBottom: 0 }}>Statistikalar</Typography.Title>
            </Col>
            <Col xs={24} lg={8}>
                <CardLink to='/statistics/declarations/by-status' icon={<Icons.InboxOutlined />} title='Statuslar üzrə bağlamalar' />
            </Col>
            <Col xs={24} lg={8}>
                <CardLink to='/statistics/orders/by-status' icon={<Icons.ShoppingCartOutlined />} title='Statuslar üzrə sifarişlər' />
            </Col>
            <Col xs={24} lg={8}>
                <CardLink to='/statistics/transactions/by-user' icon={<Icons.MoneyCollectOutlined />} title='Balans artımı' />
            </Col>
        </Row>
    </PageContent>
);
