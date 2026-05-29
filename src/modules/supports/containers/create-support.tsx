import { FC, useMemo } from 'react';
import { Button, Col, Form, Modal, Row, Select } from 'antd';
import * as Icons from '@ant-design/icons';
import { Formik, FormikProps } from 'formik';
import { SelectField } from '@shared/modules/form/fields/select';
import { TextAreaField } from '@shared/modules/form/fields/textarea';
import { MultiUploadField } from '@shared/modules/form/fields/multi-upload';
import { useCloseModal } from '@shared/hooks';
import { ICreateSupportFormValues } from '../interfaces';
import { useCreateSupport, useSupportCategories, useSupportSelectUsers } from '../hooks';

const CreateSupportForm: FC<FormikProps<ICreateSupportFormValues>> = ({ submitForm, isSubmitting }) => {
  const [closeModal] = useCloseModal();
  const users = useSupportSelectUsers();
  const categories = useSupportCategories();

  const userOptions = useMemo(
    () =>
      (users.data || []).map((user) => (
        <Select.Option key={user.id} value={user.id.toString()}>
          #{user.id} - {user.firstname} {user.lastname}
        </Select.Option>
      )),
    [users.data],
  );

  const categoryOptions = useMemo(
    () =>
      (categories.data?.data || []).map((category) => (
        <Select.Option key={category.id} value={category.id.toString()}>
          {category.name}
        </Select.Option>
      )),
    [categories.data?.data],
  );

  return (
    <Modal width={576} open onOk={submitForm} onCancel={() => closeModal('/supports')} confirmLoading={isSubmitting} title="Yeni müraciət" okText="Yadda saxla" cancelText="Ləğv et">
      <Form layout="vertical" component="div" size="large">
        <Row gutter={[24, 0]}>
          <Col xs={24}>
            <SelectField name="userId" item={{ label: 'İstifadəçi' }} input={{ placeholder: 'İstifadəçini seçin...', showSearch: true, optionFilterProp: 'children', loading: users.isLoading }}>
              {userOptions}
            </SelectField>
          </Col>
          <Col xs={24}>
            <SelectField name="categoryId" item={{ label: 'Kateqoriya' }} input={{ placeholder: 'Müraciətin kateqoriyasını seçin...', loading: categories.isLoading }}>
              {categoryOptions}
            </SelectField>
          </Col>
          <Col xs={24}>
            <TextAreaField name="body" item={{ label: 'Mətn' }} input={{ placeholder: 'Mətni daxil edin...' }} />
          </Col>
          <Col xs={24}>
            <MultiUploadField name="files" item={{ label: 'Sənədlər' }}>
              <Button icon={<Icons.UploadOutlined />}>Sənədləri seçin</Button>
            </MultiUploadField>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export const CreateSupport: FC = () => {
  const { initialValues, onSubmit } = useCreateSupport();
  return <Formik initialValues={initialValues} onSubmit={onSubmit} enableReinitialize={true}>{(f) => <CreateSupportForm {...f} />}</Formik>;
};
