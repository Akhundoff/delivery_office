import React, { FC, useCallback, useState } from 'react';
import { Button, Col, DatePicker, Empty, Radio, Row, Spin, Table, Tag } from 'antd';
import * as Icons from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { useQuery } from 'react-query';
import { PageContent } from '@shared/styled/page-content';
import { HeadPortal } from '@modules/layout/components/head-portal';
import { StyledActionBar } from '@shared/styled/action-bar';
import { useBackgroundNavigate } from '@shared/hooks';
import { StatisticsService } from '../services';
import { StatisticsLineChart } from '../components/statistics-line-chart';

const { RangePicker } = DatePicker;

export const TransactionsByUserPage: FC = () => {
    const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([dayjs().startOf('month'), dayjs().endOf('month')]);
    const [view, setView] = useState<'chart' | 'table'>('chart');
    const navigate = useBackgroundNavigate();

    const startDate = dateRange[0].startOf('day').format('YYYY-MM-DD HH:mm:ss');
    const endDate = dateRange[1].endOf('day').format('YYYY-MM-DD HH:mm:ss');

    const openDetails = useCallback(
        (currency?: string) => {
            navigate('/statistics/transactions/by-user/details', { withBackground: true, state: { startDate, endDate, currency } });
        },
        [navigate, startDate, endDate],
    );

    const { data: statsResult, isLoading } = useQuery(
        ['transaction-stats-by-user', startDate, endDate],
        () => StatisticsService.getTransactionsByUser({ start_date: startDate, end_date: endDate }),
    );

    const stats = statsResult?.status === 200 ? statsResult.data : null;

    const onDateChange = useCallback((dates: any) => {
        if (dates && dates[0] && dates[1]) setDateRange([dates[0], dates[1]]);
    }, []);

    const actionBar = (
        <HeadPortal>
            <StyledActionBar $flex={false}>
                <Row gutter={[8, 8]} align='middle'>
                    <Col>
                        <RangePicker value={dateRange} onChange={onDateChange} allowClear={false} />
                    </Col>
                    <Col>
                        <Radio.Group value={view} onChange={(e) => setView(e.target.value)}>
                            <Radio.Button value='chart'><Icons.LineChartOutlined /></Radio.Button>
                            <Radio.Button value='table'><Icons.TableOutlined /></Radio.Button>
                        </Radio.Group>
                    </Col>
                </Row>
            </StyledActionBar>
        </HeadPortal>
    );

    return (
        <PageContent>
            {actionBar}
            {isLoading && <Spin style={{ display: 'block', margin: '64px auto' }} />}
            {!isLoading && !stats?.items.length && <Empty style={{ marginTop: 64 }} description='Məlumat tapılmadı' />}
            {!isLoading && !!stats?.items.length && (
                <>
                    <Row style={{ marginBottom: 16 }}>
                        <Button.Group>
                            <Button onClick={() => openDetails()}>{stats.total.count} ədəd</Button>
                            <Button onClick={() => openDetails('AZN')}>{stats.total.amount.azn.toFixed(2)} ₼</Button>
                            <Button onClick={() => openDetails('USD')}>{stats.total.amount.usd.toFixed(2)} $</Button>
                            <Button onClick={() => openDetails('TRY')}>{stats.total.amount.try.toFixed(2)} ₺</Button>
                        </Button.Group>
                    </Row>
                    {view === 'chart' && (
                        <StatisticsLineChart
                            labels={stats.items.map((r) => r.createdAt)}
                            datasets={[{ label: 'Tranzaksiya sayı', data: stats.items.map((r) => r.count) }]}
                        />
                    )}
                    {view === 'table' && (
                        <Table
                            dataSource={stats.items}
                            rowKey='id'
                            pagination={{ pageSize: 50 }}
                            columns={[
                                { title: 'Tarix', dataIndex: 'createdAt', key: 'date' },
                                { title: 'Say', dataIndex: 'count', key: 'count' },
                                { title: 'Məbləğ', key: 'amount', render: (_, r) => <span>{r.amount.toFixed(2)} <Tag>{r.currency}</Tag></span> },
                            ]}
                        />
                    )}
                </>
            )}
        </PageContent>
    );
};
