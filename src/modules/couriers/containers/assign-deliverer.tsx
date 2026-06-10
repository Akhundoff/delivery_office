import { FC } from 'react';
import { Form, Modal, Select } from 'antd';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useCloseModal } from '@shared/hooks';
import { UsersService } from '@modules/users/services';
import { useAssignDeliverer } from '../hooks';

export const AssignDeliverer: FC = () => {
  const { id } = useParams<{ id: string }>();
  const [close] = useCloseModal();
  const [form] = Form.useForm();
  const { submitting, onSubmit } = useAssignDeliverer(id!, () => close('/couriers'));

  const { data: usersResult } = useQuery(['users-for-assign', ''], () => UsersService.getUsers({ admin: 3, per_page: 100 }));
  const users = usersResult?.status === 200 ? usersResult.data.data : [];

  return (
    <Modal title='Kuryer təhkim et' open={true} onCancel={() => close('/couriers')} onOk={form.submit} confirmLoading={submitting}>
      <Form form={form} layout='vertical' onFinish={(v) => onSubmit(v.delivererId)}>
        <Form.Item name='delivererId' label='Kuryer' rules={[{ required: true, message: 'Kuryer seçin' }]}>
          <Select
            placeholder='Kuryer seçin...'
            options={users.map((u) => ({ value: String(u.id), label: `#${u.id} - ${u.firstname} ${u.lastname}` }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
