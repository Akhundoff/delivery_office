import { FC } from 'react';
import { Col, Form, Modal, Row, Select, Spin } from 'antd';
import { Formik, FormikProps } from 'formik';
import { useQuery } from 'react-query';

import { TextField } from '@shared/modules/form/fields/text';
import { TextAreaField } from '@shared/modules/form/fields/textarea';
import { CheckboxField } from '@shared/modules/form/fields/checkbox';
import { SelectField } from '@shared/modules/form/fields/select';
import { useCloseModal } from '@shared/hooks';
import { StatusesService } from '@modules/statuses/services';
import { useLimitedUsers } from '@modules/users/hooks';

import { IBranchFormValues } from '../interfaces';
import { useBranchForm, useBranches } from '../hooks';

const CreateBranchForm: FC<FormikProps<IBranchFormValues> & { id?: string }> = ({ handleSubmit, isSubmitting, id, values }) => {
  const [closeModal] = useCloseModal();
  const branches = useBranches();
  const users = useLimitedUsers();
  const { data: statusesResult } = useQuery(['statuses-for-branch-form', 40], () => StatusesService.getList({ per_page: 500, model_id: 40 }));
  const statuses = statusesResult?.status === 200 ? statusesResult.data.data : [];

  return (
    <Modal
      open={true}
      onOk={() => handleSubmit()}
      onCancel={() => closeModal('/branches')}
      confirmLoading={isSubmitting}
      title={!id ? 'Filial əlavə et' : 'Filialda düzəliş et'}
      okText="Yadda saxla"
      cancelText="Ləğv et"
      width={768}
    >
      <Form layout="vertical" component="div" size="large">
        <Row gutter={[24, 0]}>
          <Col xs={24}>
            <TextField name="name" item={{ label: 'Ad' }} input={{ placeholder: 'Yeşiyin adını daxil edin...' }} />
          </Col>
          <Col xs={24}>
            <SelectField name="parentId" item={{ label: 'Üst Filial' }} input={{ placeholder: 'Filial seçin...', disabled: values.isBranch }}>
              {branches.data?.map((b) => (
                <Select.Option key={b.id} value={b.id.toString()}>
                  {b.name}
                </Select.Option>
              ))}
            </SelectField>
          </Col>
          <Col xs={24} md={12}>
            <SelectField name="stateId" item={{ label: 'Status' }} input={{ placeholder: 'Status seçin...' }}>
              {statuses.map((s: any) => (
                <Select.Option key={s.id} value={s.id.toString()}>
                  {s.name}
                </Select.Option>
              ))}
            </SelectField>
          </Col>
          <Col xs={24} md={12}>
            <TextField name="workinghours" item={{ label: 'İş saatları' }} input={{ placeholder: 'İş saatlarını daxil edin...' }} />
          </Col>
          <Col xs={24}>
            <TextField name="mapAddress" item={{ label: 'Xəritə iframe source' }} input={{ placeholder: 'Xəritə iframe source daxil edin...' }} />
          </Col>
          <Col xs={24}>
            <TextField name="mapUrl" item={{ label: 'Xəritə ünvanı' }} input={{ placeholder: 'Xəritə ünvanı daxil edin...' }} />
          </Col>
          <Col xs={24} md={8}>
            <TextField name="phone" item={{ label: 'Telefon nömrəsi' }} input={{ placeholder: 'Nömrəni daxil edin...' }} />
          </Col>
          <Col xs={24} md={8}>
            <TextField name="email" item={{ label: 'Email' }} input={{ placeholder: 'Emaili daxil edin...' }} />
          </Col>
          <Col xs={24} md={8}>
            <SelectField name="warehouseMan" item={{ label: 'Anbardar' }} input={{ placeholder: 'Anbardar seçin...', loading: users.isLoading, disabled: users.isLoading }}>
              {users.data?.map((u: any) => (
                <Select.Option key={u.id} value={u.id.toString()}>
                  {u.firstname} {u.lastname}
                </Select.Option>
              ))}
            </SelectField>
          </Col>
          <Col xs={24}>
            <TextField name="address" item={{ label: 'Adress' }} input={{ placeholder: 'Adress daxil edin...' }} />
          </Col>
          <Col xs={24} md={8}>
            <TextField name="longitude" item={{ label: 'Longitude' }} input={{ placeholder: 'Longitude daxil edin...' }} />
          </Col>
          <Col xs={24} md={8}>
            <TextField name="latitude" item={{ label: 'Latitude' }} input={{ placeholder: 'Latitude daxil edin...' }} />
          </Col>
          <Col xs={24} md={8}>
            <TextField name="sortingLetter" item={{ label: 'Sorting Letter' }} input={{ placeholder: 'Sorting Letter daxil edin...' }} />
          </Col>
          <Col xs={24} md={6}>
            <TextField name="openHour" item={{ label: 'Açılış saatı' }} input={{ placeholder: '09:00' }} />
          </Col>
          <Col xs={24} md={6}>
            <TextField name="closeHour" item={{ label: 'Qapanış saatı' }} input={{ placeholder: '18:00' }} />
          </Col>
          <Col xs={24} md={6}>
            <TextField name="openHourSaturday" item={{ label: 'Açılış saatı (Şənbə)' }} input={{ placeholder: '09:00' }} />
          </Col>
          <Col xs={24} md={6}>
            <TextField name="closeHourSaturday" item={{ label: 'Qapanış saatı (Şənbə)' }} input={{ placeholder: '13:00' }} />
          </Col>
          <Col xs={24} md={8}>
            <TextField name="cityName" item={{ label: 'Şəhər' }} input={{ placeholder: 'Şəhəri daxil edin...' }} />
          </Col>
          <Col xs={24} md={8}>
            <TextField name="provinceName" item={{ label: 'Rayon' }} input={{ placeholder: 'Rayon daxil edin...' }} />
          </Col>
          <Col xs={24} md={8}>
            <TextField name="postCode" item={{ label: 'Poçt kodu' }} input={{ placeholder: 'Poçt kodu daxil edin...' }} />
          </Col>
          <Col xs={8} md={4}>
            <CheckboxField name="isBranch" item={{ label: ' ' }}>
              Filial
            </CheckboxField>
          </Col>
          <Col xs={8} md={6}>
            <CheckboxField name="isRegionBranch" item={{ label: ' ' }}>
              Region filialıdır?
            </CheckboxField>
          </Col>
          <Col xs={8} md={6}>
            <CheckboxField name="hide" item={{ label: ' ' }}>
              Saytda gizlədilsin?
            </CheckboxField>
          </Col>
          <Col xs={24}>
            <TextAreaField name="descr" item={{ label: 'Açıqlama' }} input={{ placeholder: 'Açıqlamanı daxil edin...' }} />
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export const CreateBranch: FC = () => {
  const { initialValues, onSubmit, id, isLoading } = useBranchForm();

  if (isLoading) {
    return (
      <Modal open={true} footer={null} closable={false}>
        <Spin style={{ display: 'block', padding: '40px 0', textAlign: 'center' }} />
      </Modal>
    );
  }

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit} enableReinitialize={true}>
      {(f) => <CreateBranchForm {...f} id={id} />}
    </Formik>
  );
};
