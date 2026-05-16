import { FC } from "react";
import { Col, Form, Modal, Radio, Row, Spin } from "antd";
import { Formik, FormikProps, useFormikContext } from "formik";
import { TextField } from "@shared/modules/form/fields/text";
import { TextAreaField } from "@shared/modules/form/fields/textarea";
import { RadioField } from "@shared/modules/form/fields/radio";
import { useCloseModal } from "@shared/hooks";
import { IPopupFormValues, PopupTarget, PopupType } from "../interfaces";
import { usePopupForm } from "../hooks";

const DateFields: FC = () => {
  const { values, setFieldValue } = useFormikContext<IPopupFormValues>();
  return (
    <Row gutter={24}>
      <Col span={12}>
        <TextField name="startDate" item={{ label: "Başlanğıc tarixi" }} input={{ placeholder: "YYYY-MM-DD HH:mm", value: values.startDate, onChange: (e) => setFieldValue("startDate", e.target.value) }} />
      </Col>
      <Col span={12}>
        <TextField name="endDate" item={{ label: "Bitmə tarixi" }} input={{ placeholder: "YYYY-MM-DD HH:mm", value: values.endDate, onChange: (e) => setFieldValue("endDate", e.target.value) }} />
      </Col>
    </Row>
  );
};

const CreatePopupForm: FC<FormikProps<IPopupFormValues> & { id?: string }> = ({ handleSubmit, isSubmitting, id }) => {
  const [closeModal] = useCloseModal();

  return (
    <Modal
      open={true}
      onOk={() => handleSubmit()}
      onCancel={() => closeModal("/popups")}
      confirmLoading={isSubmitting}
      title={!id ? "Yeni popup" : "Popupu düzəlt"}
      okText="Yadda saxla"
      cancelText="Ləğv et"
      width={700}
    >
      <Form layout="vertical" component="div" size="large">
        <TextField name="title" item={{ label: "Başlıq" }} input={{ placeholder: "Popup başlığı..." }} />
        <TextAreaField name="message" item={{ label: "Mesaj" }} input={{ placeholder: "Mətn...", rows: 3 }} />
        <DateFields />
        <Row gutter={24}>
          <Col span={12}>
            <TextField name="buttonLink" item={{ label: "Düymə linki" }} input={{ placeholder: "https://..." }} />
          </Col>
          <Col span={12}>
            <TextField name="buttonName" item={{ label: "Düymə mətni" }} input={{ placeholder: "Ətraflı..." }} />
          </Col>
        </Row>
        <TextField name="buttonLinkMobile" item={{ label: "Mobil düymə linki" }} input={{ placeholder: "Ekran adı..." }} />
        <Row gutter={24}>
          <Col span={12}>
            <RadioField name="target" item={{ label: "Hədəf" }}>
              <Radio value={PopupTarget.MOBILE}>Mobil tətbiq</Radio>
              <Radio value={PopupTarget.WEBSITE}>Veb sayt</Radio>
              <Radio value={PopupTarget.BOTH}>Hər ikisi</Radio>
            </RadioField>
          </Col>
          <Col span={12}>
            <RadioField name="type" item={{ label: "Tip" }}>
              <Radio value={PopupType.STANDART}>Standart</Radio>
              <Radio value={PopupType.SUCCESS}>Uğurlu</Radio>
              <Radio value={PopupType.WARNING}>Xəbərdarlıq</Radio>
            </RadioField>
          </Col>
        </Row>
        <TextField name="maxShowCount" item={{ label: "Maks. göstərmə sayı" }} input={{ placeholder: "0" }} />
      </Form>
    </Modal>
  );
};

export const CreatePopup: FC = () => {
  const { initialValues, onSubmit, id, isLoading } = usePopupForm();

  if (isLoading) {
    return (
      <Modal open={true} footer={null} closable={false}>
        <Spin style={{ display: "block", padding: "40px 0", textAlign: "center" }} />
      </Modal>
    );
  }

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit} enableReinitialize={true}>
      {(formik) => <CreatePopupForm {...formik} id={id} />}
    </Formik>
  );
};
