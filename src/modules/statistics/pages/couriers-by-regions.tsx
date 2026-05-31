import { FC, useCallback, useMemo, useState } from 'react';
import { Button, DatePicker, Empty, Radio, Result, Select, Space, Spin } from 'antd';
import * as Icons from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { useQuery } from 'react-query';
import uniq from 'lodash/uniq';
import groupBy from 'lodash/groupBy';
import { PageContent } from '@shared/styled/page-content';
import { useBackgroundNavigate } from '@shared/hooks';
import { useStatuses } from '@modules/statuses/hooks';
import { CurrencySymbols } from '@modules/orders/constants';
import { StatisticsService } from '../services';
import { StatisticsLineChart } from '../components/statistics-line-chart';
import { CouriersCountByRegionsStatisticsTable } from '../components/couriers-count-by-regions-statistics-table';
import { getChartColor } from '../components/chart-colors';

export const CouriersByRegionsPage: FC = () => {
    const [dates, setDates] = useState<[Dayjs, Dayjs]>([dayjs().startOf('month'), dayjs().endOf('month')]);
    const [view, setView] = useState<'chart' | 'table'>('chart');
    const [statusId, setStatusId] = useState<number>(14);
    const navigate = useBackgroundNavigate();

    const [startDate, endDate] = dates;
    const start = startDate.startOf('day').format('YYYY-MM-DD HH:mm:ss');
    const end = endDate.endOf('day').format('YYYY-MM-DD HH:mm:ss');

    const statuses = useStatuses({ model_id: 3 });

    const { data: statsResult, isFetching, error } = useQuery(
        ['couriers-by-regions', start, end, statusId],
        async () => {
            const result = await StatisticsService.getCouriersCountByRegions({ start_date: start, end_date: end, state_id: statusId });
            if (result.status === 200) return result.data;
            throw new Error(result.data as string);
        },
        { keepPreviousData: true },
    );

    const stats = statsResult ?? null;
    const onDateChange = useCallback((value: any) => { if (value && value[0] && value[1]) setDates(value); }, []);

    const openDetails = useCallback(() => {
        navigate('/statistics/couriers/counts/by-regions/details', { withBackground: true, state: { dateFrom: start, dateTo: end, statusId } });
    }, [navigate, start, end, statusId]);

    const chart = useMemo(() => {
        if (!stats?.data.length) return { labels: [] as string[], datasets: [] as { label: string; data: number[]; color: string }[] };
        const labels = uniq(stats.data.map((item) => item.updatedAt));
        const byRegion = groupBy(stats.data, (item) => item.region.id);
        const datasets = Object.values(byRegion).map((rows, index) => ({
            label: rows[0].region.name,
            color: getChartColor(index),
            data: labels.map((date) => rows.find((r) => r.updatedAt === date)?.count ?? 0),
        }));
        return { labels, datasets };
    }, [stats]);

    const inputs = useMemo(
        () => (
            <Space size={8}>
                <Select placeholder='Status seçin' style={{ width: 200 }} value={statusId} onChange={setStatusId} loading={statuses.isLoading}>
                    {(statuses.data || []).map((status) => <Select.Option value={status.id} key={status.id}>{status.name}</Select.Option>)}
                </Select>
                <DatePicker.RangePicker allowClear={false} onChange={onDateChange} value={dates} />
            </Space>
        ),
        [statusId, statuses.data, statuses.isLoading, onDateChange, dates],
    );

    if (isFetching && !stats) {
        return <PageContent title='Rayonlar üzrə kuryer təhvil statistikası' extra={inputs}><Spin style={{ display: 'block', padding: '80px 0', textAlign: 'center' }} /></PageContent>;
    }

    if (error) {
        return <PageContent title='Rayonlar üzrə kuryer təhvil statistikası' extra={inputs}><Result status='500' title={(error as Error).message} /></PageContent>;
    }

    if (!stats?.data.length) {
        return <PageContent title='Rayonlar üzrə kuryer təhvil statistikası' extra={inputs}><Empty description='Məlumat yoxdur...' /></PageContent>;
    }

    return (
        <PageContent title='Rayonlar üzrə kuryer təhvil statistikası' extra={inputs}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Radio.Group value={view} onChange={(e) => setView(e.target.value)}>
                    <Radio.Button value='chart'><Icons.LineChartOutlined /> Qrafik</Radio.Button>
                    <Radio.Button value='table'><Icons.TableOutlined /> Cədvəl</Radio.Button>
                </Radio.Group>
                <Button.Group>
                    <Button onClick={openDetails}>{stats.total.count} ədəd</Button>
                    <Button onClick={openDetails}>{stats.total.paymentAmount.usd.toFixed(2)} {CurrencySymbols.USD}</Button>
                    <Button onClick={openDetails}>{stats.total.paymentAmount.azn.toFixed(2)} {CurrencySymbols.AZN}</Button>
                </Button.Group>
            </div>
            {view === 'chart' && <StatisticsLineChart labels={chart.labels} datasets={chart.datasets} />}
            {view === 'table' && <CouriersCountByRegionsStatisticsTable data={stats.data} statusId={statusId} />}
        </PageContent>
    );
};
