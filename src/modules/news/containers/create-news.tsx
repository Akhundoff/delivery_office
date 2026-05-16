import { FC } from "react";
import { Button, Form, Modal, Spin } from "antd";
import * as Icons from "@ant-design/icons";
import { Formik, FormikProps } from "formik";
import { TextField } from "@shared/modules/form/fields/text";
import { TextAreaField } from "@shared/modules/form/fields/textarea";
import { UploadField } from "@shared/modules/form/fields/upload";
import { useCloseModal } from "@shared/hooks";
import { INewsFormValues } from "../interfaces";
import { useNewsForm } from "../hooks";

const CreateNewsForm: FC<FormikProps<INewsFormValues> & { id?: string }> = ({ handleSubmit, isSubmitting, id }) => {
  const [closeModal] = useCloseModal();

  return (
    <Modal
      open={true}
      onOk={() => handleSubmit()}
      onCancel={() => closeModal("/news")}
      confirmLoading={isSubmitting}
      title={!id ? "Yeni xəbər" : "Xəbəri düzəlt"}
      okText="Yadda saxla"
      cancelText="Ləğv et"
      width={600}
    >
      <Form layout="vertical" component="div" size="large">
        <TextField name="title" item={{ label: "Başlıq" }} input={{ placeholder: "Xəbərin başlığını daxil edin..." }} />
        <TextAreaField name="descr" item={{ label: "Açıqlama" }} input={{ placeholder: "Qısa açıqlama...", rows: 3 }} />
        <TextField name="body" item={{ label: "Link" }} input={{ placeholder: "https://..." }} />
        <UploadField name="image" item={{ label: "Şəkil" }} renderContent={({ previewUrl }) => (
          <Button icon={<Icons.UploadOutlined />}>
            {previewUrl ? "Şəkil seçildi" : "Şəkil seçin"}
          </Button>
        )} />
      </Form>
    </Modal>
  );
};

export const CreateNews: FC = () => {
  const { initialValues, onSubmit, id, isLoading } = useNewsForm();

  if (isLoading) {
    return (
      <Modal open={true} footer={null} closable={false}>
        <Spin style={{ display: "block", padding: "40px 0", textAlign: "center" }} />
      </Modal>
    );
  }

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit} enableReinitialize={true}>
      {(formik) => <CreateNewsForm {...formik} id={id} />}
    </Formik>
  );
};
