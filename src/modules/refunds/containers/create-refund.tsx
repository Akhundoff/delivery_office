import { FC } from 'react';
import { Col, Form, Modal, Row, Select, Spin } from 'antd';
import { Formik, FormikProps } from 'formik';

import { TextField, SelectField, TextAreaField } from '@shared/modules/form';
import { useCloseModal } from '@shared/hooks';
import { useCargoes } from '@modules/cargoes/hooks';

import { IRefundFormValues } from '../interfaces';
import { useRefundForm } from '../hooks';

const CreateRefundForm: FC<FormikProps<IRefundFormValues> & { id?: string }> = ({ handleSubmit, isSubmitting, id }) => {
    const [closeModal] = useCloseModal();
    const cargoes = useCargoes();

    return (
        <Modal
            open={true}
            onOk={() => handleSubmit()}
            onCancel={() => closeModal('/refunds')}
            confirmLoading={isSubmitting}
            title={!id ? 'Yeni iadə' : 'İadəni düzəlt'}
            okText='Yadda saxla'
            cancelText='Ləğv et'
            width={700}
        >
            <Form layout='vertical' component='div' size='large'>
                <Row gutter={16}>
                    <Col span={12}>
                        <TextField name='userId' item={{ label: 'İstifadəçi ID' }} input={{ placeholder: 'İstifadəçi ID daxil edin...' }} />
                    </Col>
                    <Col span={12}>
                        <TextField name='trackCode' item={{ label: 'İzləmə kodu' }} input={{ placeholder: 'Track kodu daxil edin...' }} />
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <SelectField name='cargoId' item={{ label: 'Kargo firması' }} input={{ placeholder: 'Kargo seçin...', loading: cargoes.isLoading }}>
                            {(cargoes.data || []).map((c) => (
                                <Select.Option key={c.id} value={String(c.id)}>
                                    {c.name}
                                </Select.Option>
                            ))}
                        </SelectField>
                    </Col>
                    <Col span={12}>
                        <SelectField name='direction' item={{ label: 'İstiqamət' }} input={{ placeholder: 'İstiqamət seçin...' }}>
                            <Select.Option value='Azərbaycan'>Azərbaycan</Select.Option>
                            <Select.Option value='Türkiyə'>Türkiyə</Select.Option>
                        </SelectField>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <TextField name='refundNumber' item={{ label: 'İadə nömrəsi' }} input={{ placeholder: 'İadə nömrəsini daxil edin...' }} />
                    </Col>
                    <Col span={12}>
                        <TextField name='shopName' item={{ label: 'Mağaza' }} input={{ placeholder: 'Mağaza adını daxil edin...' }} />
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <TextField name='productTypeName' item={{ label: 'Məhsul tipi' }} input={{ placeholder: 'Məhsul tipini daxil edin...' }} />
                    </Col>
                    <Col span={12}>
                        <TextField name='quantity' item={{ label: 'Say' }} input={{ placeholder: '0' }} />
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <TextField name='price' item={{ label: 'Qiymət (TRY)' }} input={{ placeholder: '0.00' }} />
                    </Col>
                </Row>
                <TextAreaField name='description' item={{ label: 'Açıqlama' }} input={{ placeholder: 'Açıqlama daxil edin...' }} />
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
