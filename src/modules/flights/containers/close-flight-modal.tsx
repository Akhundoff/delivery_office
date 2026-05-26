import { FC, useState } from 'react';
import { Form, Input, Modal, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { FlightsService } from '../services';
import { CloseFlightDto } from '../interfaces';

export const CloseFlightModal: FC = () => {
  const { id, type } = useParams<{ id: string; type: CloseFlightDto['type'] }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const close = () => navigate(`/flights/${id}`);

  const typeLabel = type === 'with-dispatch' ? 'Depeşli' : type === 'without-dispatch' ? 'Depeşsiz' : 'Hamısı';

  const onOk = async () => {
    const values = form.getFieldsValue();
    setSubmitting(true);
    const result = await FlightsService.close({
      id: id!,
      type: type as CloseFlightDto['type'],
      airWaybillNumber: values.airWaybillNumber || '',
      packagingLimit: values.packagingLimit || '100',
    });
    setSubmitting(false);
    if (result.status === 200) {
      message.success('Uçuş bağlandı.');
      close();
    } else {
      message.error(typeof result.data === 'string' ? result.data : 'Xəta baş verdi.');
    }
  };

  return (
    <Modal
      open={true}
      onCancel={close}
      onOk={onOk}
      confirmLoading={submitting}
      title={`Uçuşu bağla — ${typeLabel}`}
      okText='Bağla'
      cancelText='Ləğv et'
      width={480}
    >
      <Form form={form} layout='vertical' initialValues={{ packagingLimit: '100' }}>
        <Form.Item name='airWaybillNumber' label='Aviaqaimə nömrəsi'>
          <Input placeholder='Aviaqaimə nömrəsini daxil edin...' />
        </Form.Item>
        <Form.Item name='packagingLimit' label='Paketləmə limiti'>
          <Input placeholder='100' />
        </Form.Item>
      </Form>
    </Modal>
  );
};
