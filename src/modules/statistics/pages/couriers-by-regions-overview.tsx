import { FC, useCallback, useMemo, useState } from 'react';
import { DatePicker, Empty, Radio, Result, Select, Space, Spin } from 'antd';
import * as Icons from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { useQuery } from 'react-query';
import { PageContent } from '@shared/styled/page-content';
import { useStatuses } from '@modules/statuses/hooks';
import { StatisticsService } from '../services';
import { StatisticsBarChart } from '../components/statistics-bar-chart';
import { CouriersCountByRegionsOverviewStatisticsTable } from '../components/couriers-count-by-regions-overview-statistics-table';

export const CouriersByRegionsOverviewPage: FC = () => {
    const [dates, setDates] = useState<[Dayjs, Dayjs]>([dayjs().startOf('month'), dayjs().endOf('month')]);
    const [view, setView] = useState<'chart' | 'table'>('chart');
    const [statusId, setStatusId] = useState<number>(13);

    const [startDate, endDate] = dates;
    const start = startDate.startOf('day').format('YYYY-MM-DD HH:mm:ss');
    const end = endDate.endOf('day').format('YYYY-MM-DD HH:mm:ss');

    const statuses = useStatuses({ model_id: 3 });

    const { data: statsResult, isFetching, error } = useQuery(
        ['couriers-by-regions-overview', start, end, statusId],
        async () => {
            const result = await StatisticsService.getCouriersCountByRegionsOverview({ start_date: start, end_date: end, state_id: statusId });
            if (result.status === 200) return result.data;
            throw new Error(result.data as string);
        },
        { keepPreviousData: true },
    );

    const stats = statsResult ?? null;
    const onDateChange = useCallback((value: any) => { if (value && value[0] && value[1]) setDates(value); }, []);

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
        return <PageContent title='Rayonlar üzrə kuryer statistikası' extra={inputs}><Spin style={{ display: 'block', padding: '80px 0', textAlign: 'center' }} /></PageContent>;
    }

    if (error) {
        return <PageContent title='Rayonlar üzrə kuryer statistikası' extra={inputs}><Result status='500' title={(error as Error).message} /></PageContent>;
    }

    if (!stats?.length) {
        return <PageContent title='Rayonlar üzrə kuryer statistikası' extra={inputs}><Empty description='Məlumat yoxdur...' /></PageContent>;
    }

    return (
        <PageContent title='Rayonlar üzrə kuryer statistikası' extra={inputs}>
            <Radio.Group value={view} onChange={(e) => setView(e.target.value)} style={{ marginBottom: 16 }}>
                <Radio.Button value='chart'><Icons.LineChartOutlined /> Qrafik</Radio.Button>
                <Radio.Button value='table'><Icons.TableOutlined /> Cədvəl</Radio.Button>
            </Radio.Group>
            {view === 'chart' && <StatisticsBarChart labels={stats.map((r) => r.region.name)} data={stats.map((r) => r.count)} />}
            {view === 'table' && <CouriersCountByRegionsOverviewStatisticsTable data={stats} />}
        </PageContent>
    );
};
