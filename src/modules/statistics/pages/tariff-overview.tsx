import { FC, useCallback, useMemo, useState } from 'react';
import { Checkbox, DatePicker, Empty, Result, Select, Space, Spin } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useQuery } from 'react-query';
import { PageContent } from '@shared/styled/page-content';
import { useStatuses } from '@modules/statuses/hooks';
import { StatisticsService } from '../services';
import { TariffOverviewStatisticsTable } from '../components/tariff-overview-statistics-table';

export const TariffOverviewPage: FC = () => {
    const [dates, setDates] = useState<[Dayjs, Dayjs]>([dayjs().startOf('month'), dayjs().endOf('month')]);
    const [statusId, setStatusId] = useState<number>(9);
    const [paid, setPaid] = useState<boolean>(true);

    const [startDate, endDate] = dates;
    const start = startDate.startOf('day').format('YYYY-MM-DD HH:mm:ss');
    const end = endDate.endOf('day').format('YYYY-MM-DD HH:mm:ss');

    const statuses = useStatuses({ model_id: 2 });

    const { data: statsResult, isFetching, error } = useQuery(
        ['tariff-overview', start, end, statusId, paid],
        async () => {
            const result = await StatisticsService.getTariffStats({ from_date: start, to_date: end, state_id: statusId, payed: paid ? 1 : 0 });
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
                <Checkbox onChange={(e) => setPaid(e.target.checked)} checked={paid}>Ödəniş</Checkbox>
                <Select placeholder='Status seçin' style={{ width: 200 }} value={statusId} onChange={setStatusId} loading={statuses.isLoading}>
                    {(statuses.data || []).map((status) => <Select.Option value={status.id} key={status.id}>{status.name}</Select.Option>)}
                </Select>
                <DatePicker.RangePicker allowClear={false} onChange={onDateChange} value={dates} />
            </Space>
        ),
        [statusId, statuses.data, statuses.isLoading, onDateChange, dates, paid],
    );

    if (isFetching && !stats) {
        return <PageContent title='Tariflər üzrə statistika' extra={inputs}><Spin style={{ display: 'block', padding: '80px 0', textAlign: 'center' }} /></PageContent>;
    }

    if (error) {
        return <PageContent title='Tariflər üzrə statistika' extra={inputs}><Result status='500' title={(error as Error).message} /></PageContent>;
    }

    if (!stats?.length) {
        return <PageContent title='Tariflər üzrə statistika' extra={inputs}><Empty description='Məlumat yoxdur...' /></PageContent>;
    }

    return (
        <PageContent title='Tariflər üzrə statistika' extra={inputs}>
            <TariffOverviewStatisticsTable data={stats} />
        </PageContent>
    );
};
