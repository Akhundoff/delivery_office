import { FC, useCallback, useMemo, useState } from 'react';
import { Button, DatePicker, Empty, Radio, Space, Spin } from 'antd';
import * as Icons from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { useQuery } from 'react-query';
import { PageContent } from '@shared/styled/page-content';
import { useBackgroundNavigate } from '@shared/hooks';
import { StatisticsService } from '../services';
import { StatisticsLineChart } from '../components/statistics-line-chart';
import { TransactionsByPaymentTypeTable } from '../components/transactions-by-payment-type-table';

export const TransactionsByPaymentTypePage: FC = () => {
    const [dates, setDates] = useState<[Dayjs, Dayjs]>([dayjs().startOf('month'), dayjs().endOf('month')]);
    const [view, setView] = useState<'chart' | 'table'>('chart');
    const navigate = useBackgroundNavigate();

    const [startDate, endDate] = dates;
    const start = startDate.startOf('day').format('YYYY-MM-DD HH:mm:ss');
    const end = endDate.endOf('day').format('YYYY-MM-DD HH:mm:ss');

    const { data: statsResult, isFetching } = useQuery(
        ['transactions-by-payment-type', start, end],
        async () => {
            const result = await StatisticsService.getTransactionsByPaymentType({ start_date: start, end_date: end });
            if (result.status === 200) return result.data;
            throw new Error(result.data as string);
        },
        { keepPreviousData: true },
    );

    const stats = statsResult ?? null;
    const onDateChange = useCallback((value: any) => { if (value && value[0] && value[1]) setDates(value); }, []);

    const openDetails = useCallback(() => {
        navigate('/statistics/transactions/payment-counts/by-payment-types/details', { withBackground: true, state: { startDate: start, endDate: end } });
    }, [navigate, start, end]);

    const inputs = useMemo(
        () => <Space size={8}><DatePicker.RangePicker allowClear={false} onChange={onDateChange} value={dates} /></Space>,
        [onDateChange, dates],
    );

    if (isFetching && !stats) {
        return <PageContent title='Balans əməliyyatları statistikası' extra={inputs}><Spin style={{ display: 'block', padding: '80px 0', textAlign: 'center' }} /></PageContent>;
    }

    if (!stats?.data.length) {
        return <PageContent title='Balans əməliyyatları statistikası' extra={inputs}><Empty description='Məlumat yoxdur...' /></PageContent>;
    }

    return (
        <PageContent title='Balans əməliyyatları statistikası' extra={inputs}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Radio.Group value={view} onChange={(e) => setView(e.target.value)}>
                    <Radio.Button value='chart'><Icons.LineChartOutlined /> Qrafik</Radio.Button>
                    <Radio.Button value='table'><Icons.TableOutlined /> Cədvəl</Radio.Button>
                </Radio.Group>
                <Button.Group>
                    <Button onClick={openDetails}>{stats.total.count} ədəd</Button>
                    <Button onClick={openDetails}>office: {stats.total.office}</Button>
                    <Button onClick={openDetails}>online: {stats.total.online}</Button>
                    <Button onClick={openDetails}>cəmi: {stats.total.price}</Button>
                </Button.Group>
            </div>
            {view === 'chart' && (
                <StatisticsLineChart labels={stats.data.map((r) => r.date)} datasets={[{ label: 'Ümumi məbləğ', data: stats.data.map((r) => Number(r.price) || 0) }]} />
            )}
            {view === 'table' && <TransactionsByPaymentTypeTable data={stats.data} />}
        </PageContent>
    );
};
