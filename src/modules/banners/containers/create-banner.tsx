import { FC } from "react";
import { Alert, Button, Form, Modal, Select, Spin } from "antd";
import * as Icons from "@ant-design/icons";
import { Formik, FormikProps, useFormikContext } from "formik";
import { TextField } from "@shared/modules/form/fields/text";
import { SelectField } from "@shared/modules/form/fields/select";
import { CheckboxField } from "@shared/modules/form/fields/checkbox";
import { UploadField } from "@shared/modules/form/fields/upload";
import { useCloseModal } from "@shared/hooks";
import { bannerTypes } from "../constants/banner-types";
import { IBannerFormValues } from "../interfaces";
import { useBannerForm } from "../hooks";

const { Option } = Select;

const BannerTypeInfo: FC = () => {
  const { values } = useFormikContext<IBannerFormValues>();
  const bt = bannerTypes.find((t) => String(t.type) === values.type);
  if (!bt) return null;
  return <Alert message={bt.info} type="info" showIcon style={{ marginBottom: 16 }} />;
};

const CreateBannerForm: FC<FormikProps<IBannerFormValues> & { id?: string }> = ({ handleSubmit, isSubmitting, id }) => {
  const [closeModal] = useCloseModal();

  return (
    <Modal
      open={true}
      onOk={() => handleSubmit()}
      onCancel={() => closeModal("/banners")}
      confirmLoading={isSubmitting}
      title={!id ? "Yeni banner" : "Banneri düzəlt"}
      okText="Yadda saxla"
      cancelText="Ləğv et"
      width={600}
    >
      <Form layout="vertical" component="div" size="large">
        <TextField name="name" item={{ label: "Ad" }} input={{ placeholder: "Bannerin adını daxil edin..." }} />
        <SelectField name="type" item={{ label: "Tip" }} input={{ placeholder: "Tip seçin" }}>
          {bannerTypes.map((bt) => <Option key={bt.type} value={String(bt.type)}>{bt.title}</Option>)}
        </SelectField>
        <BannerTypeInfo />
        <CheckboxField name="active" item={{ label: " " }} input={{ children: "Aktiv" }} />
        <UploadField name="documentFile" item={{ label: "Fayl" }} renderContent={({ previewUrl }) => (
          <Button icon={<Icons.UploadOutlined />}>
            {previewUrl ? "Fayl seçildi" : "Fayl seçin"}
          </Button>
        )} />
      </Form>
    </Modal>
  );
};

export const CreateBanner: FC = () => {
  const { initialValues, onSubmit, id, isLoading } = useBannerForm();

  if (isLoading) {
    return (
      <Modal open={true} footer={null} closable={false}>
        <Spin style={{ display: "block", padding: "40px 0", textAlign: "center" }} />
      </Modal>
    );
  }

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit} enableReinitialize={true}>
      {(formik) => <CreateBannerForm {...formik} id={id} />}
    </Formik>
  );
};
