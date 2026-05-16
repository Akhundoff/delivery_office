import React, { FC, useContext } from 'react';
import { Card, Col, Row, Select, Space, Statistic, Typography } from 'antd';
import { TeamOutlined, UserOutlined } from '@ant-design/icons';
import { CountryContext } from '@modules/country';
import { MeContext } from '@modules/me/context/context';

export const HomePage: FC = () => {
    const [countryState, countryActions] = useContext(CountryContext);
    const me = useContext(MeContext);

    return (
        <div style={{ padding: 24 }}>
            <Space direction='vertical' size='middle' style={{ width: '100%' }}>
                <Typography.Title level={4} style={{ margin: 0 }}>
                    Ana səhifə
                </Typography.Title>

                <Row gutter={16}>
                    <Col xs={24} sm={12} md={8}>
                        <Card>
                            <Statistic
                                title='Cari istifadəçi'
                                value={`${me.state.user.data?.firstName || ''} ${me.state.user.data?.lastName || ''}`}
                                prefix={<UserOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Card>
                            <Statistic title='Email' value={me.state.user.data?.email || '—'} prefix={<TeamOutlined />} />
                        </Card>
                    </Col>
                </Row>

                <Card title='Ölkə seçimi'>
                    <Select
                        value={countryState.selected ?? undefined}
                        placeholder='Ölkə seçin'
                        style={{ width: 240 }}
                        onChange={countryActions.onSelectedCountryChange}
                        options={countryState.available.map((item) => ({ label: item.toUpperCase(), value: item }))}
                    />
                </Card>
            </Space>
        </div>
    );
};

