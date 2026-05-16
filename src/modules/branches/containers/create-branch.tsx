import { FC } from "react";
import { Col, Form, Modal, Row, Spin } from "antd";
import { Formik, FormikProps } from "formik";

import { TextField } from "@shared/modules/form/fields/text";
import { CheckboxField } from "@shared/modules/form/fields/checkbox";
import { useCloseModal } from "@shared/hooks";

import { IBranchFormValues } from "../interfaces";
import { useBranchForm } from "../hooks";

const CreateBranchForm: FC<FormikProps<IBranchFormValues> & { id?: string }> = ({
  handleSubmit,
  isSubmitting,
  id,
}) => {
  const [closeModal] = useCloseModal();

  return (
    <Modal
      open={true}
      onOk={() => handleSubmit()}
      onCancel={() => closeModal("/branches")}
      confirmLoading={isSubmitting}
      title={!id ? "Yeni filial" : "Filialı düzəlt"}
      okText="Yadda saxla"
      cancelText="Ləğv et"
      width={700}
    >
      <Form layout="vertical" component="div" size="large">
        <TextField
          name="name"
          item={{ label: "Ad" }}
          input={{ placeholder: "Filialın adını daxil edin..." }}
        />
        <Row gutter={16}>
          <Col span={12}>
            <TextField
              name="phone"
              item={{ label: "Telefon" }}
              input={{ placeholder: "+994..." }}
            />
          </Col>
          <Col span={12}>
            <TextField
              name="email"
              item={{ label: "E-poçt" }}
              input={{ placeholder: "email@domain.az" }}
            />
          </Col>
        </Row>
        <TextField
          name="address"
          item={{ label: "Ünvan" }}
          input={{ placeholder: "Ünvanı daxil edin..." }}
        />
        <Row gutter={16}>
          <Col span={12}>
            <TextField
              name="latitude"
              item={{ label: "Enlik (lat)" }}
              input={{ placeholder: "40.409264" }}
            />
          </Col>
          <Col span={12}>
            <TextField
              name="longitude"
              item={{ label: "Uzunluq (lng)" }}
              input={{ placeholder: "49.867092" }}
            />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <TextField
              name="openHour"
              item={{ label: "Açılış saatı" }}
              input={{ placeholder: "09:00" }}
            />
          </Col>
          <Col span={12}>
            <TextField
              name="closeHour"
              item={{ label: "Bağlanış saatı" }}
              input={{ placeholder: "18:00" }}
            />
          </Col>
        </Row>
        <TextField
          name="descr"
          item={{ label: "Açıqlama" }}
          input={{ placeholder: "Açıqlama daxil edin..." }}
        />
        <Row gutter={16}>
          <Col span={8}>
            <CheckboxField name="isBranch" item={{ label: " " }}>
              Filial
            </CheckboxField>
          </Col>
          <Col span={8}>
            <CheckboxField name="isRegionBranch" item={{ label: " " }}>
              Rayon filialı
            </CheckboxField>
          </Col>
          <Col span={8}>
            <CheckboxField name="hide" item={{ label: " " }}>
              Gizlə
            </CheckboxField>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export const CreateBranch: FC = () => {
  const { initialValues, onSubmit, id, isLoading } = useBranchForm();

  if (isLoading) {
    return (
      <Modal open={true} footer={null} closable={false}>
        <Spin style={{ display: "block", padding: "40px 0", textAlign: "center" }} />
      </Modal>
    );
  }

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit} enableReinitialize={true}>
      {(f) => <CreateBranchForm {...f} id={id} />}
    </Formik>
  );
};
