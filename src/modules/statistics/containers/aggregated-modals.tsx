import { FC } from 'react';
import { Col, Modal, Progress, Row, Spin, Statistic } from 'antd';
import { useLocation } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useCloseModal } from '@shared/hooks';
import { CurrencySymbols } from '@modules/orders/constants';
import { StatisticsService } from '../services';
import { CouriersCountByRegionsOverviewStatisticsTable } from '../components/couriers-count-by-regions-overview-statistics-table';

export const CouriersByRegionsOverviewModal: FC = () => {
    const [close] = useCloseModal();
    const { dateFrom, dateTo, statusId } = (useLocation().state || {}) as any;

    const { data, isLoading } = useQuery(
        ['couriers-overview-modal', dateFrom, dateTo, statusId],
        async () => {
            const result = await StatisticsService.getCouriersCountByRegionsOverview({ start_date: dateFrom, end_date: dateTo, state_id: statusId });
            if (result.status === 200) return result.data;
            throw new Error(result.data as string);
        },
    );

    return (
        <Modal open onCancel={() => close('/statistics/couriers/counts')} footer={null} width={992} closable={false}>
            {isLoading ? <Spin style={{ display: 'block', margin: '48px auto' }} /> : <CouriersCountByRegionsOverviewStatisticsTable data={data || []} />}
        </Modal>
    );
};

const StatusCountsModal: FC<{ modelId: number; dataKey: 'declarations' | 'orders'; fallback: string }> = ({ modelId, dataKey, fallback }) => {
    const [close] = useCloseModal();
    const { data } = useQuery(
        ['counts-by-status', modelId],
        async () => {
            const result = await StatisticsService.getCountsByStatus(modelId, dataKey);
            if (result.status === 200) return result.data;
            throw new Error(result.data as string);
        },
    );

    const total = (data || []).reduce((acc, item) => acc + item.count, 0) || 1;

    return (
        <Modal open onCancel={() => close(fallback)} footer={null} width={992} closable={false}>
            <Row gutter={[16, 16]}>
                {(data || []).map((status) => (
                    <Col xs={24} sm={12} key={status.id}>
                        <div style={{ marginBottom: 4 }}>{status.name}: <b>{status.count}</b></div>
                        <Progress percent={Math.round((status.count / total) * 100)} />
                    </Col>
                ))}
            </Row>
        </Modal>
    );
};

export const DeclarationCountsByStatusModal: FC = () => <StatusCountsModal modelId={2} dataKey='declarations' fallback='/statistics' />;
export const OrderCountsByStatusModal: FC = () => <StatusCountsModal modelId={1} dataKey='orders' fallback='/statistics' />;

export const UsersGeneralModal: FC = () => {
    const [close] = useCloseModal();
    const { data, isLoading } = useQuery(['users-general'], async () => {
        const result = await StatisticsService.getUsersGeneral();
        if (result.status === 200) return result.data;
        throw new Error(result.data as string);
    });

    return (
        <Modal open onCancel={() => close('/statistics/users/counts')} footer={null} width={640} closable={false} title='Ümumi istifadəçi statistikası'>
            {isLoading || !data ? (
                <Spin style={{ display: 'block', margin: '48px auto' }} />
            ) : (
                <Row gutter={[16, 16]}>
                    <Col xs={12}><Statistic title='Ümumi müştəri' value={data.counts.totalClient} /></Col>
                    <Col xs={12}><Statistic title='Sifariş verən müştəri' value={data.counts.orderedClient} /></Col>
                    <Col xs={12}><Statistic title={`Balans (${CurrencySymbols.USD})`} value={data.balance.usd} precision={2} /></Col>
                    <Col xs={12}><Statistic title={`Balans (${CurrencySymbols.TRY})`} value={data.balance.try} precision={2} /></Col>
                </Row>
            )}
        </Modal>
    );
};

export const TransactionBalancesModal: FC = () => {
    const [close] = useCloseModal();
    const { data, isLoading } = useQuery(['transaction-balances'], async () => {
        const result = await StatisticsService.getTransactionBalance();
        if (result.status === 200) return result.data;
        throw new Error(result.data as string);
    });

    return (
        <Modal open onCancel={() => close('/statistics/transactions/by-user')} footer={null} width={720} closable={false} title='Balans statistikası'>
            {isLoading || !data ? (
                <Spin style={{ display: 'block', margin: '48px auto' }} />
            ) : (
                <Row gutter={[16, 16]}>
                    <Col xs={12}><Statistic title={`Bugünkü mədaxil (${CurrencySymbols.USD})`} value={data.todayIncome.usd} precision={2} /></Col>
                    <Col xs={12}><Statistic title={`Bugünkü mədaxil (${CurrencySymbols.TRY})`} value={data.todayIncome.try} precision={2} /></Col>
                    <Col xs={12}><Statistic title={`Bugünkü məxaric (${CurrencySymbols.USD})`} value={data.todayOutcome.usd} precision={2} /></Col>
                    <Col xs={12}><Statistic title={`Bugünkü məxaric (${CurrencySymbols.TRY})`} value={data.todayOutcome.try} precision={2} /></Col>
                    <Col xs={12}><Statistic title={`Ümumi balans (${CurrencySymbols.USD})`} value={data.balance.usd} precision={2} /></Col>
                    <Col xs={12}><Statistic title={`Ümumi balans (${CurrencySymbols.TRY})`} value={data.balance.try} precision={2} /></Col>
                </Row>
            )}
        </Modal>
    );
};
