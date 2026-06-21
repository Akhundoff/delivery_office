import { FC } from 'react';
import { Button, Col, Form, Row, Spin } from 'antd';
import { Formik, FormikProps } from 'formik';
import { TextField } from '@shared/modules/form/fields/text';
import { useBranchesSettings, BranchesValues } from '../hooks';

const BranchesSettingsForm: FC<FormikProps<BranchesValues>> = ({ submitForm, isSubmitting, values }) => (
  <Form layout="vertical" component="div" size="large">
    {values.items.map((branch, i) => (
      <div key={i} style={{ marginBottom: 25 }}>
        <h3 style={{ marginBottom: 15, fontSize: 20 }}>{branch.name}</h3>
        <Row gutter={[12, 0]}>
          <Col xs={24} md={12}>
            <TextField name={`items.${i}.name`} item={{ label: 'Başlıq' }} />
            <TextField name={`items.${i}.number`} item={{ label: 'Telefon nömrəsi' }} />
            <TextField name={`items.${i}.email`} item={{ label: 'Email' }} />
            <TextField name={`items.${i}.address`} item={{ label: 'Adress' }} />
            <TextField name={`items.${i}.map`} item={{ label: 'Xəritə' }} />
          </Col>
          <Col xs={24} md={12}>
            <iframe title="Google Maps Preview" width="100%" height="100%" frameBorder={0} src={branch.map} style={{ pointerEvents: 'none' }} />
          </Col>
        </Row>
      </div>
    ))}
    <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'flex-end' }}>
      <Button type="primary" loading={isSubmitting} disabled={isSubmitting} onClick={submitForm}>
        Yadda saxla
      </Button>
    </div>
  </Form>
);

export const BranchesSettings: FC = () => {
  const { initialValues, onSubmit, isLoading } = useBranchesSettings();
  if (isLoading) return <Spin />;
  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit} enableReinitialize>
      {(f) => <BranchesSettingsForm {...f} />}
    </Formik>
  );
};
