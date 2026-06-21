import { FC } from 'react';
import { Button, Col, Form, Row, Spin } from 'antd';
import { Formik, FormikProps } from 'formik';
import { TextField } from '@shared/modules/form/fields/text';
import { useWarehousesSettings, WarehousesValues } from '../hooks';

const WarehousesSettingsForm: FC<FormikProps<WarehousesValues>> = ({ submitForm, isSubmitting, values }) => (
  <Form layout="vertical" component="div" size="large">
    {values.items.map((warehouse, i) => (
      <div key={i} style={{ marginBottom: 25 }}>
        <h3 style={{ marginBottom: 15, fontSize: 20 }}>{warehouse.country}</h3>
        <Row gutter={[12, 0]}>
          <Col xs={24} md={12}>
            <TextField name={`items.${i}.city`} item={{ label: 'İl/Şehir' }} />
          </Col>
          <Col xs={24} md={12}>
            <TextField name={`items.${i}.addressHeading`} item={{ label: 'Address başlığı' }} />
          </Col>
          <Col xs={24} md={12}>
            <TextField name={`items.${i}.postalCode`} item={{ label: 'ZİP/Post kodu' }} />
          </Col>
          <Col xs={24} md={12}>
            <TextField name={`items.${i}.passportIdentity`} item={{ label: 'TC Kimlik' }} />
          </Col>
          <Col xs={24} md={12}>
            <TextField name={`items.${i}.address`} item={{ label: 'Address 1' }} />
          </Col>
          <Col xs={24} md={12}>
            <TextField name={`items.${i}.province`} item={{ label: ' İlçe' }} />
          </Col>
          <Col xs={24} md={12}>
            <TextField name={`items.${i}.district`} item={{ label: 'Mahalle' }} />
          </Col>
          <Col xs={24} md={12}>
            <TextField name={`items.${i}.country`} item={{ label: 'Ülke' }} />
          </Col>
          <Col xs={24} md={12}>
            <TextField name={`items.${i}.phone`} item={{ label: 'Numara' }} />
          </Col>
        </Row>
      </div>
    ))}
    <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'flex-end' }}>
      <Button type="primary" loading={isSubmitting} disabled={isSubmitting} onClick={submitForm}>
        Yadda saxla
      </Button>
    </div>
  </Form>
);

export const WarehousesSettings: FC = () => {
  const { initialValues, onSubmit, isLoading } = useWarehousesSettings();
  if (isLoading) return <Spin />;
  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit} enableReinitialize>
      {(f) => <WarehousesSettingsForm {...f} />}
    </Formik>
  );
};
