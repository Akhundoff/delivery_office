import { FC } from "react";
import { Button, Form, Modal, Select, Spin } from "antd";
import * as Icons from "@ant-design/icons";
import { Formik, FormikProps } from "formik";
import { TextField } from "@shared/modules/form/fields/text";
import { SelectField } from "@shared/modules/form/fields/select";
import { UploadField } from "@shared/modules/form/fields/upload";
import { useCloseModal } from "@shared/hooks";
import { useCountries } from "@modules/countries";
import { IShopFormValues } from "../interfaces";
import { useShopForm, useShopTypes } from "../hooks";

const { Option } = Select;

const CreateShopForm: FC<FormikProps<IShopFormValues> & { id?: string }> = ({ handleSubmit, isSubmitting, id }) => {
  const [closeModal] = useCloseModal();
  const { data: countries = [] } = useCountries();
  const { data: shopTypes = [] } = useShopTypes();

  return (
    <Modal
      open={true}
      onOk={() => handleSubmit()}
      onCancel={() => closeModal("/shops")}
      confirmLoading={isSubmitting}
      title={!id ? "Yeni mağaza" : "Mağazanı düzəlt"}
      okText="Yadda saxla"
      cancelText="Ləğv et"
      width={600}
    >
      <Form layout="vertical" component="div" size="large">
        <TextField name="label" item={{ label: "Ad" }} input={{ placeholder: "Mağazanın adını daxil edin..." }} />
        <TextField name="url" item={{ label: "URL" }} input={{ placeholder: "https://..." }} />
        <SelectField name="countryId" item={{ label: "Ölkə" }} input={{ placeholder: "Ölkə seçin" }}>
          {countries.map((c) => <Option key={c.id} value={String(c.id)}>{c.name}</Option>)}
        </SelectField>
        <SelectField name="categoryIds" item={{ label: "Kateqoriyalar" }} input={{ mode: "multiple", placeholder: "Kateqoriya seçin" }}>
          {shopTypes.map((t) => <Option key={t.id} value={String(t.id)}>{t.name}</Option>)}
        </SelectField>
        <UploadField name="logo" item={{ label: "Loqo" }} renderContent={({ previewUrl }) => (
          <Button icon={<Icons.UploadOutlined />}>
            {previewUrl ? "Loqo seçildi" : "Loqo seçin"}
          </Button>
        )} />
      </Form>
    </Modal>
  );
};

export const CreateShop: FC = () => {
  const { initialValues, onSubmit, id, isLoading } = useShopForm();

  if (isLoading) {
    return (
      <Modal open={true} footer={null} closable={false}>
        <Spin style={{ display: "block", padding: "40px 0", textAlign: "center" }} />
      </Modal>
    );
  }

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit} enableReinitialize={true}>
      {(formik) => <CreateShopForm {...formik} id={id} />}
    </Formik>
  );
};
