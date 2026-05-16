import { FC } from "react";
import { Col, Form, Modal, Row, Select, Spin } from "antd";
import { Formik, FormikProps } from "formik";

import { TextField } from "@shared/modules/form/fields/text";
import { SelectField } from "@shared/modules/form/fields/select";
import { CheckboxField } from "@shared/modules/form/fields/checkbox";
import { useCloseModal } from "@shared/hooks";

import { ICountryFormValues } from "../interfaces";
import { useCountryForm } from "../hooks";

const CreateCountryForm: FC<FormikProps<ICountryFormValues> & { id?: string }> = ({
  handleSubmit,
  isSubmitting,
  id,
}) => {
  const [closeModal] = useCloseModal();

  return (
    <Modal
      open={true}
      onOk={() => handleSubmit()}
      onCancel={() => closeModal("/countries")}
      confirmLoading={isSubmitting}
      title={!id ? "Yeni ölkə" : "Ölkəni düzəlt"}
      okText="Yadda saxla"
      cancelText="Ləğv et"
      width={720}
    >
      <Form layout="vertical" component="div" size="large">
        <Row gutter={16}>
          <Col span={12}>
            <TextField
              name="name"
              item={{ label: "Ad" }}
              input={{ placeholder: "Ölkənin adını daxil edin..." }}
            />
          </Col>
          <Col span={12}>
            <TextField
              name="abbr"
              item={{ label: "Abbreviatura" }}
              input={{ placeholder: "US, TR, GB..." }}
            />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <TextField
              name="currency"
              item={{ label: "Valyuta" }}
              input={{ placeholder: "USD, EUR, AZN..." }}
            />
          </Col>
          <Col span={8}>
            <TextField
              name="currencyType"
              item={{ label: "Valyuta tipi" }}
              input={{ placeholder: "USD" }}
            />
          </Col>
          <Col span={8}>
            <SelectField name="unit" item={{ label: "Çəki vahidi" }} input={{ placeholder: "Seçin" }}>
              <Select.Option value="KG">KG</Select.Option>
              <Select.Option value="LBS">LBS</Select.Option>
            </SelectField>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <TextField
              name="countryCode"
              item={{ label: "Ölkə kodu" }}
              input={{ placeholder: "+1, +90..." }}
            />
          </Col>
          <Col span={12}>
            <TextField
              name="minSize"
              item={{ label: "Min. ölçü" }}
              input={{ placeholder: "0", type: "number" }}
            />
          </Col>
        </Row>
        <TextField
          name="address"
          item={{ label: "Ünvan" }}
          input={{ placeholder: "Anbar ünvanı..." }}
        />
        <TextField
          name="addressHeading"
          item={{ label: "Ünvan başlığı" }}
          input={{ placeholder: "Ünvan başlığı..." }}
        />
        <TextField
          name="description"
          item={{ label: "Açıqlama" }}
          input={{ placeholder: "Açıqlama daxil edin..." }}
        />
        <TextField
          name="carrierCompanyName"
          item={{ label: "Daşıyıcı şirkət" }}
          input={{ placeholder: "Şirkətin adı..." }}
        />
        <Row gutter={16}>
          <Col span={12}>
            <TextField
              name="carrierCompanyPhone"
              item={{ label: "Daşıyıcı telefon" }}
              input={{ placeholder: "+1..." }}
            />
          </Col>
          <Col span={12}>
            <TextField
              name="carrierCompanyAddress"
              item={{ label: "Daşıyıcı ünvan" }}
              input={{ placeholder: "Ünvan..." }}
            />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={6}><CheckboxField name="box" item={{ label: " " }}>Yeşik</CheckboxField></Col>
          <Col span={6}><CheckboxField name="isOrder" item={{ label: " " }}>Sifariş</CheckboxField></Col>
          <Col span={6}><CheckboxField name="isDeclaration" item={{ label: " " }}>Bəyannamə</CheckboxField></Col>
          <Col span={6}><CheckboxField name="fullDeclaration" item={{ label: " " }}>Tam bəyannamə</CheckboxField></Col>
        </Row>
        <Row gutter={16}>
          <Col span={6}><CheckboxField name="zeroPrice" item={{ label: " " }}>Sıfır qiymət</CheckboxField></Col>
          <Col span={6}><CheckboxField name="zeroSend" item={{ label: " " }}>Sıfır göndəriş</CheckboxField></Col>
          <Col span={6}><CheckboxField name="smsConfirmation" item={{ label: " " }}>SMS təsdiq</CheckboxField></Col>
          <Col span={6}><CheckboxField name="hasWarehouse" item={{ label: " " }}>Anbar var</CheckboxField></Col>
        </Row>
      </Form>
    </Modal>
  );
};

export const CreateCountry: FC = () => {
  const { initialValues, onSubmit, id, isLoading } = useCountryForm();

  if (isLoading) {
    return (
      <Modal open={true} footer={null} closable={false}>
        <Spin style={{ display: "block", padding: "40px 0", textAlign: "center" }} />
      </Modal>
    );
  }

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit} enableReinitialize={true}>
      {(f) => <CreateCountryForm {...f} id={id} />}
    </Formik>
  );
};
