import { FC, useCallback, useEffect } from 'react';
import { Checkbox, Descriptions, Form, Modal, Select, Spin, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { DeclarationsService } from '../services';
import { ReturnTypesService } from '@modules/return-types/services';

export const ReturnDeclarationModal: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const close = useCallback(() => navigate(-1), [navigate]);
  const [form] = Form.useForm();

  const returnOrderExtra = Form.useWatch('returnOrderExtra', form);
  const returnDeclarationPrice = Form.useWatch('returnDeclarationPrice', form);
  const returnDeliveryPrice = Form.useWatch('returnDeliveryPrice', form);

  const { data: details, isLoading, error } = useQuery(
    ['return-details', id],
    () => DeclarationsService.getReturnDetails(id!).then((r) => (r.status === 200 ? r.data : null)),
    { enabled: !!id },
  );

  const { data: returnTypes } = useQuery('return-types-list', () =>
    ReturnTypesService.getList({ per_page: 1000 }).then((r) => (r.status === 200 ? r.data.data : [])),
  );

  useEffect(() => {
    if (error) {
      message.error('Məlumatlar əldə edilə bilmədi');
      close();
    }
  }, [error, close]);

  useEffect(() => {
    if (returnOrderExtra) form.setFieldValue('returnDeclarationPrice', returnOrderExtra);
  }, [returnOrderExtra, form]);

  const onOk = async () => {
    const values = await form.validateFields();
    const result = await DeclarationsService.returnDeclaration(id!, {
      typeId: values.typeId,
      returnOrderExtra: !!values.returnOrderExtra,
      returnDeclarationPrice: !!values.returnDeclarationPrice,
      returnDeliveryPrice: !!values.returnDeliveryPrice,
    });
    if (result.status === 200) {
      message.success('İadə uğurla tamamlandı.');
      close();
    } else {
      const errMsg = typeof result.data === 'object' ? Object.values(result.data as object).flat().join('. ') : String(result.data);
      message.error(errMsg || 'Xəta baş verdi.');
    }
  };

  const showDetails = (returnOrderExtra || returnDeclarationPrice || returnDeliveryPrice) && details;

  return (
    <Modal open={true} onCancel={close} onOk={onOk} title='Bağlamanı iadə et' okText='Təsdiq et' cancelText='İmtina' width={480}>
      {isLoading && <Spin />}
      {details && (
        <>
          {showDetails && (
            <Descriptions bordered column={1} size='small' style={{ marginBottom: 16 }}>
              {returnOrderExtra && details.order && (
                <>
                  <Descriptions.Item label='Sifarişin dəyəri'>{details.order.amountToBeRefunded.toFixed(2)} ₺</Descriptions.Item>
                  <Descriptions.Item label='Sifarişin dəyərinin 5%-i'>{details.order.amountToBeRefundedExtra.toFixed(2)} ₺</Descriptions.Item>
                  <Descriptions.Item label='Sifarişin dəyəri (+5%)'>{details.order.amountToBeRefundedWithExtra.toFixed(2)} ₺</Descriptions.Item>
                </>
              )}
              {returnDeclarationPrice && <Descriptions.Item label='Bağlamanın qiyməti'>{details.productPriceToBeRefunded.toFixed(2)} ₺</Descriptions.Item>}
              {returnDeliveryPrice && <Descriptions.Item label='Çatdırılma qiyməti'>{details.deliveryPriceToBeRefunded.toFixed(2)} $</Descriptions.Item>}
            </Descriptions>
          )}
          <Form form={form} layout='vertical'>
            <Form.Item name='typeId' label='İadə səbəbi' rules={[{ required: true, message: 'İadə səbəbi seçin' }]}>
              <Select placeholder='İadə səbəbini seçin...' size='large'>
                {(returnTypes ?? []).map((t) => (
                  <Select.Option key={t.id} value={String(t.id)}>{t.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name='returnOrderExtra' valuePropName='checked'>
              <Checkbox disabled={!details.order}>Sifarişdən 5% qaytarılsın?</Checkbox>
            </Form.Item>
            <Form.Item name='returnDeclarationPrice' valuePropName='checked'>
              <Checkbox disabled={!!returnOrderExtra}>Bağlamanın dəyəri geri qaytarılsın?</Checkbox>
            </Form.Item>
            <Form.Item name='returnDeliveryPrice' valuePropName='checked'>
              <Checkbox disabled={!details.paid}>Çatdırılma məbləği geri qaytarılsın?</Checkbox>
            </Form.Item>
          </Form>
        </>
      )}
    </Modal>
  );
};
