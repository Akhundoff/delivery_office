import { FC, useCallback, useMemo } from 'react';
import { Col, Row, Table } from 'antd';
import { ColumnType } from 'antd/es/table';
import groupBy from 'lodash/groupBy';
import dayjs from 'dayjs';
import { useBackgroundNavigate } from '@shared/hooks';
import { getCurrencySymbolByCountryId } from '@modules/orders/constants';
import { IOrderStatisticByAdmin } from '../interfaces';

export const OrdersByAdminTable: FC<{ data: IOrderStatisticByAdmin[]; countryId: number }> = ({ data, countryId }) => {
    const navigate = useBackgroundNavigate();
    const groupedData = useMemo(() => groupBy(data, (item) => item.updatedAt.substring(0, 7)), [data]);

    const openDetails = useCallback(
        (date: string, adminId: number) => {
            navigate('/statistics/orders/by-admin/details', {
                withBackground: true,
                state: {
                    countryId,
                    adminId,
                    startDate: dayjs(date).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
                    endDate: dayjs(date).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
                },
            });
        },
        [navigate, countryId],
    );

    const columns = useMemo<ColumnType<IOrderStatisticByAdmin>[]>(
        () => [
            { key: 'updatedAt', dataIndex: 'updatedAt', title: 'Tarix' },
            { key: 'user', dataIndex: 'user', title: 'Admin', render: (value: IOrderStatisticByAdmin['user']) => value.name },
            {
                key: 'count',
                dataIndex: 'count',
                title: 'Say',
                render: (value: number, row) => (
                    <a onClick={() => openDetails(row.updatedAt, row.user.id)}>{value} ədəd</a>
                ),
            },
            { key: 'price', dataIndex: 'price', title: 'Məbləğ', render: (value: number) => `${value.toFixed(2)} ${getCurrencySymbolByCountryId(countryId)}` },
        ],
        [countryId, openDetails],
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
