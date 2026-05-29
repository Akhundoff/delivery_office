import { FC } from 'react';
import { Form, Modal, Spin } from 'antd';
import { Formik, FormikProps } from 'formik';
import { TextField } from '@shared/modules/form/fields/text';
import { useCloseModal } from '@shared/hooks';
import { IPartnerBoxFormValues } from '../interfaces';
import { usePartnerBoxForm } from '../hooks';

const CreatePartnerBoxForm: FC<FormikProps<IPartnerBoxFormValues> & { id?: string }> = ({ handleSubmit, isSubmitting, id }) => {
  const [closeModal] = useCloseModal();
  return (
    <Modal open={true} onOk={() => handleSubmit()} onCancel={() => closeModal('/partner-boxes')} confirmLoading={isSubmitting} title={!id ? 'Yeşik əlavə et' : 'Yeşikdə düzəliş et'} okText='Yadda saxla' cancelText='Ləğv et'>
      <Form layout='vertical' component='div' size='large'>
        <TextField name='name' item={{ label: 'Ad' }} input={{ placeholder: 'Yeşiyin adını daxil edin...' }} />
      </Form>
    </Modal>
  );
};

export const CreatePartnerBox: FC = () => {
  const { initialValues, onSubmit, id, isLoading } = usePartnerBoxForm();
  if (isLoading) return <Modal open={true} footer={null} closable={false}><Spin style={{ display: 'block', padding: '40px 0', textAlign: 'center' }} /></Modal>;
  return <Formik initialValues={initialValues} onSubmit={onSubmit} enableReinitialize={true}>{(f) => <CreatePartnerBoxForm {...f} id={id} />}</Formik>;
};
