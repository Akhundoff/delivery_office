import { FC } from "react";
import { Button, Col, Form, Row, Spin } from "antd";
import { Formik, FormikProps } from "formik";
import { TextField } from "@shared/modules/form/fields/text";
import { CheckboxField } from "@shared/modules/form/fields/checkbox";
import { useSettingsGroup } from "../hooks";

const defaultValues = {
  percent: "",
  minAmount: "",
  maxAmount: "",
  expireDay: "",
  isActive: false,
};

const CashbackSettingsForm: FC<FormikProps<typeof defaultValues>> = ({ submitForm, isSubmitting }) => (
  <Form layout="vertical" component="div" size="large">
    <Row gutter={16}>
      <Col span={12}><TextField name="percent" item={{ label: "Faiz (%)" }} input={{ placeholder: "0.00" }} /></Col>
      <Col span={12}><TextField name="minAmount" item={{ label: "Min. məbləğ" }} input={{ placeholder: "0.00" }} /></Col>
      <Col span={12}><TextField name="maxAmount" item={{ label: "Maks. məbləğ" }} input={{ placeholder: "0.00" }} /></Col>
      <Col span={12}><TextField name="expireDay" item={{ label: "Bitmə günü" }} input={{ placeholder: "30" }} /></Col>
    </Row>
    <CheckboxField name="isActive" item={{ label: " " }}>Aktiv</CheckboxField>
    <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
      <Button type="primary" loading={isSubmitting} onClick={submitForm}>Yadda saxla</Button>
    </div>
  </Form>
);

export const CashbackSettings: FC = () => {
  const { initialValues, onSubmit, isLoading } = useSettingsGroup("cashback", defaultValues);
  if (isLoading) return <Spin />;
  return (
    <Formik initialValues={initialValues as typeof defaultValues} onSubmit={onSubmit} enableReinitialize>
      {(f) => <CashbackSettingsForm {...f} />}
    </Formik>
  );
};
