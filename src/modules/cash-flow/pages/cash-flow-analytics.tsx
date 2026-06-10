import React, { FC, useCallback, useState } from 'react';
import { Col, DatePicker, Row, Result, Select, Spin, Table } from 'antd';
import { green, red } from '@ant-design/colors';
import { useQuery } from 'react-query';
import { Dayjs } from 'dayjs';
import { PageContent } from '@shared/styled/page-content';
import { HeadPortal } from '@modules/layout/components/head-portal';
import { StyledActionBar } from '@shared/styled/action-bar';
import { CashRegistersService, CashFlowAnalyticsService } from '../services';
import { ICashFlowAnalyticsResult } from '../interfaces';

const { RangePicker } = DatePicker;

export const CashFlowAnalyticsPage: FC = () => {
    const [cashRegisterId, setCashRegisterId] = useState<number | undefined>();
    const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);

    const { data: cashRegistersResult } = useQuery('cash-registers-for-analytics', () => CashRegistersService.getList());
    const cashRegisters = cashRegistersResult?.status === 200 ? cashRegistersResult.data.data : [];

    const startDate = dateRange ? dateRange[0].format('YYYY-MM-DD HH:mm:ss') : '';
    const endDate = dateRange ? dateRange[1].format('YYYY-MM-DD HH:mm:ss') : '';

    const { data: analyticsResult, isLoading, error } = useQuery<ICashFlowAnalyticsResult, Error>(
        ['cash-flow-analytics', cashRegisterId, startDate, endDate],
        async () => {
            if (!cashRegisterId) throw new Error('Kassa seçin...');
            if (!startDate || !endDate) throw new Error('Tarix seçin...');
            const result = await CashFlowAnalyticsService.getAnalytics({ cashbox_id: cashRegisterId, start_date: startDate, end_date: endDate });
            if (result.status === 200) return result.data;
            throw new Error(result.data as string);
        },
        { enabled: !!cashRegisterId && !!startDate && !!endDate, retry: false },
    );

    const onDateChange = useCallback((dates: any) => {
        if (!dates || !dates[0] || !dates[1]) { setDateRange(null); return; }
        setDateRange([dates[0], dates[1]]);
    }, []);

    const columns = [
        { key: 'category', title: 'Kateqoriya', dataIndex: 'name' },
        {
            width: 200, title: 'Gəlir', align: 'right' as const, key: 'income', dataIndex: 'income',
            render: (value: number) => <b style={{ color: green[5] }}>{value?.toFixed(2)} {analyticsResult?.currency.code}</b>,
        },
        {
            width: 200, title: 'Xərc', align: 'right' as const, key: 'expense', dataIndex: 'expense',
            render: (value: number) => <b style={{ color: red[5] }}>{value?.toFixed(2)} {analyticsResult?.currency.code}</b>,
        },
        {
            width: 150, key: 'percent', align: 'right' as const, dataIndex: 'percent',
            render: (value: number) => <b style={{ color: value > 0 ? green[5] : value < 0 ? red[5] : undefined }}>{value}%</b>,
        },
    ];

    const actionBar = (
        <HeadPortal>
            <StyledActionBar $flex={true}>
                <Row gutter={[8, 0]} align='middle'>
                    <Col>
                        <Select
                            style={{ width: 200 }}
                            value={cashRegisterId}
                            onChange={setCashRegisterId}
                            placeholder='Kassa seçin...'
                            options={cashRegisters.map((r) => ({ value: r.id, label: `${r.name} (${r.currency.code})` }))}
                        />
                    </Col>
                    <Col>
                        <RangePicker onChange={onDateChange} />
                    </Col>
                </Row>
            </StyledActionBar>
        </HeadPortal>
    );

    if (isLoading) {
        return (
            <PageContent>
                {actionBar}
                <Spin style={{ display: 'block', margin: '64px auto' }} />
            </PageContent>
        );
    }

    if (error) {
        return (
            <PageContent>
                {actionBar}
                <Result status='warning' title={error.message} />
            </PageContent>
        );
    }

    if (!analyticsResult || !analyticsResult.categories.length) {
        return (
            <PageContent>
                {actionBar}
                <Result status='404' title='Məlumat tapılmadı' />
            </PageContent>
        );
    }

    return (
        <PageContent>
            {actionBar}
            <Table
                rowKey='id'
                pagination={false}
                expandable={{ expandRowByClick: true, indentSize: 16 }}
                dataSource={analyticsResult.categories}
                columns={columns}
                summary={() => (
                    <Table.Summary.Row>
                        <Table.Summary.Cell index={0}><b>Ümumi</b></Table.Summary.Cell>
                        <Table.Summary.Cell index={1} align='right'>
                            <b style={{ color: green[5] }}>{analyticsResult.total.income.toFixed(2)} {analyticsResult.currency.code}</b>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={2} align='right'>
                            <b style={{ color: red[5] }}>{analyticsResult.total.expense.toFixed(2)} {analyticsResult.currency.code}</b>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={3} align='right'>
                            <b>{analyticsResult.total.percent}%</b>
                        </Table.Summary.Cell>
                    </Table.Summary.Row>
                )}
            />
        </PageContent>
    );
};
