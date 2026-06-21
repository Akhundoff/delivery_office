import { FC, useContext, useMemo } from 'react';
import { Col, Form, Modal, Row, Select, Spin } from 'antd';
import { Formik, FormikProps } from 'formik';
import { TextField } from '@shared/modules/form/fields/text';
import { SelectField } from '@shared/modules/form/fields/select';
import { CheckboxField } from '@shared/modules/form/fields/checkbox';
import { useCloseModal } from '@shared/hooks';
import { SettingsContext } from '@modules/settings';
import { useQuery } from 'react-query';
import { IPlanFormValues } from '../interfaces';
import { usePlanForm } from '../hooks';
import { PlansService } from '../services';

const CreatePlanForm: FC<FormikProps<IPlanFormValues> & { id?: string }> = ({ values, handleSubmit, isSubmitting, id }) => {
  const [closeModal] = useCloseModal();
  const settings = useContext(SettingsContext);

  const planCategories = useQuery(
    ['plans', 'categories'],
    async () => {
      const r = await PlansService.getPlanCategories();
      if (r.status === 200) return r.data.data;
      return [];
    },
    { staleTime: 5 * 60 * 1000 },
  );

  const countryOptions = useMemo(
    () =>
      (settings.data?.countries || []).map((c) => (
        <Select.Option key={c.id} value={String(c.id)}>
          {c.name}
        </Select.Option>
      )),
    [settings.data],
  );

  const categoryOptions = useMemo(
    () =>
      (planCategories.data || []).map((c) => (
        <Select.Option key={c.id} value={c.id.toString()}>
          {c.name}
        </Select.Option>
      )),
    [planCategories.data],
  );

  return (
    <Modal
      open={true}
      onOk={() => handleSubmit()}
      onCancel={() => closeModal('/plans')}
      confirmLoading={isSubmitting}
      title={!id ? 'Plan əlavə et' : 'Planda düzəliş et'}
      okText="Yadda saxla"
      cancelText="Ləğv et"
      width={768}
    >
      <Form layout="vertical" component="div" size="large">
        <Row gutter={[24, 0]}>
          <Col xs={24}>
            <SelectField name="countryId" item={{ label: 'Ölkə' }} input={{ placeholder: 'Ölkə seçin...' }}>
              {countryOptions}
            </SelectField>
          </Col>
        </Row>
        <Row gutter={[24, 0]}>
          <Col xs={24} md={12}>
            <TextField name="weightFrom" item={{ label: 'Minimal çəki' }} input={{ placeholder: 'Minimal çəki edin', suffix: 'KQ' }} />
          </Col>
          <Col xs={24} md={12}>
            <TextField name="weightTo" item={{ label: 'Maksimal çəki' }} input={{ placeholder: 'Maxsimal çəki edin', suffix: 'KQ' }} />
          </Col>
        </Row>
        <Row gutter={[24, 0]}>
          <Col xs={24} md={12}>
            <TextField name="price" item={{ label: 'Qiymət' }} input={{ placeholder: 'Qiymət daxil edin', suffix: '$' }} />
          </Col>
          {id && (
            <Col xs={24} md={12}>
              <TextField name="oldPrice" item={{ label: 'Köhnə qiymət' }} input={{ placeholder: 'Köhnə Qiymət daxil edin', suffix: '$' }} />
            </Col>
          )}
          <Col xs={24} md={12}>
            <CheckboxField name="isLiquid" item={{ label: <>&nbsp;</> }} input={{ children: 'Mayedir' }} />
          </Col>
        </Row>
        <CheckboxField name="isSpecial" item={{ label: <>&nbsp;</> }} input={{ children: 'Xüsusi tarifdir' }} />
        {values.isSpecial && (
          <SelectField name="categoryId" item={{ label: 'Tarif' }} input={{ placeholder: 'Tarifi seçin...', loading: planCategories.isLoading }}>
            {categoryOptions}
          </SelectField>
        )}
        <TextField name="description" item={{ label: 'Açıqlama' }} input={{ placeholder: 'Açıqlamanı daxil edin...' }} />
      </Form>
    </Modal>
  );
};

export const CreatePlan: FC = () => {
  const { initialValues, onSubmit, id, isLoading } = usePlanForm();
  if (isLoading)
    return (
      <Modal open={true} footer={null} closable={false}>
        <Spin style={{ display: 'block', padding: '40px 0', textAlign: 'center' }} />
      </Modal>
    );
  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit} enableReinitialize={true}>
      {(f) => <CreatePlanForm {...f} id={id} />}
    </Formik>
  );
};
