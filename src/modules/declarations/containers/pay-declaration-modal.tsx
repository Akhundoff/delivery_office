import { FC } from 'react';
import { Form, Input, Modal, Select, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { caller, urlMaker } from '@shared/utils';
import { DeclarationsService } from '../services';

export const PayDeclarationModal: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const close = () => navigate(-1);

  const { data: paymentTypes } = useQuery('payment-types', async () => {
    const result = await DeclarationsService.getPaymentTypes();
    return result.status === 200 ? result.data : [];
  });

  const { data: cashboxes } = useQuery('cashboxes-for-pay', async () => {
    const response = await caller(urlMaker('/api/admin/cashboxes', { per_page: 1000 }));
    if (response.ok) {
      const result = await response.json();
      return (result.data || []).map((c: any) => ({ id: c.id, name: c.cashbox_name }));
    }
    return [];
  });

  const onOk = async () => {
    const values = await form.validateFields();
    const ids = id!.split(',');
    const result = await DeclarationsService.pay(ids, values.amount, values.paymentTypeId, values.cashboxId);
    if (result.status === 200) {
      message.success('Ödəniş uğurla tamamlandı.');
      close();
    } else {
      message.error('Xəta baş verdi.');
    }
  };

  return (
    <Modal open={true} onCancel={close} onOk={onOk} title='Ödəniş' okText='Ödə' cancelText='Ləğv et' width={480}>
      <Form form={form} layout='vertical'>
        <Form.Item name='amount' label='Məbləğ (₼)' rules={[{ required: true, message: 'Məbləği daxil edin' }]}>
          <Input placeholder='0.00' addonAfter='₼' />
        </Form.Item>
        <Form.Item name='paymentTypeId' label='Ödəniş növü' rules={[{ required: true, message: 'Ödəniş növünü seçin' }]}>
          <Select placeholder='Ödəniş növünü seçin...'>
            {(paymentTypes ?? []).map((pt) => (
              <Select.Option key={pt.id} value={String(pt.id)}>{pt.name}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name='cashboxId' label='Kassa' rules={[{ required: true, message: 'Kassanı seçin' }]}>
          <Select placeholder='Kassanı seçin...'>
            {(cashboxes ?? []).map((c: any) => (
              <Select.Option key={c.id} value={String(c.id)}>{c.name}</Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};
