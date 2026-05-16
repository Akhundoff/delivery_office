import { FC, useContext, useMemo } from "react";
import { Col, Form, Modal, Row, Select, Spin } from "antd";
import { Formik, FormikProps } from "formik";
import { TextField } from "@shared/modules/form/fields/text";
import { SelectField } from "@shared/modules/form/fields/select";
import { CheckboxField } from "@shared/modules/form/fields/checkbox";
import { useCloseModal } from "@shared/hooks";
import { SettingsContext } from "@modules/settings";
import { DeclarationsService } from "@modules/declarations/services";
import { useQuery } from "react-query";
import { IPlanFormValues } from "../interfaces";
import { usePlanForm } from "../hooks";

const CreatePlanForm: FC<FormikProps<IPlanFormValues> & { id?: string }> = ({ handleSubmit, isSubmitting, id }) => {
  const [closeModal] = useCloseModal();
  const settings = useContext(SettingsContext);

  const planCategories = useQuery(["declarations-plan-categories"], async () => {
    const r = await DeclarationsService.getPlanCategories();
    if (r.status === 200) return r.data;
    return [];
  }, { staleTime: 5 * 60 * 1000 });

  const countryOptions = useMemo(() =>
    (settings.data?.countries || []).map((c) => <Select.Option key={c.id} value={String(c.id)}>{c.name}</Select.Option>),
    [settings.data],
  );

  const categoryOptions = useMemo(() =>
    (planCategories.data || []).map((c) => <Select.Option key={c.id} value={String(c.id)}>{c.name}</Select.Option>),
    [planCategories.data],
  );

  return (
    <Modal open={true} onOk={() => handleSubmit()} onCancel={() => closeModal("/plans")} confirmLoading={isSubmitting} title={!id ? "Yeni tarif" : "Tarifi düzəlt"} okText="Yadda saxla" cancelText="Ləğv et" width={640}>
      <Form layout="vertical" component="div" size="large">
        <Row gutter={[16, 0]}>
          <Col xs={24} md={12}>
            <SelectField name="countryId" item={{ label: "Ölkə" }} input={{ placeholder: "Ölkə seçin" }}>{countryOptions}</SelectField>
          </Col>
          <Col xs={24} md={12}>
            <SelectField name="categoryId" item={{ label: "Kateqoriya" }} input={{ placeholder: "Kateqoriya seçin", loading: planCategories.isLoading }}>{categoryOptions}</SelectField>
          </Col>
          <Col xs={24} md={12}>
            <TextField name="weightFrom" item={{ label: "Çəkidən (kg)" }} input={{ placeholder: "0", type: "number" }} />
          </Col>
          <Col xs={24} md={12}>
            <TextField name="weightTo" item={{ label: "Çəkiyə (kg)" }} input={{ placeholder: "Boş — limitsiz" }} />
          </Col>
          <Col xs={24} md={12}>
            <TextField name="price" item={{ label: "Qiymət (USD)" }} input={{ placeholder: "0.00", type: "number" }} />
          </Col>
          <Col xs={24} md={12}>
            <TextField name="oldPrice" item={{ label: "Köhnə qiymət (USD)" }} input={{ placeholder: "0.00", type: "number" }} />
          </Col>
          <Col xs={24}>
            <TextField name="description" item={{ label: "Açıqlama" }} input={{ placeholder: "Açıqlama daxil edin..." }} />
          </Col>
          <Col xs={24}>
            <CheckboxField name="isLiquid" input={{ children: "Maye bağlama" }} />
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export const CreatePlan: FC = () => {
  const { initialValues, onSubmit, id, isLoading } = usePlanForm();
  if (isLoading) return <Modal open={true} footer={null} closable={false}><Spin style={{ display: "block", padding: "40px 0", textAlign: "center" }} /></Modal>;
  return <Formik initialValues={initialValues} onSubmit={onSubmit} enableReinitialize={true}>{(f) => <CreatePlanForm {...f} id={id} />}</Formik>;
};
