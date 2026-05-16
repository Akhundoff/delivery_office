import { FC } from "react";
import { Button, Col, Form, Row, Spin } from "antd";
import { Formik, FormikProps } from "formik";

import { TextField } from "@shared/modules/form/fields/text";
import { CheckboxField } from "@shared/modules/form/fields/checkbox";

import { useSettingsGroup } from "../hooks";

const defaultValues = {
  orderPercent: "",
  smallPackage: "",
  mediumPackage: "",
  bigPackage: "",
  customs: false,
  orderStatus: false,
  declarationStatus: false,
  courierStatus: false,
  whatsapp: false,
};

const OthersSettingsForm: FC<FormikProps<typeof defaultValues>> = ({ submitForm, isSubmitting }) => (
  <Form layout="vertical" component="div" size="large">
    <Row gutter={16}>
      <Col span={12}>
        <TextField name="orderPercent" item={{ label: "Sifariş faizi" }} input={{ placeholder: "%" }} />
      </Col>
      <Col span={12}>
        <TextField name="smallPackage" item={{ label: "Kiçik paket qiyməti" }} input={{ placeholder: "0.00" }} />
      </Col>
      <Col span={12}>
        <TextField name="mediumPackage" item={{ label: "Orta paket qiyməti" }} input={{ placeholder: "0.00" }} />
      </Col>
      <Col span={12}>
        <TextField name="bigPackage" item={{ label: "Böyük paket qiyməti" }} input={{ placeholder: "0.00" }} />
      </Col>
    </Row>
    <Row gutter={16} style={{ marginTop: 8 }}>
      <Col span={8}><CheckboxField name="customs" item={{ label: " " }}>Gömrük</CheckboxField></Col>
      <Col span={8}><CheckboxField name="orderStatus" item={{ label: " " }}>Sifariş yaratmaq</CheckboxField></Col>
      <Col span={8}><CheckboxField name="declarationStatus" item={{ label: " " }}>Bağlama yaratmaq</CheckboxField></Col>
      <Col span={8}><CheckboxField name="courierStatus" item={{ label: " " }}>Kuryer yaratmaq</CheckboxField></Col>
      <Col span={8}><CheckboxField name="whatsapp" item={{ label: " " }}>WhatsApp bildirişlər</CheckboxField></Col>
    </Row>
    <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
      <Button type="primary" loading={isSubmitting} onClick={submitForm}>Yadda saxla</Button>
    </div>
  </Form>
);

export const OthersSettings: FC = () => {
  const { initialValues, onSubmit, isLoading } = useSettingsGroup("others", defaultValues);
  if (isLoading) return <Spin />;
  return (
    <Formik initialValues={initialValues as typeof defaultValues} onSubmit={onSubmit} enableReinitialize>
      {(f) => <OthersSettingsForm {...f} />}
    </Formik>
  );
};
