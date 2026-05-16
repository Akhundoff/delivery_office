import React, { FC, useContext, useMemo } from 'react';
import { Col, Form, Input, Modal, Row, Select, Spin, Upload, Button } from 'antd';
import * as Icons from '@ant-design/icons';
import { Formik, FormikProps, useField } from 'formik';

import { TextField } from '@shared/modules/form/fields/text';
import { SelectField } from '@shared/modules/form/fields/select';
import { CheckboxField } from '@shared/modules/form/fields/checkbox';
import { filterOption } from '@shared/modules/antd/helpers/filter-option';
import { useCloseModal } from '@shared/hooks';
import { SettingsContext } from '@modules/settings';
import { useBranches } from '@modules/branches';

import { IDeclarationFormValues } from '../interfaces';
import { useDeclarationForm } from '../hooks';

type FormFieldsProps = FormikProps<IDeclarationFormValues> & {
    id?: string;
    productTypes: { id: number; name: string }[];
    planCategories: { id: number; name: string }[];
    users: { id: number; name: string }[];
};

const DeclarationFormFields: FC<FormFieldsProps> = ({ values, setFieldValue, handleSubmit, isSubmitting, id, productTypes, planCategories, users }) => {
    const [closeModal] = useCloseModal();
    const settings = useContext(SettingsContext);
    const branches = useBranches();
    const [fileField, , fileHelpers] = useField<File | null>('file');

    const userOptions = useMemo(
        () => users.map((u) => <Select.Option key={u.id} value={String(u.id)}>#{u.id} - {u.name}</Select.Option>),
        [users],
    );

    const productTypeOptions = useMemo(
        () => [...productTypes].sort((a, b) => a.name.localeCompare(b.name)).map((p) => <Select.Option key={p.id} value={String(p.id)}>{p.name}</Select.Option>),
        [productTypes],
    );

    const planCategoryOptions = useMemo(
        () => planCategories.map((p) => <Select.Option key={p.id} value={String(p.id)}>{p.name}</Select.Option>),
        [planCategories],
    );

    const countryOptions = useMemo(
        () => (settings.data?.countries || []).map((c) => <Select.Option key={c.id} value={String(c.id)}>{c.name}</Select.Option>),
        [settings.data],
    );

    const branchOptions = useMemo(
        () => (branches.data || []).map((b) => <Select.Option key={b.id} value={String(b.id)}>#{b.id} - {b.name}</Select.Option>),
        [branches.data],
    );

    return (
        <Modal
            width={768}
            open={true}
            onOk={() => handleSubmit()}
            onCancel={() => closeModal('/declarations')}
            confirmLoading={isSubmitting}
            title={!id ? 'Yeni bəyannamə' : 'Bəyannamədə düzəliş et'}
            okText='Yadda saxla'
            cancelText='Ləğv et'
        >
            <Form layout='vertical' component='div' size='large'>
                <Row gutter={[24, 0]}>
                    <Col xs={24} md={12}>
                        <TextField name='globalTrackCode' item={{ label: 'Q.İ kodu' }} input={{ placeholder: 'Q.İ kodunu daxil edin...', autoFocus: true, autoComplete: 'off' }} />
                    </Col>
                    <Col xs={24} md={12}>
                        <SelectField name='userId' item={{ label: 'Müştəri' }} input={{ placeholder: 'Müştəri seçin', showSearch: true, filterOption }}>
                            {userOptions}
                        </SelectField>
                    </Col>
                    <Col xs={24} md={12}>
                        <SelectField name='countryId' item={{ label: 'Ölkə' }} input={{ placeholder: 'Ölkəni seçin' }}>
                            {countryOptions}
                        </SelectField>
                    </Col>
                    <Col xs={24} md={12}>
                        <SelectField name='branchId' item={{ label: 'Filial' }} input={{ placeholder: 'Filialı seçin', loading: branches.isLoading, showSearch: true, filterOption }}>
                            {branchOptions}
                        </SelectField>
                    </Col>
                    <Col xs={24} md={12}>
                        <SelectField name='productTypeId' item={{ label: 'Məhsul növü' }} input={{ placeholder: 'Məhsul növü seçin', showSearch: true, filterOption }}>
                            {productTypeOptions}
                        </SelectField>
                    </Col>
                    <Col xs={24} md={12}>
                        <TextField name='shop' item={{ label: 'Mağaza' }} input={{ placeholder: 'Mağaza adını daxil edin...' }} />
                    </Col>
                    <Col xs={24} md={8}>
                        <TextField name='quantity' item={{ label: 'Miqdar' }} input={{ placeholder: '1', type: 'number' }} />
                    </Col>
                    <Col xs={24} md={8}>
                        <TextField name='weight' item={{ label: 'Çəki (kq)' }} input={{ placeholder: '0.00', type: 'number' }} />
                    </Col>
                    <Col xs={24} md={8}>
                        <TextField name='price' item={{ label: 'Məhsulun qiyməti' }} input={{ placeholder: '0.00', type: 'number' }} />
                    </Col>
                    <Col xs={24} md={12}>
                        <TextField name='deliveryPrice' item={{ label: 'Çatdırılma qiyməti ($)' }} input={{ placeholder: '0.00', type: 'number' }} />
                    </Col>
                    <Col xs={24} md={12}>
                        <TextField name='wardrobeNumber' item={{ label: 'Çarpayı nömrəsi' }} input={{ placeholder: 'Çarpayı nömrəsini daxil edin...' }} />
                    </Col>
                    <Col xs={24} md={12}>
                        <TextField name='voen' item={{ label: 'VÖEN' }} input={{ placeholder: 'VÖEN daxil edin...' }} />
                    </Col>
                    {!!id && (
                        <Col xs={24} md={12}>
                            <TextField name='boxId' item={{ label: 'Qutu ID' }} input={{ placeholder: 'Qutu ID daxil edin...' }} />
                        </Col>
                    )}
                    <Col xs={24} md={6}>
                        <Form.Item label='Sənəd'>
                            <Upload
                                maxCount={1}
                                beforeUpload={(file) => { void fileHelpers.setValue(file); return false; }}
                                onRemove={() => { void fileHelpers.setValue(null); }}
                                fileList={fileField.value ? [{ uid: '-1', name: (fileField.value as File).name, status: 'done' as const }] : []}
                            >
                                <Button icon={<Icons.UploadOutlined />}>Yüklə</Button>
                            </Upload>
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={18}>
                        <Row gutter={[16, 0]} style={{ paddingTop: 30 }}>
                            <Col><CheckboxField name='isLiquid' input={{ children: 'Maye' }} /></Col>
                            <Col><CheckboxField name='isCommercial' input={{ children: 'Kommersial' }} /></Col>
                            <Col><CheckboxField name='isSpecial' input={{ children: 'Xüsusi tarif' }} /></Col>
                        </Row>
                    </Col>
                    {values.isSpecial && (
                        <Col xs={24} md={12}>
                            <SelectField name='planTypeId' item={{ label: 'Tarif kateqoriyası' }} input={{ placeholder: 'Tarif kateqoriyası seçin' }}>
                                {planCategoryOptions}
                            </SelectField>
                        </Col>
                    )}
                    <Col xs={24}>
                        <Form.Item label='Qeyd'>
                            <Input.TextArea
                                placeholder='Qeyd daxil edin...'
                                rows={3}
                                value={values.description}
                                onChange={(e) => setFieldValue('description', e.target.value)}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export const CreateDeclaration: FC = () => {
    const { initialValues, onSubmit, id, isLoading, productTypes, planCategories, users } = useDeclarationForm();
    const [closeModal] = useCloseModal();

    if (isLoading) {
        return (
            <Modal open={true} footer={null} closable={false}>
                <Spin style={{ display: 'block', padding: '40px 0', textAlign: 'center' }} />
            </Modal>
        );
    }

    return (
        <Formik initialValues={initialValues} onSubmit={onSubmit} enableReinitialize={true}>
            {(formik) => <DeclarationFormFields {...formik} id={id} productTypes={productTypes} planCategories={planCategories} users={users} />}
        </Formik>
    );
};
