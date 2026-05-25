import { FC } from "react";
import { Button, Col, Form, Row, Select, Spin } from "antd";
import { Formik, FormikProps } from "formik";
import { SelectField } from "@shared/modules/form/fields/select";
import { useSettingsGroup } from "../hooks";
import { useCashboxes } from "../hooks/cashboxes";

const defaultValues = {
  cashboxId: "",
  terminalCashboxId: "",
};

const fromApi = (raw: Record<string, any>): Partial<typeof defaultValues> => ({
  cashboxId: raw.cashbox_id ?? "",
  terminalCashboxId: raw.terminal_cashbox_id ?? "",
});

const toApi = (values: typeof defaultValues) => ({
  cashbox_id: values.cashboxId,
  terminal_cashbox_id: values.terminalCashboxId,
});

const CashflowSettingsForm: FC<FormikProps<typeof defaultValues>> = ({ submitForm, isSubmitting }) => {
  const cashboxes = useCashboxes();

  return (
    <Form layout="vertical" component="div" size="large">
      <Row gutter={16}>
        <Col span={12}>
          <SelectField name="cashboxId" item={{ label: "Sifariş kassası" }} input={{ placeholder: "Sifariş kassasını seçin...", loading: cashboxes.isLoading }}>
            {(cashboxes.data ?? []).map((c) => (
              <Select.Option key={c.id} value={String(c.id)}>{c.name}</Select.Option>
            ))}
          </SelectField>
        </Col>
        <Col span={12}>
          <SelectField name="terminalCashboxId" item={{ label: "Terminal kassası" }} input={{ placeholder: "Terminal kassasını seçin...", loading: cashboxes.isLoading }}>
            {(cashboxes.data ?? []).map((c) => (
              <Select.Option key={c.id} value={String(c.id)}>{c.name}</Select.Option>
            ))}
          </SelectField>
        </Col>
      </Row>
      <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
        <Button type="primary" loading={isSubmitting} onClick={submitForm}>Yadda saxla</Button>
      </div>
    </Form>
  );
};

export const CashflowSettings: FC = () => {
  const { initialValues, onSubmit, isLoading } = useSettingsGroup("cashflow", defaultValues, fromApi, toApi);
  if (isLoading) return <Spin />;
  return (
    <Formik initialValues={initialValues as typeof defaultValues} onSubmit={onSubmit} enableReinitialize>
      {(f) => <CashflowSettingsForm {...f} />}
    </Formik>
  );
};
