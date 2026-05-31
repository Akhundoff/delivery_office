import { FC, useMemo } from 'react';
import { Table } from 'antd';
import { ColumnType } from 'antd/es/table';
import { CurrencySymbols } from '@modules/orders/constants';
import { ICouriersCountByRegionOverviewStatistic } from '../interfaces';

export const CouriersCountByRegionsOverviewStatisticsTable: FC<{ data: ICouriersCountByRegionOverviewStatistic[] }> = ({ data }) => {
    const columns = useMemo<ColumnType<ICouriersCountByRegionOverviewStatistic>[]>(
        () => [
            { key: 'region', dataIndex: ['region', 'name'], title: 'Rayon' },
            { key: 'count', dataIndex: 'count', title: 'Say' },
            { key: 'azn', dataIndex: ['paymentAmount', 'azn'], title: `Məbləğ (${CurrencySymbols.AZN})`, render: (value: number) => value.toFixed(2) },
            { key: 'usd', dataIndex: ['paymentAmount', 'usd'], title: `Məbləğ (${CurrencySymbols.USD})`, render: (value: number) => value.toFixed(2) },
        ],
        [],
    );

    return <Table rowKey='id' dataSource={data} size='small' pagination={false} bordered columns={columns} />;
};
