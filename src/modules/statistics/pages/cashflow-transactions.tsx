import { FC, useCallback, useMemo, useState } from 'react';
import { Button, Cascader, DatePicker, Empty, Radio, Select, Space, Spin } from 'antd';
import * as Icons from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { useQuery } from 'react-query';
import { PageContent } from '@shared/styled/page-content';
import { useBackgroundNavigate } from '@shared/hooks';
import { filterOption } from '@shared/modules/antd/helpers/filter-option';
import { CashRegistersService, CashRegisterOperationsService } from '@modules/cash-flow/services';
import { StatisticsService } from '../services';
import { StatisticsLineChart } from '../components/statistics-line-chart';
import { CashFlowTransactionsTable } from '../components/cashflow-transactions-table';

export const CashFlowTransactionsPage: FC = () => {
    const [dates, setDates] = useState<[Dayjs, Dayjs]>([dayjs().startOf('month'), dayjs().endOf('month')]);
    const [operationType, setOperationType] = useState<string>('1');
    const [operation, setOperation] = useState<number[]>([]);
    const [paymentType, setPaymentType] = useState<string | undefined>(undefined);
    const [cashRegister, setCashRegister] = useState<string | undefined>(undefined);
    const [view, setView] = useState<'chart' | 'table'>('chart');
    const navigate = useBackgroundNavigate();

    const [startDate, endDate] = dates;
    const start = startDate.startOf('day').format('YYYY-MM-DD HH:mm:ss');
    const end = endDate.endOf('day').format('YYYY-MM-DD HH:mm:ss');

    const cashRegisters = useQuery(['cash-registers'], async () => {
        const result = await CashRegistersService.getList();
        if (result.status === 200) return result.data.data;
        throw new Error(result.data as string);
    });

    const operations = useQuery(['cash-register-operations-with-sub'], async () => {
        const result = await CashRegisterOperationsService.getListWithSub();
        if (result.status === 200) return result.data.data;
        throw new Error(result.data as string);
    });

    const operationOptions = useMemo(
        () => (operations.data || []).map((op) => ({ value: op.id, label: op.name, children: op.children.map((child) => ({ value: child.id, label: child.name })) })),
        [operations.data],
    );

    const queryParams = useMemo(
        () => ({
            startDate: start,
            endDate: end,
            operationType: parseInt(operationType),
            paymentType: paymentType ? parseInt(paymentType) : undefined,
            cashboxId: cashRegister ? parseInt(cashRegister) : undefined,
            cashCategoryId: operation.length === 2 ? operation[1] : undefined,
            cashCategoryIdParent: operation.length === 2 ? operation[0] : undefined,
        }),
        [start, end, operationType, paymentType, cashRegister, operation],
    );

    const { data: statsResult, isFetching } = useQuery(
        ['cashflow-daily', queryParams],
        async () => {
            const result = await StatisticsService.getCashFlowDaily(queryParams);
            if (result.status === 200) return result.data;
            throw new Error(result.data as string);
        },
        { keepPreviousData: true },
    );

    const stats = statsResult ?? null;
    const onDateChange = useCallback((value: any) => { if (value && value[0] && value[1]) setDates(value); else setDates([dayjs().startOf('month'), dayjs().endOf('month')]); }, []);

    const openDetails = useCallback(() => {
        navigate('/statistics/cashflow-transactions/details', {
            withBackground: true,
            state: {
                operationType: parseInt(operationType),
                paymentType: paymentType ? parseInt(paymentType) : undefined,
                cashCategoryId: operation.length === 2 ? operation[1] : undefined,
                cashCategoryIdParent: operation.length === 2 ? operation[0] : undefined,
                cashRegister: cashRegister ? parseInt(cashRegister) : undefined,
                startDate: start,
                endDate: end,
            },
        });
    }, [navigate, operationType, paymentType, operation, cashRegister, start, end]);

    const inputs = useMemo(
        () => (
            <Space size={8} wrap>
                <Select showSearch filterOption={filterOption} placeholder='Əməliyyat' style={{ width: 130 }} value={operationType} onChange={setOperationType}>
                    <Select.Option value='1'>Mədaxil</Select.Option>
                    <Select.Option value='2'>Məxaric</Select.Option>
                </Select>
                <Select placeholder='Kassa' showSearch filterOption={filterOption} allowClear style={{ width: 150 }} value={cashRegister} onChange={setCashRegister} loading={cashRegisters.isLoading}>
                    {(cashRegisters.data || []).map((reg) => <Select.Option key={reg.id} value={reg.id.toString()}>{reg.name}</Select.Option>)}
                </Select>
                <Cascader placeholder='Kateqoriya' options={operationOptions} allowClear style={{ width: 160 }} changeOnSelect value={operation} onChange={(v) => setOperation((v as number[]) || [])} />
                <Select placeholder='Ödəniş tipi' allowClear style={{ width: 130 }} onChange={setPaymentType} value={paymentType}>
                    <Select.Option value='1'>Nağd</Select.Option>
                    <Select.Option value='3'>Terminal</Select.Option>
                </Select>
                <DatePicker.RangePicker allowClear={false} onChange={onDateChange} value={dates} />
            </Space>
        ),
        [dates, onDateChange, operationOptions, operationType, paymentType, cashRegisters.data, cashRegisters.isLoading, cashRegister, operation],
    );

    if (isFetching && !stats) {
        return <PageContent title='Cashflow transaction statistikası' extra={inputs}><Spin style={{ display: 'block', padding: '80px 0', textAlign: 'center' }} /></PageContent>;
    }

    if (!stats?.data.length) {
        return <PageContent title='Cashflow transaction statistikası' extra={inputs}><Empty description='Məlumat yoxdur...' /></PageContent>;
    }

    return (
        <PageContent title='Cashflow transaction statistikası' extra={inputs}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Radio.Group value={view} onChange={(e) => setView(e.target.value)}>
                    <Radio.Button value='chart'><Icons.LineChartOutlined /> Qrafik</Radio.Button>
                    <Radio.Button value='table'><Icons.TableOutlined /> Cədvəl</Radio.Button>
                </Radio.Group>
                <Button.Group>
                    <Button onClick={openDetails}>{stats.total.price.toFixed(2)}</Button>
                    <Button onClick={openDetails}>{stats.total.count} ədəd</Button>
                </Button.Group>
            </div>
            {view === 'chart' && <StatisticsLineChart labels={stats.data.map((r) => r.date)} datasets={[{ label: 'Məbləğ', data: stats.data.map((r) => r.price) }]} />}
            {view === 'table' && (
                <CashFlowTransactionsTable
                    data={stats.data}
                    operationType={parseInt(operationType)}
                    paymentType={paymentType ? parseInt(paymentType) : undefined}
                    cashCategoryId={operation.length === 2 ? operation[1] : undefined}
                    cashCategoryIdParent={operation.length === 2 ? operation[0] : undefined}
                    cashRegister={cashRegister ? parseInt(cashRegister) : undefined}
                />
            )}
        </PageContent>
    );
};
