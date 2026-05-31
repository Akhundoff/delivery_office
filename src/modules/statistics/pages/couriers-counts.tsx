import { FC, useCallback, useMemo, useState } from 'react';
import { Button, DatePicker, Empty, message, Radio, Select, Space, Spin } from 'antd';
import * as Icons from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { useQuery } from 'react-query';
import { PageContent } from '@shared/styled/page-content';
import { useBackgroundNavigate } from '@shared/hooks';
import { useStatuses } from '@modules/statuses/hooks';
import { CurrencySymbols } from '@modules/orders/constants';
import { StatisticsService } from '../services';
import { StatisticsLineChart } from '../components/statistics-line-chart';
import { CouriersCountStatisticsTable } from '../components/couriers-count-statistics-table';

export const CouriersCountsPage: FC = () => {
    const [dates, setDates] = useState<[Dayjs, Dayjs]>([dayjs().startOf('month'), dayjs().endOf('month')]);
    const [view, setView] = useState<'chart' | 'table'>('chart');
    const [statusId, setStatusId] = useState<number>(13);
    const navigate = useBackgroundNavigate();

    const [startDate, endDate] = dates;
    const start = startDate.startOf('day').format('YYYY-MM-DD HH:mm:ss');
    const end = endDate.endOf('day').format('YYYY-MM-DD HH:mm:ss');

    const statuses = useStatuses({ model_id: 3 });

    const { data: statsResult, isFetching } = useQuery(
        ['couriers-counts', start, end, statusId],
        async () => {
            const result = await StatisticsService.getCouriersCount({ start_date: start, end_date: end, state_id: statusId });
            if (result.status === 200) return result.data;
            throw new Error(result.data as string);
        },
        { keepPreviousData: true },
    );

    const stats = statsResult ?? null;
    const onDateChange = useCallback((value: any) => { if (value && value[0] && value[1]) setDates(value); }, []);

    const onExcelExport = useCallback(async () => {
        message.loading({ key: 'courier-excel', content: 'Sənəd hazırlanır...', duration: 0 });
        const result = await StatisticsService.getCourierPriceExcel({ start_date: start, end_date: end });
        if (result.status === 200) {
            message.success({ key: 'courier-excel', content: 'Sənəd yüklənir' });
            const objectURL = URL.createObjectURL(result.data);
            const a = document.createElement('a');
            a.href = objectURL;
            a.download = `couriers_export_${Math.round(Math.random() * 1000)}.xls`;
            a.click();
        } else {
            message.error({ key: 'courier-excel', content: result.data as string });
        }
    }, [start, end]);

    const openDetails = useCallback(() => {
        navigate('/statistics/couriers/counts/details', { withBackground: true, state: { dateFrom: start, dateTo: end, statusId } });
    }, [navigate, start, end, statusId]);

    const inputs = useMemo(
        () => (
            <Space size={8}>
                <Select placeholder='Status seçin' style={{ width: 200 }} value={statusId} onChange={setStatusId} loading={statuses.isLoading}>
                    {(statuses.data || []).map((status) => <Select.Option value={status.id} key={status.id}>{status.name}</Select.Option>)}
                </Select>
                <DatePicker.RangePicker showTime allowClear={false} onChange={onDateChange} value={dates} />
            </Space>
        ),
        [statusId, statuses.data, statuses.isLoading, onDateChange, dates],
    );

    if (isFetching && !stats) {
        return <PageContent title='Kuryer təhvil sayları üzrə statistika' extra={inputs}><Spin style={{ display: 'block', padding: '80px 0', textAlign: 'center' }} /></PageContent>;
    }

    if (!stats?.data.length) {
        return <PageContent title='Kuryer təhvil sayları üzrə statistika' extra={inputs}><Empty description='Məlumat yoxdur...' /></PageContent>;
    }

    return (
        <PageContent title='Kuryer təhvil sayları üzrə statistika' extra={inputs}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Radio.Group value={view} onChange={(e) => setView(e.target.value)}>
                    <Radio.Button value='chart'><Icons.LineChartOutlined /> Qrafik</Radio.Button>
                    <Radio.Button value='table'><Icons.TableOutlined /> Cədvəl</Radio.Button>
                </Radio.Group>
                <Button.Group>
                    <Button onClick={onExcelExport}>Excel export</Button>
                    <Button onClick={openDetails}>Nağd: {stats.total.payments.cash.toFixed(2)} {CurrencySymbols.AZN}</Button>
                    <Button onClick={openDetails}>Online: {stats.total.payments.online.toFixed(2)} {CurrencySymbols.AZN}</Button>
                    <Button onClick={openDetails}>{stats.total.count} ədəd</Button>
                </Button.Group>
            </div>
            {view === 'chart' && (
                <StatisticsLineChart
                    labels={stats.data.map((r) => r.updatedAt)}
                    datasets={[
                        { label: 'Nağd', data: stats.data.map((r) => r.paymentAmounts.cash), color: '#3dc0ea' },
                        { label: 'Online', data: stats.data.map((r) => r.paymentAmounts.online), color: '#e8553e' },
                    ]}
                />
            )}
            {view === 'table' && <CouriersCountStatisticsTable data={stats.data} statusId={statusId} />}
        </PageContent>
    );
};
