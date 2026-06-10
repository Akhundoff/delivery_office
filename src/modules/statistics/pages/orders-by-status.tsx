import React, { FC, useCallback, useState } from 'react';
import { Button, Col, DatePicker, Empty, Radio, Row, Select, Spin, Table } from 'antd';
import * as Icons from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { useQuery } from 'react-query';
import { PageContent } from '@shared/styled/page-content';
import { HeadPortal } from '@modules/layout/components/head-portal';
import { StyledActionBar } from '@shared/styled/action-bar';
import { useBackgroundNavigate } from '@shared/hooks';
import { StatusesService } from '@modules/statuses/services';
import { CountryIds, getCurrencySymbolByCountryId } from '@modules/orders/constants';
import { StatisticsService } from '../services';
import { StatisticsLineChart } from '../components/statistics-line-chart';

const { RangePicker } = DatePicker;

const COUNTRY_NAMES: Record<number, string> = {
    [CountryIds.TURKIYE]: 'Türkiyə',
    [CountryIds.AMERICA]: 'Amerika',
    [CountryIds.CHINA]: 'Çin',
    [CountryIds.SPAIN]: 'İspaniya',
};

export const OrdersByStatusPage: FC = () => {
    const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([dayjs().startOf('month'), dayjs().endOf('month')]);
    const [statusId, setStatusId] = useState<number | undefined>(1);
    const [countryId, setCountryId] = useState<number>(CountryIds.TURKIYE);
    const [view, setView] = useState<'chart' | 'table'>('chart');
    const navigate = useBackgroundNavigate();

    const { data: statusesResult } = useQuery('statuses-for-order-stats', () => StatusesService.getList({ per_page: 500, model_id: 1 }));
    const statuses = statusesResult?.status === 200 ? statusesResult.data.data : [];

    const startDate = dateRange[0].startOf('day').format('YYYY-MM-DD HH:mm:ss');
    const endDate = dateRange[1].endOf('day').format('YYYY-MM-DD HH:mm:ss');

    const { data: statsResult, isLoading } = useQuery(
        ['order-stats-by-status', statusId, countryId, startDate, endDate],
        () => StatisticsService.getOrdersByStatus({ start_date: startDate, end_date: endDate, state_id: statusId, country_id: countryId }),
        { enabled: !!statusId },
    );

    const stats = statsResult?.status === 200 ? statsResult.data : null;

    const onDateChange = useCallback((dates: any) => {
        if (dates && dates[0] && dates[1]) setDateRange([dates[0], dates[1]]);
    }, []);

    const openDetails = useCallback(() => {
        navigate('/statistics/orders/by-status/details', { withBackground: true, state: { statusId, countryId, startDate, endDate } });
    }, [navigate, statusId, countryId, startDate, endDate]);

    const actionBar = (
        <HeadPortal>
            <StyledActionBar $flex={false}>
                <Row gutter={[8, 8]} align='middle'>
                    <Col>
                        <Select style={{ width: 160 }} value={countryId} onChange={setCountryId}>
                            {Object.entries(COUNTRY_NAMES).map(([id, name]) => (
                                <Select.Option key={id} value={Number(id)}>{name}</Select.Option>
                            ))}
                        </Select>
                    </Col>
                    <Col>
                        <Select style={{ width: 200 }} value={statusId} onChange={setStatusId} placeholder='Status seçin' options={statuses.map((s) => ({ value: s.id, label: s.name }))} />
                    </Col>
                    <Col>
                        <RangePicker value={dateRange} onChange={onDateChange} allowClear={false} />
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                        <Radio.Group value={view} onChange={(e) => setView(e.target.value)}>
                            <Radio.Button value='chart'><Icons.LineChartOutlined /> Qrafik</Radio.Button>
                            <Radio.Button value='table'><Icons.TableOutlined /> Cədvəl</Radio.Button>
                        </Radio.Group>
                        <Button.Group>
                            <Button onClick={openDetails}>{stats.total.productPrice.toFixed(2)} {getCurrencySymbolByCountryId(countryId)}</Button>
                            <Button onClick={openDetails}>{stats.total.count} ədəd</Button>
                        </Button.Group>
                    </div>
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
                                { title: `Qiymət (${getCurrencySymbolByCountryId(countryId)})`, dataIndex: 'price', key: 'price', render: (v) => v.toFixed(2) },
                            ]}
                        />
                    )}
                </>
            )}
        </PageContent>
    );
};
