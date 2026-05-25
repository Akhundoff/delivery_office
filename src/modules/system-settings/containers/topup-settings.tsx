import { FC } from "react";
import { Button, Col, Form, Row, Spin } from "antd";
import { Formik, FormikProps } from "formik";
import { SwitchField } from "@shared/modules/form/fields/switch";
import { useSettingsGroup } from "../hooks";

const defaultValues = {
  usdBalanceEnabled: false,
  tryBalanceEnabled: false,
};

const fromApi = (raw: Record<string, any>): Partial<typeof defaultValues> => ({
  usdBalanceEnabled: !!Number(raw.usd_balance_enabled ?? 0),
  tryBalanceEnabled: !!Number(raw.try_balance_enabled ?? 0),
});

const toApi = (values: typeof defaultValues) => ({
  usd_balance_enabled: values.usdBalanceEnabled ? "1" : "0",
  try_balance_enabled: values.tryBalanceEnabled ? "1" : "0",
});

const TopupSettingsForm: FC<FormikProps<typeof defaultValues>> = ({ submitForm, isSubmitting }) => (
  <Form layout="vertical" component="div" size="large">
    <Row gutter={16}>
      <Col span={12}><SwitchField name="usdBalanceEnabled" item={{ label: "USD balans artımına icazə" }} /></Col>
      <Col span={12}><SwitchField name="tryBalanceEnabled" item={{ label: "TRY balans artımına icazə" }} /></Col>
    </Row>
    <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
      <Button type="primary" loading={isSubmitting} onClick={submitForm}>Yadda saxla</Button>
    </div>
  </Form>
);

export const TopupSettings: FC = () => {
  const { initialValues, onSubmit, isLoading } = useSettingsGroup("topup", defaultValues, fromApi, toApi);
  if (isLoading) return <Spin />;
  return (
    <Formik initialValues={initialValues as typeof defaultValues} onSubmit={onSubmit} enableReinitialize>
      {(f) => <TopupSettingsForm {...f} />}
    </Formik>
  );
};
