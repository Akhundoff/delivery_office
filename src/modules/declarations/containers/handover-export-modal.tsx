import React, { FC, useCallback, useContext, useMemo } from 'react';
import { Col, Form, Modal, Row, Select, message } from 'antd';
import { Formik, FormikProps } from 'formik';
import dayjs, { Dayjs } from 'dayjs';
import { SelectField } from '@shared/modules/form/fields/select';
import { DateField } from '@shared/modules/form/fields/date';
import { useCloseModal } from '@shared/hooks';
import { useBranches } from '@modules/branches';
import { SettingsContext } from '@modules/settings';
import { DeclarationsService } from '../services';

interface HandoverExcelFormValues {
  branch_id: string[];
  country_id: string[];
  start_date: Dayjs | null;
  end_date: Dayjs | null;
}

const FormFields: FC<FormikProps<HandoverExcelFormValues> & { onCancel: () => void }> = ({ handleSubmit, isSubmitting, onCancel }) => {
  const branches = useBranches();
  const settings = useContext(SettingsContext);

  const branchOptions = useMemo(
    () =>
      (branches.data || []).map((b) => (
        <Select.Option key={b.id} value={b.id.toString()}>
          {b.name}
        </Select.Option>
      )),
    [branches.data],
  );

  const countryOptions = useMemo(
    () =>
      (settings.data?.countries || []).map((c) => (
        <Select.Option key={c.id} value={c.id.toString()}>
          {c.name}
        </Select.Option>
      )),
    [settings.data],
  );

  return (
    <Modal open width={768} onCancel={onCancel} onOk={() => handleSubmit()} confirmLoading={isSubmitting} okText="Yüklə" cancelText="Ləğv et" title="Təhvil Excel">
      <Form layout="vertical" component="div" size="large">
        <Row gutter={[24, 0]}>
          <Col span={24}>
            <SelectField name="branch_id" item={{ label: 'Filial' }} input={{ placeholder: 'Filial seçin...', loading: branches.isLoading, mode: 'multiple' }}>
              {branchOptions}
            </SelectField>
          </Col>
          <Col span={24}>
            <SelectField name="country_id" item={{ label: 'Ölkə' }} input={{ placeholder: 'Ölkə seçin...', mode: 'multiple' }}>
              {countryOptions}
            </SelectField>
          </Col>
          <Col span={24}>
            <DateField
              name="start_date"
              item={{ label: 'Başlanğıc təhvil verilmə' }}
              input={{ placeholder: 'Başlanğıc təhvil verilmə tarixini daxil edin...', showTime: true, format: 'DD.MM.YYYY HH:mm' }}
            />
          </Col>
          <Col span={24}>
            <DateField name="end_date" item={{ label: 'Son təhvil verilmə' }} input={{ placeholder: 'Son təhvil verilmə tarixini daxil edin...', showTime: true, format: 'DD.MM.YYYY HH:mm' }} />
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export const HandoverExportModal: FC = () => {
  const [closeModal] = useCloseModal();

  const onCancel = useCallback(() => closeModal('/declarations'), [closeModal]);

  const initialValues: HandoverExcelFormValues = useMemo(() => ({ branch_id: [], country_id: [], start_date: null, end_date: dayjs() }), []);

  const onSubmit = useCallback(async (values: HandoverExcelFormValues) => {
    const query: Record<string, any> = {
      branch_id: values.branch_id,
      country_id: values.country_id,
      end_date: values.end_date ? values.end_date.format('DD.MM.YYYY HH:mm') : '',
      start_date: values.start_date ? values.start_date.format('DD.MM.YYYY HH:mm') : '',
    };

    message.loading({ key: 'handover-export', content: 'Sənəd hazırlanır...', duration: 0 });
    const result = await DeclarationsService.getHandoverExcel(query);
    message.destroy('handover-export');

    if (result.status === 200) {
      message.success('Sənəd yüklənir');
      const a = document.createElement('a');
      a.href = URL.createObjectURL(result.data as Blob);
      a.download = `handover_export_${new Date().toISOString()}.xls`;
      a.click();
      a.remove();
    } else {
      message.error(result.data as string);
    }
  }, []);

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
      {(props) => <FormFields {...props} onCancel={onCancel} />}
    </Formik>
  );
};
