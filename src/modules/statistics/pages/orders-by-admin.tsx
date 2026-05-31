import { FC, useCallback, useMemo, useState } from 'react';
import { Button, DatePicker, Empty, Radio, Select, Space, Spin } from 'antd';
import * as Icons from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { useQuery } from 'react-query';
import { PageContent } from '@shared/styled/page-content';
import { filterOption } from '@shared/modules/antd/helpers/filter-option';
import { CountryIds, getCurrencySymbolByCountryId } from '@modules/orders/constants';
import { useBackgroundNavigate } from '@shared/hooks';
import { StatisticsService } from '../services';
import { OrdersByAdminChart } from '../components/orders-by-admin-chart';
import { OrdersByAdminTable } from '../components/orders-by-admin-table';

const COUNTRY_NAMES: Record<number, string> = {
    [CountryIds.TURKIYE]: 'Türkiyə',
    [CountryIds.AMERICA]: 'Amerika',
    [CountryIds.CHINA]: 'Çin',
    [CountryIds.SPAIN]: 'İspaniya',
};

export const OrdersByAdminPage: FC = () => {
    const [dates, setDates] = useState<[Dayjs, Dayjs]>([dayjs().startOf('month'), dayjs().endOf('month')]);
    const [view, setView] = useState<'chart' | 'table'>('chart');
    const [countryId, setCountryId] = useState<number>(CountryIds.TURKIYE);
    const [adminId, setAdminId] = useState<number | undefined>(undefined);
    const navigate = useBackgroundNavigate();

    const [startDate, endDate] = dates;
    const start = startDate.startOf('day').format('YYYY-MM-DD HH:mm:ss');
    const end = endDate.endOf('day').format('YYYY-MM-DD HH:mm:ss');

    const admins = useQuery(['statistics-admins'], async () => {
        const result = await StatisticsService.getAdmins();
        if (result.status === 200) return result.data;
        throw new Error(result.data as string);
    });

    const { data: statsResult, isFetching } = useQuery(
        ['orders-by-admin', start, end, countryId, adminId],
        async () => {
            const result = await StatisticsService.getOrdersByAdmin({ start_date: start, end_date: end, country_id: countryId, admin_id: adminId });
            if (result.status === 200) return result.data;
            throw new Error(result.data as string);
        },
        { keepPreviousData: true },
    );

    const stats = statsResult ?? null;

    const onDateChange = useCallback((value: any) => { if (value && value[0] && value[1]) setDates(value); }, []);

    const openDetails = useCallback(() => {
        navigate('/statistics/orders/by-admin/details', {
            withBackground: true,
            state: { countryId, adminId, startDate: start, endDate: end },
        });
    }, [navigate, countryId, adminId, start, end]);

    const inputs = useMemo(
        () => (
            <Space size={8}>
                <Select style={{ width: 160 }} value={countryId} onChange={setCountryId} showSearch filterOption={filterOption}>
                    {Object.entries(COUNTRY_NAMES).map(([id, name]) => (
                        <Select.Option key={id} value={Number(id)}>{name}</Select.Option>
                    ))}
                </Select>
                <Select
                    allowClear
                    showSearch
                    filterOption={filterOption}
                    placeholder='İstifadəçi seçin'
                    style={{ width: 200 }}
                    loading={admins.isLoading}
                    value={adminId}
                    onChange={(v) => setAdminId(v)}
                >
                    {(admins.data || []).map((user) => (
                        <Select.Option key={user.id} value={user.id}>{user.name}</Select.Option>
                    ))}
                </Select>
                <DatePicker.RangePicker allowClear={false} onChange={onDateChange} value={dates} />
            </Space>
        ),
        [countryId, adminId, admins.data, admins.isLoading, onDateChange, dates],
    );

    if (isFetching && !stats) {
        return <PageContent title='Sifarişlər üzrə statistika (Adminlər üzrə)' extra={inputs}><Spin style={{ display: 'block', padding: '80px 0', textAlign: 'center' }} /></PageContent>;
    }

    if (!stats?.items.length) {
        return <PageContent title='Sifarişlər üzrə statistika (Adminlər üzrə)' extra={inputs}><Empty description='Məlumat yoxdur...' /></PageContent>;
    }

    return (
        <PageContent title='Sifarişlər üzrə statistika (Adminlər üzrə)' extra={inputs}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Radio.Group value={view} onChange={(e) => setView(e.target.value)}>
                    <Radio.Button value='chart'><Icons.LineChartOutlined /> Qrafik</Radio.Button>
                    <Radio.Button value='table'><Icons.TableOutlined /> Cədvəl</Radio.Button>
                </Radio.Group>
                <Button.Group>
                    <Button onClick={openDetails}>{stats.total.count} ədəd</Button>
                    <Button onClick={openDetails}>{stats.total.price.toFixed(2)} {getCurrencySymbolByCountryId(countryId)}</Button>
                </Button.Group>
            </div>
            {view === 'chart' && <OrdersByAdminChart data={stats.items} />}
            {view === 'table' && <OrdersByAdminTable data={stats.items} countryId={countryId} />}
        </PageContent>
    );
};
