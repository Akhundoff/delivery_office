import { FC, useCallback, useMemo } from 'react';
import { Col, Row, Table } from 'antd';
import { ColumnType } from 'antd/es/table';
import groupBy from 'lodash/groupBy';
import dayjs from 'dayjs';
import { useBackgroundNavigate } from '@shared/hooks';
import { IUsersCountStatistic } from '../interfaces';

type Props = { data: IUsersCountStatistic[]; gender?: 'male' | 'female'; ageFrom: number; ageTo: number };

export const UsersCountStatisticsTable: FC<Props> = ({ data, gender, ageFrom, ageTo }) => {
    const navigate = useBackgroundNavigate();
    const groupedData = useMemo(() => groupBy(data, (item) => item.createdAt.substring(0, 7)), [data]);

    const openDetails = useCallback(
        (date: string) => {
            navigate('/statistics/users/counts/details', {
                withBackground: true,
                state: {
                    gender,
                    ageFrom,
                    ageTo,
                    dateFrom: dayjs(date).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
                    dateTo: dayjs(date).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
                },
            });
        },
        [navigate, gender, ageFrom, ageTo],
    );

    const columns = useMemo<ColumnType<IUsersCountStatistic>[]>(
        () => [
            { key: 'createdAt', dataIndex: 'createdAt', title: 'Tarix' },
            { key: 'count', dataIndex: 'count', title: 'Say', render: (value: number, record) => <a onClick={() => openDetails(record.createdAt)}>{value} ədəd</a> },
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
