import { FC, useContext } from 'react';
import { Form, Modal, Select, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { DeclarationsService } from '../services';
import { DeclarationsTableContext } from '../context';

const STATE_OPTIONS = [
  { value: '5', label: 'Öncədən bəyan' },
  { value: '7', label: 'Xarici anbarda' },
  { value: '8', label: 'Yolda' },
  { value: '9', label: 'Yerli anbarda' },
  { value: '10', label: 'Təhvil verilib' },
];

export const BulkHandoverModal: FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const close = () => navigate(-1);
  const { handleFetch } = useContext(DeclarationsTableContext);

  const { data: planCategories } = useQuery('tariff-categories-handover', async () => {
    const result = await DeclarationsService.getPlanCategories();
    return result.status === 200 ? result.data : [];
  });

  const onOk = async () => {
    const values = await form.validateFields();
    const result = await DeclarationsService.bulkHandover(values.stateId, values.tariffCategoryId);
    if (result.status === 200) {
      message.success('Toplu təhvil uğurla tamamlandı.');
      handleFetch();
      close();
    } else {
      message.error('Xəta baş verdi.');
    }
  };

  return (
    <Modal open={true} onCancel={close} onOk={onOk} title='Toplu təhvil' okText='Təhvil et' cancelText='Ləğv et' width={480}>
      <Form form={form} layout='vertical'>
        <Form.Item name='stateId' label='Status' rules={[{ required: true, message: 'Status seçin' }]}>
          <Select placeholder='Status seçin...'>
            {STATE_OPTIONS.map((s) => (
              <Select.Option key={s.value} value={s.value}>{s.label}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name='tariffCategoryId' label='Tarif kateqoriyası' rules={[{ required: true, message: 'Tarif kateqoriyası seçin' }]}>
          <Select placeholder='Tarif kateqoriyasını seçin...'>
            {(planCategories ?? []).map((c) => (
              <Select.Option key={c.id} value={String(c.id)}>{c.name}</Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};
