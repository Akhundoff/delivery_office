import React, { FC, useCallback, useState } from 'react';
import { Col, DatePicker, Empty, Radio, Row, Select, Spin, Table } from 'antd';
import * as Icons from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { useQuery } from 'react-query';
import { PageContent } from '@shared/styled/page-content';
import { HeadPortal } from '@modules/layout/components/head-portal';
import { StyledActionBar } from '@shared/styled/action-bar';
import { StatusesService } from '@modules/statuses/services';
import { StatisticsService } from '../services';
import { StatisticsLineChart } from '../components/statistics-line-chart';

const { RangePicker } = DatePicker;

export const OrdersByStatusPage: FC = () => {
    const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([dayjs().startOf('month'), dayjs().endOf('month')]);
    const [statusId, setStatusId] = useState<number | undefined>(1);
    const [view, setView] = useState<'chart' | 'table'>('chart');

    const { data: statusesResult } = useQuery('statuses-for-order-stats', () => StatusesService.getList({ per_page: 500, model_id: 1 }));
    const statuses = statusesResult?.status === 200 ? statusesResult.data.data : [];

    const startDate = dateRange[0].startOf('day').format('YYYY-MM-DD HH:mm:ss');
    const endDate = dateRange[1].endOf('day').format('YYYY-MM-DD HH:mm:ss');

    const { data: statsResult, isLoading } = useQuery(
        ['order-stats-by-status', statusId, startDate, endDate],
        () => StatisticsService.getOrdersByStatus({ start_date: startDate, end_date: endDate, state_id: statusId }),
        { enabled: !!statusId },
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
                        <Select style={{ width: 200 }} value={statusId} onChange={setStatusId} placeholder='Status seçin' options={statuses.map((s) => ({ value: s.id, label: s.name }))} />
                    </Col>
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
            {!isLoading && !stats?.data.length && <Empty style={{ marginTop: 64 }} description='Məlumat tapılmadı' />}
            {!isLoading && !!stats?.data.length && (
                <>
                    <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                        <Col><b>Ümumi say:</b> {stats.total.count}</Col>
                        <Col><b>Qiymət:</b> {stats.total.productPrice.toFixed(2)} ₺</Col>
                    </Row>
                    {view === 'chart' && (
                        <StatisticsLineChart
                            labels={stats.data.map((r) => r.updatedAt)}
                            datasets={[{ label: 'Sifariş sayı', data: stats.data.map((r) => r.count) }]}
                        />
                    )}
                    {view === 'table' && (
                        <Table
                            dataSource={stats.data}
                            rowKey='id'
                            pagination={{ pageSize: 50 }}
                            columns={[
                                { title: 'Tarix', dataIndex: 'updatedAt', key: 'date' },
                                { title: 'Say', dataIndex: 'count', key: 'count' },
                                { title: 'Qiymət (₺)', dataIndex: 'price', key: 'price', render: (v) => v.toFixed(2) },
                            ]}
                        />
                    )}
                </>
            )}
        </PageContent>
    );
};
