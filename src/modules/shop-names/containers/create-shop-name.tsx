import { FC, useContext, useMemo } from "react";
import { Form, Modal, Select, Spin } from "antd";
import { Formik, FormikProps } from "formik";
import { TextField } from "@shared/modules/form/fields/text";
import { SelectField } from "@shared/modules/form/fields/select";
import { useCloseModal } from "@shared/hooks";
import { SettingsContext } from "@modules/settings";
import { IShopNameFormValues } from "../interfaces";
import { useShopNameForm } from "../hooks";

const CreateShopNameForm: FC<FormikProps<IShopNameFormValues> & { id?: string }> = ({ handleSubmit, isSubmitting, id }) => {
  const [closeModal] = useCloseModal();
  const settings = useContext(SettingsContext);
  const countryOptions = useMemo(() =>
    (settings.data?.countries || []).map((c) => <Select.Option key={c.id} value={String(c.id)}>{c.name}</Select.Option>),
    [settings.data],
  );
  return (
    <Modal open={true} onOk={() => handleSubmit()} onCancel={() => closeModal("/shop-names")} confirmLoading={isSubmitting} title={!id ? "Yeni xarici mağaza" : "Mağazanı düzəlt"} okText="Yadda saxla" cancelText="Ləğv et">
      <Form layout="vertical" component="div" size="large">
        <TextField name="name" item={{ label: "Ad" }} input={{ placeholder: "Mağazanın adını daxil edin..." }} />
        <SelectField name="countryId" item={{ label: "Ölkə" }} input={{ placeholder: "Ölkə seçin", allowClear: true }}>
          {countryOptions}
        </SelectField>
      </Form>
    </Modal>
  );
};

export const CreateShopName: FC = () => {
  const { initialValues, onSubmit, id, isLoading } = useShopNameForm();
  if (isLoading) return <Modal open={true} footer={null} closable={false}><Spin style={{ display: "block", padding: "40px 0", textAlign: "center" }} /></Modal>;
  return <Formik initialValues={initialValues} onSubmit={onSubmit} enableReinitialize={true}>{(f) => <CreateShopNameForm {...f} id={id} />}</Formik>;
};
