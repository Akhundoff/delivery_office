import { FC } from 'react';
import { DatePicker, Form, Modal, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { FlightsService } from '../services';

export const UpdateCurrentMonthModal: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onOk = async () => {
    const values = form.getFieldsValue();
    if (!values.currentMonth) {
      message.error('Ay seçin');
      return;
    }
    const thisMonth = dayjs(values.currentMonth).format('YYYY-MM');
    const result = await FlightsService.updateCurrentMonth(id!, thisMonth);
    if (result.status === 200) {
      message.success('Cari ay yeniləndi.');
      navigate(`/flights/${id}`);
    } else {
      message.error(result.data as string);
    }
  };

  return (
    <Modal open={true} onCancel={() => navigate(`/flights/${id}`)} onOk={onOk} title='Cari ayı dəyiş' okText='Yadda saxla' cancelText='Ləğv et' width={520}>
      <Form form={form} layout='vertical' initialValues={{ currentMonth: dayjs() }}>
        <Form.Item name='currentMonth' label='Cari ay'>
          <DatePicker picker='month' format='YYYY-MM' style={{ width: '100%' }} allowClear={false} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
