import { FC } from 'react';
import { Card, Col, Form, Modal, Row, Spin, Typography } from 'antd';
import { Formik, FormikProps } from 'formik';
import { TextField } from '@shared/modules/form/fields/text';
import { useCloseModal } from '@shared/hooks';
import { IUnitedReturnFormValues } from '../interfaces';
import { useUnitedReturnForm } from '../hooks';

const CreateUnitedReturnForm: FC<FormikProps<IUnitedReturnFormValues> & { id?: string }> = ({ handleSubmit, isSubmitting, id }) => {
  const [closeModal] = useCloseModal();
  return (
    <Modal width={768} open={true} onOk={() => handleSubmit()} onCancel={() => closeModal('/united-returns')} confirmLoading={isSubmitting} title={!id ? 'İadə əlavə et' : 'İadədə düzəliş et'} okText="Yadda saxla" cancelText="Ləğv et">
      <Form layout="vertical" component="div" size="large">
        <Row gutter={[24, 0]}>
          <Col xs={24}>
            <TextField name="barcode" item={{ label: 'Barkod' }} input={{ placeholder: 'Bağlama trak kodunu daxil edin...' }} />
          </Col>
          <Col xs={24}>
            <TextField name="weight" item={{ label: 'Çəki' }} input={{ placeholder: 'Çəkini daxil edin...', suffix: 'kq' }} />
          </Col>
        </Row>
      </Form>
      <Card title="Qaydalar" bodyStyle={{ padding: '4px 24px' }} style={{ marginTop: 12, width: '100%', backgroundColor: '#eef4ff', borderRadius: 6 }}>
        <Typography.Paragraph style={{ fontSize: 14 }}>
          ✅&nbsp;&nbsp; Müştəri geri qaytarılma tələbi yaradarkən <Typography.Text strong>Temudan verilmiş barkodu</Typography.Text> təqdim etməlidir.
        </Typography.Paragraph>
        <Typography.Paragraph style={{ fontSize: 14 }}>
          ✅&nbsp;&nbsp; Qaytarılma yaradıldıqdan sonra <Typography.Text strong>etiket mütləq çap olunmalı</Typography.Text> və bağlamaya əlavə edilməlidir.
        </Typography.Paragraph>
      </Card>
    </Modal>
  );
};

export const CreateUnitedReturn: FC = () => {
  const { initialValues, onSubmit, id, isLoading } = useUnitedReturnForm();
  if (isLoading) {
    return (
      <Modal open={true} footer={null} closable={false}>
        <Spin style={{ display: 'block', padding: '40px 0', textAlign: 'center' }} />
      </Modal>
    );
  }
  return <Formik initialValues={initialValues} onSubmit={onSubmit} enableReinitialize={true}>{(f) => <CreateUnitedReturnForm {...f} id={id} />}</Formik>;
};
