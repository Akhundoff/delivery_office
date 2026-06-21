import { FC } from 'react';
import { Button, Col, Form, Modal, Row, Select, Spin } from 'antd';
import { Formik, FormikProps } from 'formik';
import * as Icons from '@ant-design/icons';

import { TextField, SelectField, TextAreaField, UploadField } from '@shared/modules/form';
import { useCloseModal } from '@shared/hooks';
import { useCargoes } from '@modules/cargoes/hooks';
import { useLimitedUsers } from '@modules/users/hooks';

import { IRefundFormValues } from '../interfaces';
import { useRefundForm } from '../hooks';

const CreateRefundForm: FC<FormikProps<IRefundFormValues> & { id?: string }> = ({ handleSubmit, isSubmitting, id }) => {
  const [closeModal] = useCloseModal();
  const cargoes = useCargoes();
  const users = useLimitedUsers();

  return (
    <Modal
      open={true}
      onOk={() => handleSubmit()}
      onCancel={() => closeModal('/refunds')}
      confirmLoading={isSubmitting}
      title={!id ? 'İadə əlavə et' : 'İadədə düzəliş et'}
      okText="Yadda saxla"
      cancelText="Ləğv et"
      width={768}
    >
      <Form layout="vertical" component="div" size="large">
        <Row gutter={16}>
          <Col span={12}>
            <SelectField
              name="userId"
              item={{ label: 'İstifadəçi' }}
              input={{
                placeholder: 'İstifadəçini seçin...',
                loading: !users.data,
                showSearch: true,
                filterOption: (input: string, option: any) => (option?.children ?? '').toString().toLowerCase().startsWith(input.toLowerCase()),
              }}
            >
              {(users.data || []).map((u: any) => (
                <Select.Option key={u.id} value={String(u.id)}>
                  {u.fullName || u.name || `#${u.id}`}
                </Select.Option>
              ))}
            </SelectField>
          </Col>
          <Col span={12}>
            <TextField name="trackCode" item={{ label: 'Trak kod' }} input={{ placeholder: 'Bağlama trak kodunu daxil edin...' }} />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <SelectField
              name="cargoId"
              item={{ label: 'Kargo firması' }}
              input={{
                placeholder: 'Kargonu daxil edin...',
                showSearch: true,
                filterOption: (input: string, option: any) => (option?.children ?? '').toString().toLowerCase().startsWith(input.toLowerCase()),
              }}
            >
              {(cargoes.data || []).map((c) => (
                <Select.Option key={c.id} value={String(c.id)}>
                  {c.name}
                </Select.Option>
              ))}
            </SelectField>
          </Col>
          <Col span={12}>
            <SelectField name="direction" item={{ label: 'İstiqamət' }} input={{ placeholder: 'İstiqamət daxil edin...' }}>
              <Select.Option value="AZERBAIJAN">Azərbaycan</Select.Option>
              <Select.Option value="TURKIYE">Türkiyə</Select.Option>
            </SelectField>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <TextField name="refundNumber" item={{ label: 'İadə nömrəsi' }} input={{ placeholder: 'İadə nömrəsini daxil edin...' }} />
          </Col>
          <Col span={12}>
            <TextField name="productTypeName" item={{ label: 'Bağlama kateqoriyası' }} input={{ placeholder: 'Bağlama kateqoriyasını daxil edin...' }} />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <TextField name="shopName" item={{ label: 'Mağaza' }} input={{ placeholder: 'Mağazanı daxil edin...' }} />
          </Col>
          <Col span={12}>
            <TextField name="quantity" item={{ label: 'Say' }} input={{ placeholder: 'Say daxil edin...' }} />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <TextField name="price" item={{ label: 'Məhsulun dəyəri' }} input={{ placeholder: 'Məhsulun dəyərini daxil edin...' }} />
          </Col>
          <Col span={12}>
            <UploadField name="file" item={{ label: 'Sənəd yüklə' }} renderContent={() => <Button icon={<Icons.UploadOutlined />}>Sənəd yüklə</Button>} />
          </Col>
        </Row>
        <TextAreaField name="description" item={{ label: 'Şərh' }} input={{ placeholder: 'Şərhi daxil edin...' }} />
      </Form>
    </Modal>
  );
};

export const CreateRefund: FC = () => {
  const { initialValues, onSubmit, id, isLoading } = useRefundForm();

  if (isLoading) {
    return (
      <Modal open={true} footer={null} closable={false}>
        <Spin style={{ display: 'block', padding: '40px 0', textAlign: 'center' }} />
      </Modal>
    );
  }

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit} enableReinitialize={true}>
      {(f) => <CreateRefundForm {...f} id={id} />}
    </Formik>
  );
};
