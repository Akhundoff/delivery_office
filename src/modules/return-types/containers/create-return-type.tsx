import { FC } from "react";
import { Form, Modal, Spin } from "antd";
import { Formik, FormikProps } from "formik";

import { TextField } from "@shared/modules/form/fields/text";
import { useCloseModal } from "@shared/hooks";

import { IReturnTypeFormValues } from "../interfaces";
import { useReturnTypeForm } from "../hooks";

const CreateReturnTypeForm: FC<
  FormikProps<IReturnTypeFormValues> & { id?: string }
> = ({ handleSubmit, isSubmitting, id }) => {
  const [closeModal] = useCloseModal();

  return (
    <Modal
      open={true}
      onOk={() => handleSubmit()}
      onCancel={() => closeModal("/return-types")}
      confirmLoading={isSubmitting}
      title={!id ? "Yeni iadə səbəbi" : "İadə səbəbini düzəlt"}
      okText="Yadda saxla"
      cancelText="Ləğv et"
    >
      <Form layout="vertical" component="div" size="large">
        <TextField
          name="name"
          item={{ label: "Ad" }}
          input={{ placeholder: "İadə səbəbinin adını daxil edin..." }}
        />
      </Form>
    </Modal>
  );
};

export const CreateReturnType: FC = () => {
  const { initialValues, onSubmit, id, isLoading } = useReturnTypeForm();

  if (isLoading) {
    return (
      <Modal open={true} footer={null} closable={false}>
        <Spin style={{ display: "block", padding: "40px 0", textAlign: "center" }} />
      </Modal>
    );
  }

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      enableReinitialize={true}
    >
      {(formik) => <CreateReturnTypeForm {...formik} id={id} />}
    </Formik>
  );
};
