import { FC } from 'react';
import { Form, Input, Modal, Spin } from 'antd';
import { useParams } from 'react-router-dom';
import { useCloseModal } from '@shared/hooks';
import { useHandoverCouriers } from '../hooks';

export const HandoverCouriers: FC = () => {
  const { id } = useParams<{ id: string }>();
  const [close] = useCloseModal();
  const [form] = Form.useForm();
  const { details, detailsLoading, submitting, onSubmit } = useHandoverCouriers(id!);

  return (
    <Modal title='Bağlamaları təhvil ver' open={true} onCancel={() => close('/couriers')} onOk={form.submit} confirmLoading={submitting}>
      {detailsLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
          <Spin />
        </div>
      ) : (
        <>
          {details && (
            <table style={{ width: '100%', marginBottom: 16, borderCollapse: 'collapse' }}>
              <tbody>
                <tr>
                  <th style={{ textAlign: 'left', padding: '4px 8px' }}>Bağlama</th>
                  <td style={{ padding: '4px 8px' }}>{details.deliveryPrice.usd.toFixed(2)} USD</td>
                  <td style={{ padding: '4px 8px' }}>{details.deliveryPrice.azn.toFixed(2)} AZN</td>
                </tr>
                <tr>
                  <th style={{ textAlign: 'left', padding: '4px 8px' }}>Borc</th>
                  <td style={{ padding: '4px 8px' }}>{details.debts.usd.toFixed(2)} USD</td>
                  <td style={{ padding: '4px 8px' }}>{details.debts.usdToAzn.toFixed(2)} AZN</td>
                </tr>
              </tbody>
            </table>
          )}
          <Form form={form} layout='vertical' onFinish={(v) => onSubmit(v.amount)}>
            <Form.Item name='amount' label='Məbləğ' rules={[{ required: true, message: 'Məbləği daxil edin' }]}>
              <Input placeholder='Ödəniləcək məbləğ' suffix='AZN' />
            </Form.Item>
          </Form>
        </>
      )}
    </Modal>
  );
};
