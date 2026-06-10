import { FC, useContext } from 'react';
import { Button, Form, Modal, Select } from 'antd';
import { useCloseModal } from '@shared/hooks';
import { DelivererAssignmentsTableContext } from '../context';
import { useCancelDeliverer, useDelivererReasons } from '../hooks';

export const CancelDeliverer: FC = () => {
  const [close] = useCloseModal();
  const [form] = Form.useForm();
  const { state, handleResetSelection } = useContext(DelivererAssignmentsTableContext);

  const selectedIds = Object.entries(state.selectedRowIds)
    .filter(([, v]) => v)
    .map(([k]) => Number(k));

  const { submitting, onSubmit } = useCancelDeliverer(selectedIds, () => {
    handleResetSelection();
    close('/couriers/deliverer-assignments');
  });

  const reasons = useDelivererReasons();

  return (
    <Modal
      title='Kuryerdən al'
      open={true}
      onCancel={() => close('/couriers/deliverer-assignments')}
      footer={
        <Button loading={submitting} type='primary' onClick={form.submit} disabled={!selectedIds.length}>
          Təsdiqlə
        </Button>
      }
    >
      <Form form={form} layout='vertical' onFinish={(v) => onSubmit(v.reasonId)}>
        <Form.Item name='reasonId' label='Səbəb' rules={[{ required: true, message: 'Səbəb seçin' }]}>
          <Select
            placeholder='Səbəb seçin...'
            options={reasons.map((r) => ({ value: String(r.id), label: r.name }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
