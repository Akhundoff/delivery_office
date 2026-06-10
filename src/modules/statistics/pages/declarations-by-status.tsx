import React, { FC, useCallback, useState } from 'react';
import { Button, Col, DatePicker, Empty, message, Radio, Row, Select, Spin, Table } from 'antd';
import * as Icons from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { useQuery } from 'react-query';
import { PageContent } from '@shared/styled/page-content';
import { HeadPortal } from '@modules/layout/components/head-portal';
import { StyledActionBar } from '@shared/styled/action-bar';
import { useBackgroundNavigate } from '@shared/hooks';
import { CurrencySymbols } from '@modules/orders/constants';
import { StatusesService } from '@modules/statuses/services';
import { BranchesService } from '@modules/branches/services';
import { StatisticsService } from '../services';
import { StatisticsLineChart } from '../components/statistics-line-chart';

const { RangePicker } = DatePicker;

export const DeclarationsByStatusPage: FC = () => {
    const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([dayjs().startOf('month'), dayjs().endOf('month')]);
    const [statusId, setStatusId] = useState<number | undefined>(9);
    const [branchId, setBranchId] = useState<number | undefined>();
    const [view, setView] = useState<'chart' | 'table'>('chart');
    const navigate = useBackgroundNavigate();

    const { data: statusesResult } = useQuery('statuses-for-stats', () => StatusesService.getList({ per_page: 500, model_id: 2 }));
    const statuses = statusesResult?.status === 200 ? statusesResult.data.data : [];

    const { data: branchesResult } = useQuery('branches-for-stats', () => BranchesService.getList({ per_page: 500 }));
    const branches = branchesResult?.status === 200 ? branchesResult.data.data : [];

    const startDate = dateRange[0].startOf('day').format('YYYY-MM-DD HH:mm:ss');
    const endDate = dateRange[1].endOf('day').format('YYYY-MM-DD HH:mm:ss');

    const { data: statsResult, isLoading } = useQuery(
        ['declaration-stats-by-status', statusId, branchId, startDate, endDate],
        () => StatisticsService.getDeclarationsByStatus({ start_date: startDate, end_date: endDate, state_id: statusId, branch_id: branchId }),
        { enabled: !!statusId },
    );

    const stats = statsResult?.status === 200 ? statsResult.data : null;

    const onDateChange = useCallback((dates: any) => {
        if (dates && dates[0] && dates[1]) setDateRange([dates[0], dates[1]]);
    }, []);

    const openDetails = useCallback(() => {
        navigate('/statistics/declarations/by-status/details', { withBackground: true, state: { statusId, branchId, startDate, endDate } });
    }, [navigate, statusId, branchId, startDate, endDate]);

    const onExcelExport = useCallback(async () => {
        message.loading({ key: 'decl-excel', content: 'Sənəd hazırlanır...', duration: 0 });
        const result = await StatisticsService.getDeclarationsStatisticsExcel({ start_date: startDate, end_date: endDate, state_id: statusId, branch_id: branchId });
        if (result.status === 200) {
            message.success({ key: 'decl-excel', content: 'Sənəd yüklənir' });
            const objectURL = URL.createObjectURL(result.data);
            const a = document.createElement('a');
            a.href = objectURL;
            a.download = `declaration_statistics_${Math.round(Math.random() * 1000)}.xls`;
            a.click();
        } else {
            message.error({ key: 'decl-excel', content: result.data as string });
        }
    }, [startDate, endDate, statusId, branchId]);

    const actionBar = (
        <HeadPortal>
            <StyledActionBar $flex={false}>
                <Row gutter={[8, 8]} align='middle'>
                    <Col>
                        <Select style={{ width: 200 }} value={statusId} onChange={setStatusId} placeholder='Status seçin' options={statuses.map((s) => ({ value: s.id, label: s.name }))} />
                    </Col>
                    <Col>
                        <RangePicker value={dateRange} onChange={onDateChange} allowClear={false} />
                    </Col>
                    <Col>
                        <Select allowClear style={{ width: 200 }} value={branchId} onChange={setBranchId} placeholder='Filial seçin' options={branches.map((b: any) => ({ value: b.id, label: b.name }))} />
                    </Col>
                </Row>
            </StyledActionBar>
        </HeadPortal>
    );

    return (
        <PageContent>
            {actionBar}
            {isLoading && <Spin style={{ display: 'block', margin: '64px auto' }} />}
            {!isLoading && !stats?.data.length && <Empty style={{ marginTop: 64 }} description='Məlumat tapılmadı' />}
            {!isLoading && !!stats?.data.length && (
                <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                        <Row gutter={[8, 8]} align='middle'>
                            <Col>
                                <Radio.Group value={view} onChange={(e) => setView(e.target.value)}>
                                    <Radio.Button value='chart'><Icons.LineChartOutlined /> Qrafik</Radio.Button>
                                    <Radio.Button value='table'><Icons.TableOutlined /> Cədvəl</Radio.Button>
                                </Radio.Group>
                            </Col>
                            {!!branchId && (
                                <Col>
                                    <Button onClick={onExcelExport} icon={<Icons.FileExcelOutlined />}>Excel</Button>
                                </Col>
                            )}
                        </Row>
                        <Button.Group>
                            <Button onClick={openDetails}>{stats.total.count} ədəd</Button>
                            <Button onClick={openDetails}>Çatdırılma: {stats.total.deliveryPrice.toFixed(2)} {CurrencySymbols.USD}</Button>
                            <Button onClick={openDetails}>Məhsullar: {stats.total.productPrice.toFixed(2)} {CurrencySymbols.TRY}</Button>
                        </Button.Group>
                    </div>
                    {view === 'chart' && (
                        <StatisticsLineChart
                            labels={stats.data.map((r) => r.updatedAt)}
                            datasets={[{ label: 'Bağlama sayı', data: stats.data.map((r) => r.count) }]}
                        />
                    )}
                    {view === 'table' && (
                        <Table
                            dataSource={stats.data}
                            rowKey='id'
                            pagination={{ pageSize: 50 }}
                            columns={[
                                { title: 'Tarix', dataIndex: 'updatedAt', key: 'date' },
                                { title: 'Say', dataIndex: 'count', key: 'count' },
                                { title: `Qiymət (${CurrencySymbols.TRY})`, dataIndex: 'productPrice', key: 'price', render: (v) => v.toFixed(2) },
                                { title: `Çatdırılma (${CurrencySymbols.USD})`, dataIndex: 'deliveryPrice', key: 'delivery', render: (v) => v.toFixed(2) },
                            ]}
                        />
                    )}
                </>
            )}
        </PageContent>
    );
};
