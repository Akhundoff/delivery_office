import { FC, useCallback, useMemo } from 'react';
import { Col, Row, Table, Typography } from 'antd';
import { ColumnType } from 'antd/es/table';
import groupBy from 'lodash/groupBy';
import dayjs from 'dayjs';
import { useBackgroundNavigate } from '@shared/hooks';
import { CurrencySymbols } from '@modules/orders/constants';
import { ICouriersCountByRegionStatistic } from '../interfaces';

export const CouriersCountByRegionsStatisticsTable: FC<{ data: ICouriersCountByRegionStatistic[]; statusId: number }> = ({ data, statusId }) => {
    const navigate = useBackgroundNavigate();
    const groupedData = useMemo(() => groupBy(data, (item) => item.updatedAt.substring(0, 7)), [data]);

    const openDetails = useCallback(
        (date: string, regionId: number) => {
            navigate('/statistics/couriers/counts/by-regions/details', {
                withBackground: true,
                state: {
                    statusId,
                    regionId,
                    dateFrom: dayjs(date).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
                    dateTo: dayjs(date).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
                },
            });
        },
        [navigate, statusId],
    );

    const columns = useMemo<ColumnType<ICouriersCountByRegionStatistic>[]>(
        () => [
            { key: 'updatedAt', dataIndex: 'updatedAt', title: 'Tarix' },
            { key: 'region', dataIndex: ['region', 'name'], title: 'Rayon' },
            { key: 'count', dataIndex: 'count', title: 'Say', render: (value: number, record) => <Typography.Link onClick={() => openDetails(record.updatedAt, record.region.id)}>{value} ədəd</Typography.Link> },
            { key: 'azn', dataIndex: ['paymentAmount', 'azn'], title: `Məbləğ (${CurrencySymbols.AZN})`, render: (value: number) => value.toFixed(2) },
            { key: 'usd', dataIndex: ['paymentAmount', 'usd'], title: `Məbləğ (${CurrencySymbols.USD})`, render: (value: number) => value.toFixed(2) },
        ],
        [openDetails],
    );

    const renderTitle = useCallback((month: string) => {
        const date = dayjs(month, 'YYYY-MM');
        return `${date.startOf('month').format('DD.MM.YYYY')} - ${date.endOf('month').format('DD.MM.YYYY')}`;
    }, []);

    return (
        <Row gutter={[12, 12]}>
            {Object.entries(groupedData).map(([month, items]) => (
                <Col key={month} xs={24} lg={12}>
                    <Table title={() => renderTitle(month)} size='small' bordered={true} columns={columns} rowKey='id' dataSource={items} pagination={false} />
                </Col>
            ))}
        </Row>
    );
};
