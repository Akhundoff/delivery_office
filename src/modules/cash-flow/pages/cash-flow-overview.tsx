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

export const CashFlowOverviewPage: FC = () => (
    <PageContent>
        <Row gutter={[16, 16]}>
            <Col xs={24}>
                <Typography.Title level={3} style={{ marginBottom: 0 }}>Cashflow</Typography.Title>
            </Col>
            <Col xs={24} lg={12}>
                <CardLink to='/cash-flow/analytics' icon={<Icons.BarChartOutlined />} title='Analitika' />
            </Col>
            <Col xs={24} lg={12}>
                <CardLink to='/cash-flow/transactions' icon={<Icons.SwapOutlined />} title='Tranzaksiyalar' />
            </Col>
            <Col xs={24} lg={8}>
                <CardLink to='/cash-flow/cash-registers' icon={<Icons.BankOutlined />} title='Kassalar' />
            </Col>
            <Col xs={24} lg={8}>
                <CardLink to='/cash-flow/currencies' icon={<Icons.DollarOutlined />} title='Valyutalar' />
            </Col>
            <Col xs={24} lg={8}>
                <CardLink to='/cash-flow/operations' icon={<Icons.AppstoreOutlined />} title='Əməliyyat kateqoriyaları' />
            </Col>
        </Row>
    </PageContent>
);
