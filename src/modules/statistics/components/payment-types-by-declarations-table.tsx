import { FC, useCallback, useMemo } from 'react';
import { Col, Row, Table } from 'antd';
import { ColumnType } from 'antd/es/table';
import groupBy from 'lodash/groupBy';
import dayjs from 'dayjs';
import { useBackgroundNavigate } from '@shared/hooks';
import { CurrencySymbols } from '@modules/orders/constants';
import { IPaymentTypeStatisticByDeclaration } from '../interfaces';

export const PaymentTypesByDeclarationsTable: FC<{ data: IPaymentTypeStatisticByDeclaration[] }> = ({ data }) => {
    const navigate = useBackgroundNavigate();
    const groupedData = useMemo(() => groupBy(data, (item) => item.paidAt.substring(0, 7)), [data]);

    const openDetails = useCallback(
        (date: string, paymentTypeId?: number) => {
            navigate('/statistics/transactions/payment-types/by-declarations/details', {
                withBackground: true,
                state: {
                    paymentTypeId,
                    startDate: dayjs(date).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
                    endDate: dayjs(date).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
                },
            });
        },
        [navigate],
    );

    const columns = useMemo<ColumnType<IPaymentTypeStatisticByDeclaration>[]>(
        () => [
            { key: 'paidAt', dataIndex: 'paidAt', title: 'Tarix' },
            { key: 'count', dataIndex: 'count', title: 'Say', render: (value: number, record) => <a onClick={() => openDetails(record.paidAt, record.paymentType.id)}>{value} ədəd</a> },
            { key: 'paymentType', dataIndex: ['paymentType', 'name'], title: 'Ödəniş tipi' },
            { key: 'usd', dataIndex: ['deliveryPrice', 'usd'], title: `Çatdırılma (${CurrencySymbols.USD})`, render: (value: number) => value.toFixed(2) },
            { key: 'azn', dataIndex: ['deliveryPrice', 'azn'], title: `Çatdırılma (${CurrencySymbols.AZN})`, render: (value: number) => value.toFixed(2) },
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
                <Col key={month} xs={24} xl={12}>
                    <Table title={() => renderTitle(month)} size='small' bordered={true} columns={columns} rowKey='id' dataSource={items} pagination={false} />
                </Col>
            ))}
        </Row>
    );
};
