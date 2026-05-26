import { FC } from 'react';
import { Form, Modal, Select, Spin } from 'antd';
import { Formik, FormikProps } from 'formik';

import { TextField, SelectField, TextAreaField } from '@shared/modules/form';
import { useCloseModal } from '@shared/hooks';
import { useModels } from '@modules/models/hooks';

import { IStatusFormValues } from '../interfaces';
import { useStatusForm, useStatuses } from '../hooks';

const CreateStatusForm: FC<FormikProps<IStatusFormValues> & { id?: string }> = ({ handleSubmit, isSubmitting, id }) => {
    const [closeModal] = useCloseModal();
    const models = useModels();
    const statuses = useStatuses();

    return (
        <Modal
            open={true}
            onOk={() => handleSubmit()}
            onCancel={() => closeModal('/status')}
            confirmLoading={isSubmitting}
            title={!id ? 'Yeni status' : 'Statusu düzəlt'}
            okText='Yadda saxla'
            cancelText='Ləğv et'
            width={600}
        >
            <Form layout='vertical' component='div' size='large'>
                <TextField name='name' item={{ label: 'Ad (AZ)' }} input={{ placeholder: 'Azərbaycanca adı daxil edin...' }} />
                <TextField name='nameEn' item={{ label: 'Ad (EN)' }} input={{ placeholder: 'İngilis dilində adı daxil edin...' }} />
                <SelectField name='modelId' item={{ label: 'Model' }} input={{ placeholder: 'Model seçin...', loading: models.isLoading }}>
                    {(models.data || []).map((m) => (
                        <Select.Option key={m.id} value={String(m.id)}>
                            #{m.id} — {m.name}
                        </Select.Option>
                    ))}
                </SelectField>
                <SelectField name='parentId' item={{ label: 'Valideyn statusu' }} input={{ placeholder: 'Valideyn statusu seçin...', loading: statuses.isLoading }}>
                    {(statuses.data || []).map((s) => (
                        <Select.Option key={s.id} value={String(s.id)}>
                            #{s.id} — {s.name}
                        </Select.Option>
                    ))}
                </SelectField>
                <TextAreaField name='description' item={{ label: 'Açıqlama' }} input={{ placeholder: 'Açıqlama daxil edin...' }} />
            </Form>
        </Modal>
    );
};

export const CreateStatus: FC = () => {
    const { initialValues, onSubmit, id, isLoading } = useStatusForm();

    if (isLoading) {
        return (
            <Modal open={true} footer={null} closable={false}>
                <Spin style={{ display: 'block', padding: '40px 0', textAlign: 'center' }} />
            </Modal>
        );
    }

    return (
        <Formik initialValues={initialValues} onSubmit={onSubmit} enableReinitialize={true}>
            {(f) => <CreateStatusForm {...f} id={id} />}
        </Formik>
    );
};
