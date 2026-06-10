import { FC, useCallback, useMemo } from 'react';
import { Col, Row, Space, Table, Typography } from 'antd';
import * as Icons from '@ant-design/icons';
import { ColumnType } from 'antd/es/table';
import groupBy from 'lodash/groupBy';
import dayjs from 'dayjs';
import { useBackgroundNavigate } from '@shared/hooks';
import { CurrencySymbols } from '@modules/orders/constants';
import { ICouriersCountStatistic } from '../interfaces';

export const CouriersCountStatisticsTable: FC<{ data: ICouriersCountStatistic[]; statusId?: number }> = ({ data, statusId }) => {
    const navigate = useBackgroundNavigate();
    const groupedData = useMemo(() => groupBy(data, (item) => item.updatedAt.substring(0, 7)), [data]);

    const range = useCallback(
        (date: string) => ({
            dateFrom: dayjs(date).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
            dateTo: dayjs(date).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
        }),
        [],
    );

    const openDetails = useCallback(
        (date: string) => navigate('/statistics/couriers/counts/details', { withBackground: true, state: { ...range(date), statusId } }),
        [navigate, range, statusId],
    );

    const openOverview = useCallback(
        (date: string) => navigate('/statistics/couriers/counts/by-regions/overview', { withBackground: true, state: { ...range(date), statusId } }),
        [navigate, range, statusId],
    );

    const columns = useMemo<ColumnType<ICouriersCountStatistic>[]>(
        () => [
            { key: 'updatedAt', dataIndex: 'updatedAt', title: 'Tarix' },
            {
                key: 'count',
                dataIndex: 'count',
                title: 'Say',
                render: (value: number, record) => (
                    <Space size={8}>
                        <Typography.Link onClick={() => openOverview(record.updatedAt)}><Icons.PicLeftOutlined /></Typography.Link>
                        <Typography.Link onClick={() => openDetails(record.updatedAt)}>{value} ədəd</Typography.Link>
                    </Space>
                ),
            },
            { key: 'cash', dataIndex: ['paymentAmounts', 'cash'], title: 'Nağd', render: (value: number) => `${value.toFixed(2)} ${CurrencySymbols.AZN}` },
            { key: 'online', dataIndex: ['paymentAmounts', 'online'], title: 'Online', render: (value: number) => `${value.toFixed(2)} ${CurrencySymbols.AZN}` },
        ],
        [openDetails, openOverview],
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
