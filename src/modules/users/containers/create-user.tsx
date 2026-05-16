import React, { FC, useMemo } from 'react';
import { Form, Modal, Row, Col, Radio, Select, Spin } from 'antd';
import { Formik, FormikProps } from 'formik';

import { TextField } from '@shared/modules/form/fields/text';
import { SelectField } from '@shared/modules/form/fields/select';
import { DateField } from '@shared/modules/form/fields/date';
import { CheckboxField } from '@shared/modules/form/fields/checkbox';
import { RadioField } from '@shared/modules/form/fields/radio';
import { useCloseModal } from '@shared/hooks';
import { useBranches } from '@modules/branches';

import { CreateUserDto } from '../interfaces';
import { useCreateUser } from '../hooks';

const CreateUserForm: FC<FormikProps<CreateUserDto> & { id?: string }> = ({ handleSubmit, isSubmitting, id }) => {
    const [closeModal] = useCloseModal();
    const branches = useBranches();

    const branchOptions = useMemo(
        () =>
            (branches.data || []).map((b) => (
                <Select.Option key={b.id} value={String(b.id)}>
                    #{b.id} - {b.name}
                </Select.Option>
            )),
        [branches.data],
    );

    return (
        <Modal
            width={768}
            open={true}
            onOk={() => handleSubmit()}
            onCancel={() => closeModal('/users')}
            confirmLoading={isSubmitting}
            title={!id ? 'Yeni istifadəçi' : 'İstifadəçidə düzəliş et'}
            okText='Yadda saxla'
            cancelText='Ləğv et'
        >
            <Form layout='vertical' component='div' size='large'>
                <Row gutter={[24, 0]}>
                    <Col xs={24} md={12}>
                        <TextField name='firstname' item={{ label: 'Ad' }} input={{ placeholder: 'Müştərinin adını daxil edin...' }} />
                    </Col>
                    <Col xs={24} md={12}>
                        <TextField name='lastname' item={{ label: 'Soyad' }} input={{ placeholder: 'Müştərinin soyadını daxil edin...' }} />
                    </Col>
                    <Col xs={24} md={8}>
                        <TextField name='email' item={{ label: 'Email' }} input={{ placeholder: 'Emaili daxil edin...' }} />
                    </Col>
                    <Col xs={24} md={8}>
                        <TextField name='phoneNumber' item={{ label: 'Telefon nömrəsi' }} input={{ placeholder: 'Telefon nömrəsini daxil edin...' }} />
                    </Col>
                    <Col xs={24} md={8}>
                        <RadioField name='gender' item={{ label: 'Cinsi' }}>
                            <Radio value='male'>Kişi</Radio>
                            <Radio value='female'>Qadın</Radio>
                        </RadioField>
                    </Col>
                    <Col xs={24} md={12}>
                        <TextField name='address' item={{ label: 'Ünvan' }} input={{ placeholder: 'Ünvanı daxil edin...' }} />
                    </Col>
                    <Col xs={24} md={12}>
                        <SelectField name='branchId' item={{ label: 'Təhvil məntəqəsi' }} input={{ placeholder: 'Filialı seçin', loading: branches.isLoading }}>
                            {branchOptions}
                        </SelectField>
                    </Col>
                    <Col xs={24} md={8}>
                        <DateField name='birthDate' item={{ label: 'Təvəllüd' }} input={{ placeholder: 'Təvəllüdü daxil edin...' }} />
                    </Col>
                    <Col xs={24} md={8}>
                        <TextField name='passport.number' item={{ label: 'Ş.V nömrəsi' }} input={{ placeholder: 'Ş.V nömrəsini daxil edin...' }} />
                    </Col>
                    <Col xs={24} md={8}>
                        <TextField name='passport.secret' item={{ label: 'FİN kod' }} input={{ placeholder: 'FİN kodu daxil edin...' }} />
                    </Col>
                    <Col xs={24} md={12}>
                        <TextField name='password' item={{ label: 'Şifrə' }} input={{ placeholder: 'Yeni şifrəni daxil edin...', type: 'password' }} />
                    </Col>
                    <Col xs={24} md={12}>
                        <TextField name='passwordConfirmation' item={{ label: 'Təkrar şifrə' }} input={{ placeholder: 'Yeni şifrəni təkrar daxil edin...', type: 'password' }} />
                    </Col>
                    <Col xs={24} md={6}>
                        <CheckboxField name='sendEmail' input={{ children: 'Email bildirişləri' }} />
                    </Col>
                    <Col xs={24} md={6}>
                        <CheckboxField name='sendSms' input={{ children: 'SMS bildirişləri' }} />
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export const CreateUser: FC = () => {
    const { initialValues, onSubmit, id, isLoading } = useCreateUser();

    if (isLoading) {
        return (
            <Modal open={true} footer={null} closable={false}>
                <Spin style={{ display: 'block', padding: '40px 0', textAlign: 'center' }} />
            </Modal>
        );
    }

    return (
        <Formik initialValues={initialValues} onSubmit={onSubmit} enableReinitialize={true}>
            {(formik) => <CreateUserForm {...formik} id={id} />}
        </Formik>
    );
};
