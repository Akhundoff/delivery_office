import React, { FC } from 'react';
import { Form, Modal } from 'antd';
import { Formik, FormikProps } from 'formik';

import { TextAreaField } from '@shared/modules/form/fields/textarea';

import { IRejectOrdersValues } from '../interfaces';
import { useRejectOrders } from '../hooks';

const RejectFormFields: FC<FormikProps<IRejectOrdersValues> & { isBulk: boolean; onClose: () => void }> = ({ handleSubmit, isSubmitting, isBulk, onClose }) => (
  <Modal
    width={576}
    open={true}
    onCancel={onClose}
    onOk={() => handleSubmit()}
    confirmLoading={isSubmitting}
    title={isBulk ? 'Toplu sifariş ləğv et' : 'Sifarişləri ləğv et'}
    okText='Ləğv et'
    cancelText='İmtina'
  >
    <Form layout='vertical' component='div' size='large'>
      <TextAreaField name='description' item={{ label: 'Ləğv edilmə səbəbi' }} input={{ placeholder: 'Sifarişin ləğv edilmə səbəbini qeyd edin...', rows: 4 }} />
    </Form>
  </Modal>
);

export const RejectOrders: FC = () => {
  const { initialValues, onSubmit, onClose, isBulk } = useRejectOrders();

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
      {(formik) => <RejectFormFields {...formik} isBulk={isBulk} onClose={onClose} />}
    </Formik>
  );
};
