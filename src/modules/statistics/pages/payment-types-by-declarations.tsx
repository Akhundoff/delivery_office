import { FC, useCallback, useMemo, useState } from 'react';
import { Button, DatePicker, Empty, Radio, Select, Space, Spin, Typography } from 'antd';
import * as Icons from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { useQuery } from 'react-query';
import uniq from 'lodash/uniq';
import groupBy from 'lodash/groupBy';
import { PageContent } from '@shared/styled/page-content';
import { useBackgroundNavigate } from '@shared/hooks';
import { CurrencySymbols } from '@modules/orders/constants';
import { StatisticsService } from '../services';
import { PAYMENT_TYPES } from '../constants';
import { StatisticsLineChart } from '../components/statistics-line-chart';
import { PaymentTypesByDeclarationsTable } from '../components/payment-types-by-declarations-table';
import { getChartColor } from '../components/chart-colors';

export const PaymentTypesByDeclarationsPage: FC = () => {
    const [dates, setDates] = useState<[Dayjs, Dayjs]>([dayjs().startOf('month'), dayjs().endOf('month')]);
    const [view, setView] = useState<'chart' | 'table'>('chart');
    const [paymentTypeIds, setPaymentTypeIds] = useState<number[]>([]);
    const navigate = useBackgroundNavigate();

    const [startDate, endDate] = dates;
    const start = startDate.startOf('day').format('YYYY-MM-DD HH:mm:ss');
    const end = endDate.endOf('day').format('YYYY-MM-DD HH:mm:ss');

    const { data: statsResult, isFetching } = useQuery(
        ['payment-types-by-declarations', start, end, paymentTypeIds],
        async () => {
            const result = await StatisticsService.getPaymentTypesByDeclarations({ start_date: start, end_date: end, payment_type: paymentTypeIds });
            if (result.status === 200) return result.data;
            throw new Error(result.data as string);
        },
        { keepPreviousData: true },
    );

    const stats = statsResult ?? null;
    const onDateChange = useCallback((value: any) => { if (value && value[0] && value[1]) setDates(value); }, []);

    const openDetails = useCallback(() => {
        navigate('/statistics/transactions/payment-types/by-declarations/details', { withBackground: true, state: { startDate: start, endDate: end } });
    }, [navigate, start, end]);

    const chart = useMemo(() => {
        if (!stats?.data.length) return { labels: [] as string[], datasets: [] as { label: string; data: number[]; color: string }[] };
        const labels = uniq(stats.data.map((item) => item.paidAt));
        const byType = groupBy(stats.data, (item) => item.paymentType.id);
        const datasets = Object.values(byType).map((rows, index) => ({
            label: rows[0].paymentType.name,
            color: getChartColor(index),
            data: labels.map((date) => rows.find((r) => r.paidAt === date)?.deliveryPrice.usd ?? 0),
        }));
        return { labels, datasets };
    }, [stats]);

    const inputs = useMemo(
        () => (
            <Space size={8}>
                <Select<number[]> mode='multiple' placeholder='Ödəniş üsulu' style={{ minWidth: 200 }} value={paymentTypeIds} onChange={setPaymentTypeIds} allowClear>
                    {PAYMENT_TYPES.map((paymentType) => <Select.Option key={paymentType.id} value={paymentType.id}>{paymentType.name}</Select.Option>)}
                </Select>
                <DatePicker.RangePicker allowClear={false} onChange={onDateChange} value={dates} />
            </Space>
        ),
        [onDateChange, dates, paymentTypeIds],
    );

    if (isFetching && !stats) {
        return <PageContent title='Bağlamalara görə ödəniş üsulları statistikası' extra={inputs}><Spin style={{ display: 'block', padding: '80px 0', textAlign: 'center' }} /></PageContent>;
    }

    if (!stats?.data.length) {
        return <PageContent title='Bağlamalara görə ödəniş üsulları statistikası' extra={inputs}><Empty description='Məlumat yoxdur...' /></PageContent>;
    }

    return (
        <PageContent title='Bağlamalara görə ödəniş üsulları statistikası' extra={inputs}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <Radio.Group value={view} onChange={(e) => setView(e.target.value)}>
                    <Radio.Button value='chart'><Icons.LineChartOutlined /> Qrafik</Radio.Button>
                    <Radio.Button value='table'><Icons.TableOutlined /> Cədvəl</Radio.Button>
                </Radio.Group>
                <Button.Group>
                    <Button onClick={openDetails}>{stats.total.declarationCount} ədəd</Button>
                    <Button onClick={openDetails}>{stats.total.deliveryPrice.toFixed(2)} {CurrencySymbols.USD}</Button>
                </Button.Group>
            </div>
            <Space size={16} wrap style={{ marginBottom: 12 }}>
                {stats.total.byPaymentTypes.map((paymentType) => (
                    <Typography.Text key={paymentType.id}><b>{paymentType.name}</b>: {paymentType.deliveryPrice.toFixed(2)}{CurrencySymbols.USD}</Typography.Text>
                ))}
            </Space>
            {view === 'chart' && <StatisticsLineChart labels={chart.labels} datasets={chart.datasets} />}
            {view === 'table' && <PaymentTypesByDeclarationsTable data={stats.data} />}
        </PageContent>
    );
};
