import { FC, useCallback, useMemo } from 'react';
import { Col, Row, Table, Typography } from 'antd';
import { ColumnType } from 'antd/es/table';
import groupBy from 'lodash/groupBy';
import dayjs from 'dayjs';
import { useBackgroundNavigate } from '@shared/hooks';
import { ICashFlowDailyTransaction } from '../interfaces';

type Props = {
    data: ICashFlowDailyTransaction[];
    operationType: number;
    paymentType?: number;
    cashCategoryId?: number | string;
    cashCategoryIdParent?: number | string;
    cashRegister?: number;
};

export const CashFlowTransactionsTable: FC<Props> = ({ data, operationType, paymentType, cashCategoryId, cashCategoryIdParent, cashRegister }) => {
    const navigate = useBackgroundNavigate();
    const groupedData = useMemo(() => groupBy(data, (item) => item.date.substring(0, 7)), [data]);

    const openDetails = useCallback(
        (date: string) => {
            navigate('/statistics/cashflow-transactions/details', {
                withBackground: true,
                state: {
                    operationType,
                    paymentType,
                    cashCategoryId,
                    cashCategoryIdParent,
                    cashRegister,
                    startDate: dayjs(date).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
                    endDate: dayjs(date).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
                },
            });
        },
        [navigate, operationType, paymentType, cashCategoryId, cashCategoryIdParent, cashRegister],
    );

    const columns = useMemo<ColumnType<ICashFlowDailyTransaction>[]>(
        () => [
            { key: 'date', dataIndex: 'date', title: 'Tarix' },
            { key: 'count', dataIndex: 'count', title: 'Say', render: (value: number, record) => <Typography.Link onClick={() => openDetails(record.date)}>{value} ədəd</Typography.Link> },
            { key: 'price', dataIndex: 'price', title: 'Məbləğ', render: (value: number) => value.toFixed(2) },
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
