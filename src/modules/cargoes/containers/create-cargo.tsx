import { FC } from "react";
import { Form, Modal, Spin } from "antd";
import { Formik, FormikProps } from "formik";
import { TextField } from "@shared/modules/form/fields/text";
import { useCloseModal } from "@shared/hooks";
import { ICargoFormValues } from "../interfaces";
import { useCargoForm } from "../hooks";

const CreateCargoForm: FC<FormikProps<ICargoFormValues> & { id?: string }> = ({ handleSubmit, isSubmitting, id }) => {
  const [closeModal] = useCloseModal();
  return (
    <Modal open={true} onOk={() => handleSubmit()} onCancel={() => closeModal("/cargoes")} confirmLoading={isSubmitting} title={!id ? "Yeni karqo" : "Karqonu düzəlt"} okText="Yadda saxla" cancelText="Ləğv et">
      <Form layout="vertical" component="div" size="large">
        <TextField name="name" item={{ label: "Ad" }} input={{ placeholder: "Karqonun adını daxil edin..." }} />
        <TextField name="description" item={{ label: "Açıqlama" }} input={{ placeholder: "Açıqlama daxil edin..." }} />
      </Form>
    </Modal>
  );
};

export const CreateCargo: FC = () => {
  const { initialValues, onSubmit, id, isLoading } = useCargoForm();
  if (isLoading) return <Modal open={true} footer={null} closable={false}><Spin style={{ display: "block", padding: "40px 0", textAlign: "center" }} /></Modal>;
  return <Formik initialValues={initialValues} onSubmit={onSubmit} enableReinitialize={true}>{(f) => <CreateCargoForm {...f} id={id} />}</Formik>;
};
