import { FC } from "react";
import { Form, Modal, Spin } from "antd";
import { Formik, FormikProps } from "formik";

import { TextField } from "@shared/modules/form/fields/text";
import { useCloseModal } from "@shared/hooks";

import { IProductTypeFormValues } from "../interfaces";
import { useProductTypeForm } from "../hooks";

const CreateProductTypeForm: FC<FormikProps<IProductTypeFormValues> & { id?: string }> = ({
  handleSubmit,
  isSubmitting,
  id,
}) => {
  const [closeModal] = useCloseModal();

  return (
    <Modal
      open={true}
      onOk={() => handleSubmit()}
      onCancel={() => closeModal("/product-types")}
      confirmLoading={isSubmitting}
      title={!id ? "Yeni məhsul tipi" : "Məhsul tipini düzəlt"}
      okText="Yadda saxla"
      cancelText="Ləğv et"
    >
      <Form layout="vertical" component="div" size="large">
        <TextField
          name="name"
          item={{ label: "Ad (AZ)" }}
          input={{ placeholder: "Azərbaycan dilində adı daxil edin..." }}
        />
        <TextField
          name="nameEn"
          item={{ label: "Ad (EN)" }}
          input={{ placeholder: "İngilis dilində adı daxil edin..." }}
        />
        <TextField
          name="nameRu"
          item={{ label: "Ad (RU)" }}
          input={{ placeholder: "Rus dilində adı daxil edin..." }}
        />
        <TextField
          name="nameTr"
          item={{ label: "Ad (TR)" }}
          input={{ placeholder: "Türk dilində adı daxil edin..." }}
        />
      </Form>
    </Modal>
  );
};

export const CreateProductType: FC = () => {
  const { initialValues, onSubmit, id, isLoading } = useProductTypeForm();

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
      {(f) => <CreateProductTypeForm {...f} id={id} />}
    </Formik>
  );
};
