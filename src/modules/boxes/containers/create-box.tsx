import { FC, useMemo } from "react";
import { Form, Modal, Select, Spin } from "antd";
import { Formik, FormikProps } from "formik";
import { TextField } from "@shared/modules/form/fields/text";
import { SelectField } from "@shared/modules/form/fields/select";
import { useCloseModal } from "@shared/hooks";
import { useBranches } from "@modules/branches";
import { IBoxFormValues } from "../interfaces";
import { useBoxForm } from "../hooks";

const CreateBoxForm: FC<FormikProps<IBoxFormValues> & { id?: string }> = ({ handleSubmit, isSubmitting, id }) => {
  const [closeModal] = useCloseModal();
  const branches = useBranches();
  const branchOptions = useMemo(() => (branches.data || []).map((b) => <Select.Option key={b.id} value={String(b.id)}>#{b.id} - {b.name}</Select.Option>), [branches.data]);
  return (
    <Modal open={true} onOk={() => handleSubmit()} onCancel={() => closeModal("/boxes")} confirmLoading={isSubmitting} title={!id ? "Yeni yeşik" : "Yeşiyi düzəlt"} okText="Yadda saxla" cancelText="Ləğv et">
      <Form layout="vertical" component="div" size="large">
        <TextField name="name" item={{ label: "Ad" }} input={{ placeholder: "Yeşiyin adını daxil edin..." }} />
        <SelectField name="branchId" item={{ label: "Filial" }} input={{ placeholder: "Filial seçin", loading: branches.isLoading }}>
          {branchOptions}
        </SelectField>
      </Form>
    </Modal>
  );
};

export const CreateBox: FC = () => {
  const { initialValues, onSubmit, id, isLoading } = useBoxForm();
  if (isLoading) return <Modal open={true} footer={null} closable={false}><Spin style={{ display: "block", padding: "40px 0", textAlign: "center" }} /></Modal>;
  return <Formik initialValues={initialValues} onSubmit={onSubmit} enableReinitialize={true}>{(f) => <CreateBoxForm {...f} id={id} />}</Formik>;
};
