import { FC } from "react";
import { Button, Col, Form, Row, Spin } from "antd";
import { Formik, FormikProps } from "formik";
import { TextField } from "@shared/modules/form/fields/text";
import { useSettingsGroup } from "../hooks";

const defaultValues = {
  host: "",
  port: "",
  username: "",
  password: "",
  fromAddress: "",
  fromName: "",
};

const MailSettingsForm: FC<FormikProps<typeof defaultValues>> = ({ submitForm, isSubmitting }) => (
  <Form layout="vertical" component="div" size="large">
    <Row gutter={16}>
      <Col span={18}><TextField name="host" item={{ label: "SMTP Host" }} input={{ placeholder: "smtp.example.com" }} /></Col>
      <Col span={6}><TextField name="port" item={{ label: "Port" }} input={{ placeholder: "587" }} /></Col>
      <Col span={12}><TextField name="username" item={{ label: "İstifadəçi adı" }} input={{ placeholder: "user@example.com" }} /></Col>
      <Col span={12}><TextField name="password" item={{ label: "Şifrə" }} input={{ placeholder: "••••••", type: "password" }} /></Col>
      <Col span={12}><TextField name="fromAddress" item={{ label: "Göndərən e-poçt" }} input={{ placeholder: "noreply@example.com" }} /></Col>
      <Col span={12}><TextField name="fromName" item={{ label: "Göndərən adı" }} input={{ placeholder: "FİNDEX" }} /></Col>
    </Row>
    <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
      <Button type="primary" loading={isSubmitting} onClick={submitForm}>Yadda saxla</Button>
    </div>
  </Form>
);

export const MailSettings: FC = () => {
  const { initialValues, onSubmit, isLoading } = useSettingsGroup("email", defaultValues);
  if (isLoading) return <Spin />;
  return (
    <Formik initialValues={initialValues as typeof defaultValues} onSubmit={onSubmit} enableReinitialize>
      {(f) => <MailSettingsForm {...f} />}
    </Formik>
  );
};
