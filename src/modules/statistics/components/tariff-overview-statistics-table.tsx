import { FC, useMemo } from 'react';
import { Table } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { ColumnType } from 'antd/es/table';
import { CurrencySymbols } from '@modules/orders/constants';
import { ITariffOverviewStatistic } from '../interfaces';

export const TariffOverviewStatisticsTable: FC<{ data: ITariffOverviewStatistic[] }> = ({ data }) => {
    const columns = useMemo<ColumnType<ITariffOverviewStatistic>[]>(
        () => [
            { key: 'id', dataIndex: 'id', title: 'Kod' },
            {
                key: 'tariff',
                title: 'Tarif',
                render: (_, item) => `${item.tariffFrom ? `${item.tariffFrom} kg` : ''}${item.tariffTo ? `-${item.tariffTo} kg` : '-məlumat yoxdur'}`,
            },
            { key: 'price', dataIndex: 'price', title: 'Qiymət', render: (value: string) => (value ? `${value} ${CurrencySymbols.USD}` : null) },
            { key: 'count', dataIndex: 'count', title: 'Say' },
            { key: 'type', title: 'Maye', render: (_, item) => (item.type === '1' ? <CheckOutlined /> : null) },
            { key: 'totalWeight', dataIndex: 'totalWeight', title: 'Ümumi çəki', render: (value: number) => (value ? `${value} kg` : null) },
            { key: 'totalDeliveryPrice', dataIndex: 'totalDeliveryPrice', title: 'Ümumi çatdırılma qiyməti', render: (value: number) => (value ? `${value} ${CurrencySymbols.USD}` : null) },
        ],
        [],
    );

    return <Table rowKey='id' dataSource={data} size='small' pagination={false} bordered columns={columns} />;
};
