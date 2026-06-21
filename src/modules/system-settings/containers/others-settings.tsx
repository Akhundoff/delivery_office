import { FC } from 'react';
import { Button, Col, Form, Row, Spin } from 'antd';
import { Formik, FormikProps } from 'formik';
import { TextField } from '@shared/modules/form/fields/text';
import { SwitchField } from '@shared/modules/form/fields/switch';
import { useSettingsGroup } from '../hooks';

const defaultValues = {
  orderPercent: '',
  smallPackage: '',
  mediumPackage: '',
  bigPackage: '',
  customs: false,
  orderStatus: false,
  declarationStatus: false,
  courierStatus: false,
  whatsapp: false,
};

const fromApi = (raw: Record<string, any>): Partial<typeof defaultValues> => ({
  orderPercent: raw.order_percent ?? '',
  smallPackage: raw.package_price?.small_package?.toString() ?? '',
  mediumPackage: raw.package_price?.medium_package?.toString() ?? '',
  bigPackage: raw.package_price?.big_package?.toString() ?? '',
  customs: !!Number(raw.customs),
  orderStatus: !!Number(raw.order_status),
  declarationStatus: !!Number(raw.declaration_status),
  courierStatus: !!Number(raw.courier_status),
  whatsapp: !!Number(raw.whatsapp),
});

const toApi = (values: typeof defaultValues) => ({
  order_percent: values.orderPercent,
  small_package: values.smallPackage,
  medium_package: values.mediumPackage,
  big_package: values.bigPackage,
  customs: values.customs ? '1' : '0',
  order_status: values.orderStatus ? '1' : '0',
  declaration_status: values.declarationStatus ? '1' : '0',
  courier_status: values.courierStatus ? '1' : '0',
  whatsapp: values.whatsapp ? '1' : '0',
});

const errorKeyMap: Record<string, string> = {
  order_percent: 'orderPercent',
  small_package: 'smallPackage',
  medium_package: 'mediumPackage',
  big_package: 'bigPackage',
  customs: 'customs',
  order_status: 'orderStatus',
  declaration_status: 'declarationStatus',
  courier_status: 'courierStatus',
  whatsapp: 'whatsapp',
};

const OthersSettingsForm: FC<FormikProps<typeof defaultValues>> = ({ submitForm, isSubmitting }) => (
  <Form layout="vertical" component="div" size="large">
    <Row gutter={16}>
      <Col span={12}>
        <TextField name="orderPercent" item={{ label: 'Sifariş faizi' }} input={{ placeholder: '%' }} />
      </Col>
      <Col span={12}>
        <TextField name="smallPackage" item={{ label: 'Kiçik paket qiyməti' }} input={{ placeholder: '0.00' }} />
      </Col>
      <Col span={12}>
        <TextField name="mediumPackage" item={{ label: 'Orta paket qiyməti' }} input={{ placeholder: '0.00' }} />
      </Col>
      <Col span={12}>
        <TextField name="bigPackage" item={{ label: 'Böyük paket qiyməti' }} input={{ placeholder: '0.00' }} />
      </Col>
    </Row>
    <Row gutter={16} style={{ marginTop: 8 }}>
      <Col span={8}>
        <SwitchField name="customs" item={{ label: 'Bağlamalar gömrükə göndərilsin' }} />
      </Col>
      <Col span={8}>
        <SwitchField name="orderStatus" item={{ label: 'Sifariş yaratmaq' }} />
      </Col>
      <Col span={8}>
        <SwitchField name="declarationStatus" item={{ label: 'Bağlama yaratmaq' }} />
      </Col>
      <Col span={8}>
        <SwitchField name="courierStatus" item={{ label: 'Kuryer yaratmaq' }} />
      </Col>
      <Col span={8}>
        <SwitchField name="whatsapp" item={{ label: 'WhatsApp bildirişlər' }} />
      </Col>
    </Row>
    <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
      <Button type="primary" loading={isSubmitting} onClick={submitForm}>
        Yadda saxla
      </Button>
    </div>
  </Form>
);

export const OthersSettings: FC = () => {
  const { initialValues, onSubmit, isLoading } = useSettingsGroup('others', defaultValues, fromApi, toApi, errorKeyMap);
  if (isLoading) return <Spin />;
  return (
    <Formik initialValues={initialValues as typeof defaultValues} onSubmit={onSubmit} enableReinitialize>
      {(f) => <OthersSettingsForm {...f} />}
    </Formik>
  );
};
