import { FC } from 'react';
import { Form, Input, Modal, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { FlightsService } from '../services';

export const UpdateAirWaybillModal: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  useQuery(
    ['flight-for-airwaybill', id],
    async () => {
      const result = await FlightsService.getById(id!);
      if (result.status === 200) return result.data;
      return null;
    },
    {
      onSuccess: (data) => {
        if (data) form.setFieldsValue({ airWaybill: data.airwaybill || '' });
      },
    },
  );

  const onOk = async () => {
    const values = form.getFieldsValue();
    const result = await FlightsService.updateAirWaybill(id!, values.airWaybill || '');
    if (result.status === 200) {
      message.success('Aviaqaimə nömrəsi yeniləndi.');
      navigate(`/flights/${id}`);
    } else {
      message.error(result.data as string);
    }
  };

  return (
    <Modal open={true} onCancel={() => navigate(`/flights/${id}`)} onOk={onOk} title='Aviaqaimə nömrəsini dəyiş' okText='Yadda saxla' cancelText='Ləğv et' width={520}>
      <Form form={form} layout='vertical'>
        <Form.Item name='airWaybill' label='Aviaqaimə nömrəsi'>
          <Input placeholder='Aviaqaimə nömrəsini daxil edin...' />
        </Form.Item>
      </Form>
    </Modal>
  );
};
