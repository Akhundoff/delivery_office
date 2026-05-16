import { FC } from "react";
import { Form, Modal, Spin } from "antd";
import { Formik, FormikProps } from "formik";

import { TextField } from "@shared/modules/form/fields/text";
import { CheckboxField } from "@shared/modules/form/fields/checkbox";
import { useCloseModal } from "@shared/hooks";

import { IBranchPartnerFormValues } from "../interfaces";
import { useBranchPartnerForm } from "../hooks";

const CreateBranchPartnerForm: FC<FormikProps<IBranchPartnerFormValues> & { id?: string }> = ({
  handleSubmit,
  isSubmitting,
  id,
}) => {
  const [closeModal] = useCloseModal();

  return (
    <Modal
      open={true}
      onOk={() => handleSubmit()}
      onCancel={() => closeModal("/branch-partners")}
      confirmLoading={isSubmitting}
      title={!id ? "Yeni şirkət" : "Şirkəti düzəlt"}
      okText="Yadda saxla"
      cancelText="Ləğv et"
    >
      <Form layout="vertical" component="div" size="large">
        <TextField
          name="name"
          item={{ label: "Ad" }}
          input={{ placeholder: "Şirkətin adını daxil edin..." }}
        />
        <TextField
          name="contact"
          item={{ label: "Əlaqə" }}
          input={{ placeholder: "Əlaqə məlumatını daxil edin..." }}
        />
        <TextField
          name="description"
          item={{ label: "Açıqlama" }}
          input={{ placeholder: "Açıqlama daxil edin..." }}
        />
        <CheckboxField name="isOwner" item={{ label: "Sahib" }}>
          Şirkət sahibidir
        </CheckboxField>
      </Form>
    </Modal>
  );
};

export const CreateBranchPartner: FC = () => {
  const { initialValues, onSubmit, id, isLoading } = useBranchPartnerForm();

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
      {(f) => <CreateBranchPartnerForm {...f} id={id} />}
    </Formik>
  );
};
