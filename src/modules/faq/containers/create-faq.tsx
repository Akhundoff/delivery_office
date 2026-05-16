import { FC } from "react";
import { Form, Modal, Spin } from "antd";
import { Formik, FormikProps } from "formik";
import { TextField } from "@shared/modules/form/fields/text";
import { TextAreaField } from "@shared/modules/form/fields/textarea";
import { useCloseModal } from "@shared/hooks";
import { IFaqFormValues } from "../interfaces";
import { useFaqForm } from "../hooks";

const CreateFaqForm: FC<FormikProps<IFaqFormValues> & { id?: string }> = ({ handleSubmit, isSubmitting, id }) => {
  const [closeModal] = useCloseModal();

  return (
    <Modal
      open={true}
      onOk={() => handleSubmit()}
      onCancel={() => closeModal("/faq")}
      confirmLoading={isSubmitting}
      title={!id ? "Yeni sual" : "Sualı düzəlt"}
      okText="Yadda saxla"
      cancelText="Ləğv et"
      width={600}
    >
      <Form layout="vertical" component="div" size="large">
        <TextField name="question" item={{ label: "Sual" }} input={{ placeholder: "Sualı daxil edin..." }} />
        <TextAreaField name="answer" item={{ label: "Cavab" }} input={{ placeholder: "Cavabı daxil edin...", rows: 4 }} />
        <TextField name="sort" item={{ label: "Sıralama" }} input={{ placeholder: "Sıralama nömrəsi..." }} />
      </Form>
    </Modal>
  );
};

export const CreateFaq: FC = () => {
  const { initialValues, onSubmit, id, isLoading } = useFaqForm();

  if (isLoading) {
    return (
      <Modal open={true} footer={null} closable={false}>
        <Spin style={{ display: "block", padding: "40px 0", textAlign: "center" }} />
      </Modal>
    );
  }

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit} enableReinitialize={true}>
      {(formik) => <CreateFaqForm {...formik} id={id} />}
    </Formik>
  );
};
