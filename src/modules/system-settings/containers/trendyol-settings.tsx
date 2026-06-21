import { FC, useCallback } from 'react';
import { Button, Col, Form, Row, Spin } from 'antd';
import { Formik, FormikErrors, FormikProps } from 'formik';
import { TextField } from '@shared/modules/form/fields/text';
import { useSettingsGroup } from '../hooks';

const defaultValues = {
  shippingCostUsd: '',
};

const fromApi = (raw: Record<string, any>): Partial<typeof defaultValues> => ({
  shippingCostUsd: raw.shipping_cost_usd?.toString() ?? '',
});

const toApi = (values: typeof defaultValues) => ({
  shipping_cost_usd: values.shippingCostUsd,
});

const errorKeyMap: Record<string, string> = {
  shipping_cost_usd: 'shippingCostUsd',
};

const DECIMAL_REGEX = /^\d+(\.\d{2})?$/;

const TrendyolSettingsForm: FC<FormikProps<typeof defaultValues>> = ({ submitForm, isSubmitting }) => (
  <Form layout="vertical" component="div" size="large">
    <Row gutter={16}>
      <Col span={12}>
        <TextField name="shippingCostUsd" item={{ label: 'SC üçün çatdırılma haqqı' }} input={{ placeholder: 'Məbləğ daxil edin...', addonAfter: '$' }} />
      </Col>
    </Row>
    <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
      <Button type="primary" loading={isSubmitting} onClick={submitForm}>
        Yadda saxla
      </Button>
    </div>
  </Form>
);

export const TrendyolSettings: FC = () => {
  const { initialValues, onSubmit, isLoading } = useSettingsGroup('trendyol', defaultValues, fromApi, toApi, errorKeyMap, true);

  const validate = useCallback((values: typeof defaultValues) => {
    const errors: FormikErrors<typeof defaultValues> = {};
    if (values.shippingCostUsd && !DECIMAL_REGEX.test(values.shippingCostUsd)) {
      errors.shippingCostUsd = 'Zəhmət olmasa müsbət və 2 mərtəbəli qiymət yazın...';
    }
    return errors;
  }, []);

  if (isLoading) return <Spin />;
  return (
    <Formik initialValues={initialValues as typeof defaultValues} onSubmit={onSubmit} validate={validate} enableReinitialize>
      {(f) => <TrendyolSettingsForm {...f} />}
    </Formik>
  );
};
