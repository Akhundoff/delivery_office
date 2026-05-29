import { FC } from 'react';
import { Col, Form, Modal, Row, Select } from 'antd';
import { Formik, FormikProps } from 'formik';
import { SelectField } from '@shared/modules/form/fields/select';
import { TextAreaField } from '@shared/modules/form/fields/textarea';
import { DateField } from '@shared/modules/form/fields/date';
import { useCloseModal } from '@shared/hooks';
import { Constants } from '@shared/constants';
import { useBranches } from '@modules/branches';
import { ICreateInspectionFormValues } from '../interfaces';
import { useCreateInspection } from '../hooks';

const CreateInspectionForm: FC<FormikProps<ICreateInspectionFormValues>> = ({ handleSubmit, isSubmitting }) => {
  const [closeModal] = useCloseModal();
  const branches = useBranches();

  return (
    <Modal width={600} open={true} onOk={() => handleSubmit()} onCancel={() => closeModal('/branch-inspections')} confirmLoading={isSubmitting} title="Yeni Filial Yoxlanışı" okText="Yarat" cancelText="Ləğv et">
      <Form layout="vertical" component="div" size="large">
        <Row gutter={[24, 0]}>
          <Col xs={24}>
            <SelectField name="branchId" item={{ label: 'Filial', required: true }} input={{ placeholder: 'Filial seçin...', showSearch: true, optionFilterProp: 'children' }}>
              {branches.data?.map((branch) => (
                <Select.Option key={branch.id} value={branch.id.toString()}>
                  {branch.name}
                </Select.Option>
              ))}
            </SelectField>
          </Col>
          <Col xs={24}>
            <DateField name="deadline" item={{ label: 'Son tarix' }} input={{ placeholder: 'Son tarix seçin...', format: Constants.DATE_TIME, showTime: true }} />
          </Col>
          <Col xs={24}>
            <TextAreaField name="note" item={{ label: 'Qeyd' }} input={{ placeholder: 'Qeyd daxil edin...', rows: 4 }} />
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export const CreateInspection: FC = () => {
  const { initialValues, onSubmit } = useCreateInspection();
  return <Formik initialValues={initialValues} onSubmit={onSubmit} enableReinitialize={true}>{(f) => <CreateInspectionForm {...f} />}</Formik>;
};
