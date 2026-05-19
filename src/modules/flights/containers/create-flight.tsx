import { FC, useMemo } from 'react';
import { Form, Modal, Select, Spin } from 'antd';
import { Formik, FormikProps } from 'formik';
import { useQuery } from 'react-query';
import { TextField } from '@shared/modules/form/fields/text';
import { DateField } from '@shared/modules/form/fields/date';
import { SelectField } from '@shared/modules/form/fields/select';
import { useCloseModal } from '@shared/hooks';
import { CountriesService } from '@modules/countries/services';
import { StatusesService } from '@modules/statuses/services';
import { CreateFlightDto } from '../interfaces';
import { useFlightForm } from '../hooks';

const CreateFlightForm: FC<FormikProps<CreateFlightDto> & { id?: string }> = ({ handleSubmit, isSubmitting, id }) => {
  const [closeModal] = useCloseModal();

  const { data: countriesResult } = useQuery(['countries-for-flight'], () => CountriesService.getList({ per_page: 500 }));
  const { data: statusesResult } = useQuery(['statuses-for-flight'], () => StatusesService.getList({ per_page: 500 }));

  const countryOptions = useMemo(
    () =>
      (countriesResult?.status === 200 ? countriesResult.data.data : []).map((c) => (
        <Select.Option key={c.id} value={c.id}>
          {c.name}
        </Select.Option>
      )),
    [countriesResult],
  );

  const statusOptions = useMemo(
    () =>
      (statusesResult?.status === 200 ? statusesResult.data.data : []).map((s) => (
        <Select.Option key={s.id} value={String(s.id)}>
          {s.name}
        </Select.Option>
      )),
    [statusesResult],
  );

  return (
    <Modal
      open={true}
      onOk={() => handleSubmit()}
      onCancel={() => closeModal('/flights')}
      confirmLoading={isSubmitting}
      title={id ? 'Uçuşu düzəlt' : 'Yeni uçuş'}
      okText='Yadda saxla'
      cancelText='Ləğv et'
      width={520}
    >
      <Form layout='vertical' component='div' size='large'>
        <TextField name='name' item={{ label: 'Ad' }} input={{ placeholder: 'Uçuşun adını daxil edin...' }} />
        <DateField name='startedAt' item={{ label: 'Başlama tarixi' }} />
        <DateField name='endedAt' item={{ label: 'Bitmə tarixi' }} />
        <SelectField name='countryId' item={{ label: 'Ölkə' }} input={{ placeholder: 'Ölkə seçin' }}>
          {countryOptions}
        </SelectField>
        <SelectField name='statusId' item={{ label: 'Status' }} input={{ placeholder: 'Status seçin' }}>
          {statusOptions}
        </SelectField>
      </Form>
    </Modal>
  );
};

export const CreateFlight: FC = () => {
  const { initialValues, onSubmit, id, isLoading } = useFlightForm();

  if (isLoading) {
    return (
      <Modal open={true} footer={null} closable={false}>
        <Spin style={{ display: 'block', padding: '40px 0', textAlign: 'center' }} />
      </Modal>
    );
  }

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit} enableReinitialize={true}>
      {(f) => <CreateFlightForm {...f} id={id} />}
    </Formik>
  );
};
