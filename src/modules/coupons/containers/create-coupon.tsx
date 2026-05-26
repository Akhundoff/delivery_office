import { FC, useEffect } from 'react';
import { Col, Form, Modal, Row, Select, Spin } from 'antd';
import { Formik, FormikProps } from 'formik';

import { TextField, SelectField, TextAreaField } from '@shared/modules/form';
import { useCloseModal } from '@shared/hooks';

import { ICouponFormValues, CouponType } from '../interfaces';
import { useCouponForm } from '../hooks';

const CreateCouponForm: FC<FormikProps<ICouponFormValues> & { id?: string }> = ({ handleSubmit, isSubmitting, values, setFieldValue, id }) => {
  const [closeModal] = useCloseModal();

  useEffect(() => {
    if (String(values.couponType) !== String(CouponType.BALANCE)) {
      setFieldValue('currency', '');
    }
  }, [values.couponType, setFieldValue]);

  return (
    <Modal
      open={true}
      onOk={() => handleSubmit()}
      onCancel={() => closeModal('/coupons')}
      confirmLoading={isSubmitting}
      title={!id ? 'Yeni kupon' : 'Kuponu düzəlt'}
      okText="Yadda saxla"
      cancelText="Ləğv et"
      width={700}
    >
      <Form layout="vertical" component="div" size="large">
        <Row gutter={16}>
          <Col span={12}>
            <TextField name="name" item={{ label: 'Ad' }} input={{ placeholder: 'Kuponun adını daxil edin...' }} />
          </Col>
          <Col span={12}>
            <TextField name="tag" item={{ label: 'Teq' }} input={{ placeholder: 'Kuponu etiketi daxil edin...' }} />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <SelectField name="couponType" item={{ label: 'Kupon tipi' }} input={{ placeholder: 'Kupon tipini seçin...' }}>
              <Select.Option value={String(CouponType.BALANCE)}>Balans artımı</Select.Option>
              <Select.Option value={String(CouponType.ORDER_SERVICE_PERCENT)}>Sifariş xidmətində əlavə faiz</Select.Option>
              <Select.Option value={String(CouponType.DELIVERY_DISCOUNT)}>Çatdırılma xidmətinə endirim</Select.Option>
              <Select.Option value={String(CouponType.COURIER_DISCOUNT)}>Kuryer xidmətinə endirim</Select.Option>
            </SelectField>
          </Col>
          <Col span={12}>
            <TextField name="amount" item={{ label: 'Məbləğ / Faiz' }} input={{ placeholder: '0' }} />
          </Col>
        </Row>
        {String(values.couponType) === String(CouponType.BALANCE) && (
          <SelectField name="currency" item={{ label: 'Valyuta' }} input={{ placeholder: 'Valyuta seçin...' }}>
            <Select.Option value="TRY">Türk lirəsi (TRY)</Select.Option>
            <Select.Option value="USD">ABŞ Dolları (USD)</Select.Option>
          </SelectField>
        )}
        <Row gutter={16}>
          <Col span={12}>
            <TextField name="count" item={{ label: 'İstifadə limiti' }} input={{ placeholder: '0' }} />
          </Col>
          <Col span={12}>
            <TextField name="stateId" item={{ label: 'Status' }} input={{ placeholder: 'Status ID daxil edin...' }} />
          </Col>
        </Row>
        <TextAreaField name="description" item={{ label: 'Açıqlama' }} input={{ placeholder: 'Açıqlama daxil edin...' }} />
      </Form>
    </Modal>
  );
};

export const CreateCoupon: FC = () => {
  const { initialValues, onSubmit, id, isLoading } = useCouponForm();

  if (isLoading) {
    return (
      <Modal open={true} footer={null} closable={false}>
        <Spin style={{ display: 'block', padding: '40px 0', textAlign: 'center' }} />
      </Modal>
    );
  }

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit} enableReinitialize={true}>
      {(f) => <CreateCouponForm {...f} id={id} />}
    </Formik>
  );
};
