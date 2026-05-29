import React, { FC, useCallback, useState } from 'react';
import { Form, Input, Modal, Select, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { CashRegisterOperationsService } from '../services';

export const CreateCashRegisterOperation: FC = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);

    const { data: opsResult } = useQuery('operations-with-sub-for-create', () => CashRegisterOperationsService.getListWithSub());
    const parentOps = opsResult?.status === 200 ? opsResult.data.data : [];

    const onCancel = useCallback(() => navigate('/cash-flow/operations'), [navigate]);

    const onOk = useCallback(async () => {
        try { await form.validateFields(); } catch { return; }
        const values = form.getFieldsValue();
        setSubmitting(true);
        const result = await CashRegisterOperationsService.create({ name: values.name, parentId: values.parentId || '' });
        setSubmitting(false);
        if (result.status === 200) {
            message.success('Kateqoriya yaradıldı.');
            navigate('/cash-flow/operations');
        } else if (result.status === 422) {
            message.error(Object.values(result.data as Record<string, string>).join(' '));
        } else {
            message.error(result.data as string);
        }
    }, [form, navigate]);

    return (
        <Modal open title='Yeni əməliyyat kateqoriyası' onCancel={onCancel} onOk={onOk} confirmLoading={submitting} okText='Saxla' cancelText='Ləğv et' width={480}>
            <Form form={form} layout='vertical' size='large'>
                <Form.Item name='name' label='Ad' rules={[{ required: true, message: 'Adı daxil edin' }]}>
                    <Input placeholder='Kateqoriya adını daxil edin...' />
                </Form.Item>
                <Form.Item name='parentId' label='Valideyn kateqoriya'>
                    <Select allowClear placeholder='Valideyn seçin...' options={parentOps.map((op) => ({ value: String(op.id), label: op.name }))} />
                </Form.Item>
            </Form>
        </Modal>
    );
};
