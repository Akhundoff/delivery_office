import React, { FC } from 'react';
import { Row, Col, Button } from 'antd';
import { Form } from 'antd';
import { Formik, FormikProps } from 'formik';

import { TextField } from '@shared/modules/form/fields/text';
import { DateField } from '@shared/modules/form/fields/date';

import { CreateDiscountDto } from '../interfaces';
import { useCreateDiscount } from '../hooks';

const CreateDiscountForm: FC<FormikProps<CreateDiscountDto>> = ({ handleSubmit, isSubmitting }) => {
    return (
        <Form layout='vertical' component='div' size='large'>
            <Row gutter={[24, 0]}>
                <Col xs={24} md={12}>
                    <TextField name='discount' item={{ label: 'Endirim faizi' }} input={{ placeholder: 'Endirim faizini daxil edin...' }} />
                </Col>
                <Col xs={24} md={12}>
                    <DateField name='discountDate' item={{ label: 'Son endirim tarixi' }} />
                </Col>
                <Col xs={24} md={12}>
                    <TextField name='descr' item={{ label: 'Şərh' }} input={{ placeholder: 'Şərh daxil edin...' }} />
                </Col>
            </Row>
            <Button onClick={() => handleSubmit()} type='primary' style={{ width: '100%' }} block loading={isSubmitting}>
                Yarat
            </Button>
        </Form>
    );
};

export const CreateDiscount: FC = () => {
    const { initialValues, onSubmit } = useCreateDiscount();

    return <Formik initialValues={initialValues} onSubmit={onSubmit} enableReinitialize component={CreateDiscountForm} />;
};
