import { FC, useCallback, useMemo, useState } from 'react';
import { Button, Card, DatePicker, Empty, Radio, Select, Space, Spin } from 'antd';
import * as Icons from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { useQuery } from 'react-query';
import { PageContent } from '@shared/styled/page-content';
import { useBackgroundNavigate } from '@shared/hooks';
import { StatisticsService } from '../services';
import { StatisticsLineChart } from '../components/statistics-line-chart';
import { UsersCountStatisticsTable } from '../components/users-count-statistics-table';

const AGE_RANGES: { label: string; value: string }[] = [
    { label: 'Bütün yaşlar', value: '0-100' },
    { label: '18 yaşa qədər', value: '0-18' },
    { label: '19-25 yaş arası', value: '19-25' },
    { label: '26-35 yaş arası', value: '26-35' },
    { label: '36-45 yaş arası', value: '36-45' },
    { label: '45 yaşdan böyük', value: '45-100' },
];

export const UsersCountsPage: FC = () => {
    const [dates, setDates] = useState<[Dayjs, Dayjs]>([dayjs().startOf('month'), dayjs().endOf('month')]);
    const [view, setView] = useState<'chart' | 'table'>('chart');
    const [gender, setGender] = useState<'male' | 'female' | undefined>(undefined);
    const [age, setAge] = useState<[number, number]>([0, 100]);
    const navigate = useBackgroundNavigate();

    const [startDate, endDate] = dates;
    const [ageFrom, ageTo] = age;
    const start = startDate.startOf('day').format('YYYY-MM-DD HH:mm:ss');
    const end = endDate.endOf('day').format('YYYY-MM-DD HH:mm:ss');

    const { data: statsResult, isFetching } = useQuery(
        ['users-counts', start, end, gender, ageFrom, ageTo],
        async () => {
            const result = await StatisticsService.getUsersCount({ start_date: start, end_date: end, gender, start_age: ageFrom, end_age: ageTo });
            if (result.status === 200) return result.data;
            throw new Error(result.data as string);
        },
        { keepPreviousData: true },
    );

    const stats = statsResult ?? null;

    const onDateChange = useCallback((value: any) => { if (value && value[0] && value[1]) setDates(value); }, []);
    const onAgeChange = useCallback((value?: string) => {
        if (!value) return setAge([0, 100]);
        const [from, to] = value.split('-');
        setAge([parseInt(from), parseInt(to)]);
    }, []);

    const openDetails = useCallback(
        (from: number, to: number) => {
            navigate('/statistics/users/counts/details', {
                withBackground: true,
                state: { gender, ageFrom: from, ageTo: to, dateFrom: start, dateTo: end },
            });
        },
        [navigate, gender, start, end],
    );

    const inputs = useMemo(
        () => (
            <Space size={8}>
                <Select placeholder='Yaş aralığı seçin...' value={age.join('-')} onChange={onAgeChange} allowClear style={{ width: 180 }}>
                    {AGE_RANGES.map((r) => <Select.Option key={r.value} value={r.value}>{r.label}</Select.Option>)}
                </Select>
                <Select placeholder='Cinsi seçin...' allowClear style={{ width: 160 }} value={gender} onChange={setGender}>
                    <Select.Option value='male'>Kişi</Select.Option>
                    <Select.Option value='female'>Qadın</Select.Option>
                </Select>
                <DatePicker.RangePicker allowClear={false} onChange={onDateChange} value={dates} />
            </Space>
        ),
        [age, onAgeChange, gender, onDateChange, dates],
    );

    if (isFetching && !stats) {
        return <PageContent title='İstifadəçi sayları üzrə statistika' extra={inputs}><Spin style={{ display: 'block', padding: '80px 0', textAlign: 'center' }} /></PageContent>;
    }

    if (!stats?.data.length) {
        return <PageContent title='İstifadəçi sayları üzrə statistika' extra={inputs}><Empty description='Məlumat yoxdur...' /></PageContent>;
    }

    return (
        <PageContent title='İstifadəçi sayları üzrə statistika' extra={inputs}>
            <Radio.Group value={view} onChange={(e) => setView(e.target.value)} style={{ marginBottom: 12 }}>
                <Radio.Button value='chart'><Icons.LineChartOutlined /> Qrafik</Radio.Button>
                <Radio.Button value='table'><Icons.TableOutlined /> Cədvəl</Radio.Button>
            </Radio.Group>
            <Card size='small' title='Yaş aralıqlarına görə' type='inner' style={{ marginBottom: 12 }}>
                <Button.Group>
                    {stats.total.byAges.map((item, index) => (
                        <Button key={index} onClick={() => openDetails(item.from, item.to)}>
                            <b>{item.from}-{item.to}</b>: {item.count} nəfər
                        </Button>
                    ))}
                </Button.Group>
            </Card>
            {view === 'chart' && (
                <StatisticsLineChart labels={stats.data.map((r) => r.createdAt)} datasets={[{ label: 'İstifadəçi sayı', data: stats.data.map((r) => r.count) }]} />
            )}
            {view === 'table' && <UsersCountStatisticsTable data={stats.data} gender={gender} ageFrom={ageFrom} ageTo={ageTo} />}
        </PageContent>
    );
};
