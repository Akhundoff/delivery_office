import React, { FC, useCallback, useMemo, useState } from 'react';
import { Cascader, Col, DatePicker, Form, Input, Modal, Row, Select, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import dayjs from 'dayjs';
import { CashRegistersService, CashRegisterOperationsService, CashFlowTransactionsService } from '../services';

const PAYMENT_TYPES = [
    { value: '1', label: 'Nağd' },
    { value: '3', label: 'Terminal' },
    { value: '8', label: 'Hədiyyə' },
];

export const CreateCashFlowTransaction: FC = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);
    const transactionType = Form.useWatch('type', form) || 'income';

    const { data: cashRegistersResult } = useQuery('cash-registers-for-tx', () => CashRegistersService.getList());
    const cashRegisters = cashRegistersResult?.status === 200 ? cashRegistersResult.data.data : [];

    const { data: opsResult } = useQuery('operations-with-sub-for-tx', () => CashRegisterOperationsService.getListWithSub());
    const operationOptions = useMemo(
        () =>
            opsResult?.status === 200
                ? opsResult.data.data.map((op) => ({
                      value: op.id,
                      label: op.name,
                      children: op.children.map((child) => ({ value: child.id, label: child.name })),
                  }))
                : [],
        [opsResult],
    );

    const onCancel = useCallback(() => navigate('/cash-flow/transactions'), [navigate]);

    const onOk = useCallback(async () => {
        try { await form.validateFields(); } catch { return; }
        const values = form.getFieldsValue();
        setSubmitting(true);
        const result = await CashFlowTransactionsService.create({
            type: values.type,
            cashRegisterId: values.cashRegisterId,
            amount: values.amount,
            operationIds: values.operationIds || [],
            incomeOperationIds: values.incomeOperationIds,
            transferCashRegisterId: values.transferCashRegisterId,
            transferAmount: values.transferAmount,
            operatedAt: values.operatedAt ? values.operatedAt.format('YYYY-MM-DD HH:mm:ss') : dayjs().format('YYYY-MM-DD HH:mm:ss'),
            description: values.description || '',
        });
        setSubmitting(false);
        if (result.status === 200) {
            message.success('Tranzaksiya yaradıldı.');
            navigate('/cash-flow/transactions');
        } else if (result.status === 422) {
            message.error(Object.values(result.data as Record<string, string>).join(' '));
        } else {
            message.error(result.data as string);
        }
    }, [form, navigate]);

    return (
        <Modal open title='Yeni tranzaksiya' onCancel={onCancel} onOk={onOk} confirmLoading={submitting} okText='Saxla' cancelText='Ləğv et' width={640}>
            <Form form={form} layout='vertical' size='large' initialValues={{ type: 'income', paymentType: '1' }}>
                <Form.Item name='type' label='Əməliyyat növü' rules={[{ required: true }]}>
                    <Select
                        options={[
                            { value: 'income', label: 'Mədaxil' },
                            { value: 'expense', label: 'Məxaric' },
                            { value: 'transfer', label: 'Transfer' },
                        ]}
                        onChange={() => { form.resetFields(['operationIds', 'incomeOperationIds']); }}
                    />
                </Form.Item>
                <Row gutter={[16, 0]}>
                    <Col xs={transactionType === 'transfer' ? 12 : 24}>
                        <Form.Item name='cashRegisterId' label='Kassa' rules={[{ required: true, message: 'Kassa seçin' }]}>
                            <Select
                                showSearch
                                filterOption={(input, option) => String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                                placeholder='Kassa seçin...'
                                options={cashRegisters.map((r) => ({ value: String(r.id), label: `${r.name} (${r.currency.code})` }))}
                            />
                        </Form.Item>
                    </Col>
                    {transactionType === 'transfer' && (
                        <Col xs={12}>
                            <Form.Item name='transferCashRegisterId' label='Hədəf kassa' rules={[{ required: true, message: 'Hədəf kassa seçin' }]}>
                                <Select
                                    showSearch
                                    filterOption={(input, option) => String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                                    placeholder='Hədəf kassa seçin...'
                                    options={cashRegisters.map((r) => ({ value: String(r.id), label: `${r.name} (${r.currency.code})` }))}
                                />
                            </Form.Item>
                        </Col>
                    )}
                </Row>
                <Row gutter={[16, 0]}>
                    <Col xs={transactionType === 'transfer' ? 12 : 24}>
                        <Form.Item name='amount' label='Məbləğ' rules={[{ required: true, message: 'Məbləği daxil edin' }]}>
                            <Input placeholder='0.00' />
                        </Form.Item>
                    </Col>
                    {transactionType === 'transfer' && (
                        <Col xs={12}>
                            <Form.Item name='transferAmount' label='Hədəf məbləğ' rules={[{ required: true, message: 'Hədəf məbləği daxil edin' }]}>
                                <Input placeholder='0.00' />
                            </Form.Item>
                        </Col>
                    )}
                </Row>
                <Form.Item name='operationIds' label={transactionType === 'transfer' ? 'Məxaric kateqoriyası' : 'Kateqoriya'} rules={[{ required: true, message: 'Kateqoriya seçin' }]}>
                    <Cascader options={operationOptions} placeholder='Kateqoriya seçin...' changeOnSelect />
                </Form.Item>
                {transactionType === 'transfer' && (
                    <Form.Item name='incomeOperationIds' label='Mədaxil kateqoriyası' rules={[{ required: true, message: 'Mədaxil kateqoriyası seçin' }]}>
                        <Cascader options={operationOptions} placeholder='Mədaxil kateqoriyası seçin...' changeOnSelect />
                    </Form.Item>
                )}
                <Row gutter={[16, 0]}>
                    <Col xs={12}>
                        <Form.Item name='paymentType' label='Ödəniş tipi'>
                            <Select options={PAYMENT_TYPES} />
                        </Form.Item>
                    </Col>
                    <Col xs={12}>
                        <Form.Item name='operatedAt' label='Əməliyyat tarixi' rules={[{ required: true, message: 'Tarixi seçin' }]}>
                            <DatePicker showTime style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item name='description' label='Qeyd'>
                    <Input.TextArea placeholder='Qeydinizi daxil edin...' rows={3} />
                </Form.Item>
            </Form>
        </Modal>
    );
};
