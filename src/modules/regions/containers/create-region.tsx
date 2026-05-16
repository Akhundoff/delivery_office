import { FC, useMemo } from "react";
import { Form, Modal, Select, Spin } from "antd";
import { Formik, FormikProps } from "formik";

import { TextField } from "@shared/modules/form/fields/text";
import { SelectField } from "@shared/modules/form/fields/select";
import { useCloseModal } from "@shared/hooks";
import { useBranches } from "@modules/branches";

import { IRegionFormValues } from "../interfaces";
import { useRegionForm } from "../hooks";

const CreateRegionForm: FC<FormikProps<IRegionFormValues> & { id?: string }> = ({
  handleSubmit,
  isSubmitting,
  id,
}) => {
  const [closeModal] = useCloseModal();
  const branches = useBranches();
  const branchOptions = useMemo(
    () =>
      (branches.data || []).map((b) => (
        <Select.Option key={b.id} value={String(b.id)}>
          #{b.id} - {b.name}
        </Select.Option>
      )),
    [branches.data],
  );

  return (
    <Modal
      open={true}
      onOk={() => handleSubmit()}
      onCancel={() => closeModal("/regions")}
      confirmLoading={isSubmitting}
      title={!id ? "Yeni rayon" : "Rayonu düzəlt"}
      okText="Yadda saxla"
      cancelText="Ləğv et"
    >
      <Form layout="vertical" component="div" size="large">
        <TextField
          name="name"
          item={{ label: "Ad" }}
          input={{ placeholder: "Rayonun adını daxil edin..." }}
        />
        <TextField
          name="price"
          item={{ label: "Qiymət" }}
          input={{ placeholder: "Qiymət daxil edin...", type: "number" }}
        />
        <TextField
          name="courierPrice"
          item={{ label: "Kuryer qiyməti" }}
          input={{ placeholder: "Kuryer qiymətini daxil edin..." }}
        />
        <TextField
          name="shipping"
          item={{ label: "Çatdırılma" }}
          input={{ placeholder: "Çatdırılma dəyərini daxil edin...", type: "number" }}
        />
        <SelectField
          name="branchIds"
          item={{ label: "Filiallar" }}
          input={{
            placeholder: "Filialları seçin",
            mode: "multiple",
            loading: branches.isLoading,
          }}
        >
          {branchOptions}
        </SelectField>
        <TextField
          name="description"
          item={{ label: "Açıqlama" }}
          input={{ placeholder: "Açıqlama daxil edin..." }}
        />
      </Form>
    </Modal>
  );
};

export const CreateRegion: FC = () => {
  const { initialValues, onSubmit, id, isLoading } = useRegionForm();

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
      {(f) => <CreateRegionForm {...f} id={id} />}
    </Formik>
  );
};
