import { FC } from 'react';
import { Button, Col, Form, Row, Select, Spin } from 'antd';
import { Formik, FormikProps } from 'formik';
import { TextField } from '@shared/modules/form/fields/text';
import { SelectField } from '@shared/modules/form/fields/select';
import { useSettingsGroup } from '../hooks';

const defaultValues = {
  cashbackPercent: '',
  cashbackMax: '',
  cashbackMin: '',
  cashbackBalance: '',
  cashbackAvtoMax: '',
  expired: '',
};

const fromApi = (raw: Record<string, any>): Partial<typeof defaultValues> => ({
  cashbackPercent: raw.cashback_percent ?? '',
  cashbackMax: raw.cashback_max ?? '',
  cashbackMin: raw.cashback_min ?? '',
  cashbackBalance: raw.cashback_balance ?? '',
  cashbackAvtoMax: raw.cashback_avto_max ?? '',
  expired: raw.cashback_expired ?? '',
});

const toApi = (values: typeof defaultValues) => ({
  cashback_percent: values.cashbackPercent,
  cashback_max: values.cashbackMax,
  cashback_min: values.cashbackMin,
  cashback_balance: values.cashbackBalance,
  cashback_avto_max: values.cashbackAvtoMax,
  cashback_expired: values.expired,
});

const errorKeyMap: Record<string, string> = {
  cashback_percent: 'cashbackPercent',
  cashback_max: 'cashbackMax',
  cashback_min: 'cashbackMin',
  cashback_balance: 'cashbackBalance',
  cashback_avto_max: 'cashbackAvtoMax',
  cashback_expired: 'expired',
};

const CashbackSettingsForm: FC<FormikProps<typeof defaultValues>> = ({ submitForm, isSubmitting }) => (
  <Form layout="vertical" component="div" size="large">
    <Row gutter={16}>
      <Col span={12}>
        <TextField name="cashbackPercent" item={{ label: 'Cashback faizi' }} input={{ placeholder: 'Cashback faizi daxil edin...' }} />
      </Col>
      <Col span={12}>
        <TextField name="cashbackMax" item={{ label: 'Cashback maksimum' }} input={{ placeholder: 'Cashback maksimumunu daxil edin...' }} />
      </Col>
      <Col span={12}>
        <TextField name="cashbackMin" item={{ label: 'Cashback minimum' }} input={{ placeholder: 'Cashback minimumunu daxil edin...' }} />
      </Col>
      <Col span={12}>
        <SelectField name="cashbackBalance" item={{ label: 'Cashback balans' }} input={{ placeholder: 'Cashback balansını seçin...' }}>
          <Select.Option value="try">TRY</Select.Option>
          <Select.Option value="usd">USD</Select.Option>
        </SelectField>
      </Col>
      <Col span={12}>
        <TextField name="cashbackAvtoMax" item={{ label: 'Təsdiqləmə limiti' }} input={{ placeholder: 'Təsdiqləmə limitini daxil edin...' }} />
      </Col>
      <Col span={12}>
        <TextField name="expired" item={{ label: 'Gözləmə müddəti (gün)' }} input={{ placeholder: 'Gözləmə müddəti daxil edin...' }} />
      </Col>
    </Row>
    <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
      <Button type="primary" loading={isSubmitting} onClick={submitForm}>
        Yadda saxla
      </Button>
    </div>
  </Form>
);

export const CashbackSettings: FC = () => {
  const { initialValues, onSubmit, isLoading } = useSettingsGroup('cashback', defaultValues, fromApi, toApi, errorKeyMap);
  if (isLoading) return <Spin />;
  return (
    <Formik initialValues={initialValues as typeof defaultValues} onSubmit={onSubmit} enableReinitialize>
      {(f) => <CashbackSettingsForm {...f} />}
    </Formik>
  );
};
