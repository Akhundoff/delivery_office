import { FC } from 'react';
import { Button, Col, Form, Row, Spin } from 'antd';
import { Formik, FormikProps } from 'formik';
import { TextField } from '@shared/modules/form/fields/text';
import { useSettingsGroup } from '../hooks';

const defaultValues = {
  weightPrice: '',
  standardPrice: '',
};

const fromApi = (raw: Record<string, any>): Partial<typeof defaultValues> => ({
  weightPrice: raw.weight_price ?? '',
  standardPrice: raw.standart_price ?? '',
});

const toApi = (values: typeof defaultValues) => ({
  weight_price: values.weightPrice,
  standart_price: values.standardPrice,
});

const errorKeyMap: Record<string, string> = {
  weight_price: 'weightPrice',
  standart_price: 'standardPrice',
};

const AzerpostSettingsForm: FC<FormikProps<typeof defaultValues>> = ({ submitForm, isSubmitting }) => (
  <Form layout="vertical" component="div" size="large">
    <Row gutter={16}>
      <Col span={12}>
        <TextField name="weightPrice" item={{ label: 'KQ görə tarif' }} input={{ placeholder: 'KQ görə tarif daxil edin...' }} />
      </Col>
      <Col span={12}>
        <TextField name="standardPrice" item={{ label: 'Standart tarif' }} input={{ placeholder: 'Standart tarif daxil edin...' }} />
      </Col>
    </Row>
    <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
      <Button type="primary" loading={isSubmitting} onClick={submitForm}>
        Yadda saxla
      </Button>
    </div>
  </Form>
);

export const AzerpostSettings: FC = () => {
  const { initialValues, onSubmit, isLoading } = useSettingsGroup('azerpost', defaultValues, fromApi, toApi, errorKeyMap);
  if (isLoading) return <Spin />;
  return (
    <Formik initialValues={initialValues as typeof defaultValues} onSubmit={onSubmit} enableReinitialize>
      {(f) => <AzerpostSettingsForm {...f} />}
    </Formik>
  );
};
