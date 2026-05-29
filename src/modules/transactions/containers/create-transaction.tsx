import React, { FC, useCallback, useEffect, useState } from 'react';
import { Col, Form, Input, Modal, Row, Select, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { UsersService } from '@modules/users/services';
import { TransactionsService } from '../services';

const PAYMENT_TYPES_IN = [
  { value: '1', label: 'Nağd' },
  { value: '8', label: 'Hədiyyə' },
  { value: '3', label: 'Terminal' },
];
const PAYMENT_TYPES_OUT = [
  { value: '1', label: 'Nağd' },
  { value: '5', label: 'Cərimə' },
];

export const CreateTransaction: FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [userSearch, setUserSearch] = useState('');

  const transactionType = Form.useWatch('type', form);
  const currency = Form.useWatch('currency', form);
  const amount = Form.useWatch('amount', form);

  const { data: usersResult, isFetching: usersFetching } = useQuery(
    ['users-for-transaction-create', userSearch],
    () => UsersService.getUsers({ page: 1, per_page: 20, ...(userSearch ? { search: userSearch } : {}) }),
    { keepPreviousData: true },
  );
  const users = usersResult?.status === 200 ? usersResult.data.data : [];

  const { data: rateResult } = useQuery(['currency-rate', currency], () => TransactionsService.getCurrencyRate(currency), { enabled: !!currency });
  const rate = rateResult?.status === 200 ? rateResult.data : null;

  useEffect(() => {
    if (!rate || !amount) return;
    const amountNum = parseFloat(amount) || 0;
    form.setFieldValue('amountAzn', (amountNum * rate).toFixed(2));
  }, [rate, amount, form]);

  const onOk = useCallback(async () => {
    try {
      await form.validateFields();
    } catch {
      return;
    }
    const values = form.getFieldsValue();
    setSubmitting(true);
    const result = await TransactionsService.create({
      userId: values.userId,
      amount: values.amount,
      currency: values.currency,
      amountAzn: values.amountAzn,
      type: values.type,
      paymentType: values.paymentType,
      description: values.description || '',
    });
    setSubmitting(false);
    if (result.status === 200) {
      message.success('Tranzaksiya yaradıldı.');
      navigate('/transactions');
    } else {
      message.error(result.data as string);
    }
  }, [form, navigate]);

  const paymentTypes = transactionType === '2' ? PAYMENT_TYPES_OUT : PAYMENT_TYPES_IN;

  return (
    <Modal open title='Balans əməliyyatı' onCancel={() => navigate('/transactions')} onOk={onOk} confirmLoading={submitting} okText='Saxla' cancelText='Ləğv et' width={768}>
      <Form form={form} layout='vertical' size='large' initialValues={{ currency: 'try', type: '1', paymentType: '1' }}>
        <Form.Item name='userId' label='İstifadəçi' rules={[{ required: true, message: 'İstifadəçi seçin' }]}>
          <Select
            showSearch
            filterOption={false}
            onSearch={setUserSearch}
            loading={usersFetching}
            placeholder='İstifadəçi axtarın...'
            options={users.map((u) => ({ value: String(u.id), label: `#${u.id} — ${u.firstname} ${u.lastname}` }))}
          />
        </Form.Item>
        <Row gutter={[24, 0]}>
          <Col xs={9}>
            <Form.Item name='amount' label='Məbləğ' rules={[{ required: true, message: 'Məbləği daxil edin' }]}>
              <Input placeholder='Məbləği daxil edin...' />
            </Form.Item>
          </Col>
          <Col xs={6}>
            <Form.Item name='currency' label='Valyuta'>
              <Select options={[{ value: 'try', label: 'Türk lirəsi (₺)' }, { value: 'usd', label: 'ABŞ Dolları ($)' }]} />
            </Form.Item>
          </Col>
          <Col xs={9}>
            <Form.Item name='amountAzn' label='Kassaya mədaxil (₼)' rules={[{ required: true, message: 'Məbləği daxil edin' }]}>
              <Input placeholder='AZN məbləğini daxil edin...' addonAfter='₼' />
            </Form.Item>
          </Col>
          <Col xs={12}>
            <Form.Item name='type' label='Ödəniş tipi'>
              <Select options={[{ value: '1', label: 'Mədaxil' }, { value: '2', label: 'Məxaric' }]} onChange={() => form.setFieldValue('paymentType', paymentTypes[0]?.value)} />
            </Form.Item>
          </Col>
          <Col xs={12}>
            <Form.Item name='paymentType' label='Tranzaksiya tipi'>
              <Select options={paymentTypes} />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item name='description' label='Qeyd'>
              <Input.TextArea placeholder='Qeydinizi daxil edin...' rows={3} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
