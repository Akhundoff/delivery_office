import React, { FC, useCallback, useState } from 'react';
import { Col, Form, Input, Modal, Row, Select, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { CurrenciesService, CashRegistersService } from '../services';

export const CreateCashRegister: FC = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);

    const { data: currenciesResult } = useQuery('currencies-for-cashregister', () => CurrenciesService.getList());
    const currencies = currenciesResult?.status === 200 ? currenciesResult.data.data : [];

    const onCancel = useCallback(() => navigate('/cash-flow/cash-registers'), [navigate]);

    const onOk = useCallback(async () => {
        try { await form.validateFields(); } catch { return; }
        const values = form.getFieldsValue();
        setSubmitting(true);
        const result = await CashRegistersService.create({ name: values.name, amount: values.amount, currencyId: values.currencyId });
        setSubmitting(false);
        if (result.status === 200) {
            message.success('Kassa yaradıldı.');
            navigate('/cash-flow/cash-registers');
        } else if (result.status === 422) {
            message.error(Object.values(result.data as Record<string, string>).join(' '));
        } else {
            message.error(result.data as string);
        }
    }, [form, navigate]);

    return (
        <Modal open title='Yeni kassa' onCancel={onCancel} onOk={onOk} confirmLoading={submitting} okText='Saxla' cancelText='Ləğv et' width={480}>
            <Form form={form} layout='vertical' size='large'>
                <Form.Item name='name' label='Ad' rules={[{ required: true, message: 'Adı daxil edin' }]}>
                    <Input placeholder='Kasanın adını daxil edin...' />
                </Form.Item>
                <Row gutter={[24, 0]}>
                    <Col xs={12}>
                        <Form.Item name='amount' label='İlkin məbləğ' rules={[{ required: true, message: 'Məbləği daxil edin' }]}>
                            <Input placeholder='0.00' />
                        </Form.Item>
                    </Col>
                    <Col xs={12}>
                        <Form.Item name='currencyId' label='Valyuta' rules={[{ required: true, message: 'Valyuta seçin' }]}>
                            <Select placeholder='Valyuta seçin...' options={currencies.map((c) => ({ value: String(c.id), label: `${c.name} (${c.code})` }))} />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};
