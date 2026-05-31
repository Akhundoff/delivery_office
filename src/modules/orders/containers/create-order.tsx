import React, { FC, useMemo } from 'react';
import { Col, Form, Modal, Row, Select, Spin } from 'antd';
import { Formik, FormikProps } from 'formik';

import { TextField } from '@shared/modules/form/fields/text';
import { SelectField } from '@shared/modules/form/fields/select';
import { CheckboxField } from '@shared/modules/form/fields/checkbox';
import { TextAreaField } from '@shared/modules/form/fields/textarea';
import { filterOption } from '@shared/modules/antd/helpers/filter-option';
import { useCloseModal } from '@shared/hooks';

import { ICreateOrderValues } from '../interfaces';
import { useCreateOrder } from '../hooks';
import { CountryIds, getCurrencySymbolByCountryId } from '../constants';

type FormFieldsProps = FormikProps<ICreateOrderValues> & {
  id?: string;
  users: { id: number; name: string }[];
  usersLoading: boolean;
  shopTypes: { id: number; name: string }[];
  shopTypesLoading: boolean;
};

const COUNTRY_OPTIONS = [
  { id: CountryIds.TURKIYE, name: 'Türkiyə' },
  { id: CountryIds.AMERICA, name: 'Amerika' },
  { id: CountryIds.CHINA, name: 'Çin' },
  { id: CountryIds.SPAIN, name: 'İspaniya' },
];

const OrderFormFields: FC<FormFieldsProps> = ({ values, handleSubmit, isSubmitting, id, users, usersLoading, shopTypes, shopTypesLoading }) => {
  const [closeModal] = useCloseModal();
  const currency = getCurrencySymbolByCountryId(values.countryId);

  const userOptions = useMemo(
    () =>
      users.map((u) => (
        <Select.Option key={u.id} value={String(u.id)}>
          #{u.id} - {u.name}
        </Select.Option>
      )),
    [users],
  );

  const shopTypeOptions = useMemo(
    () =>
      shopTypes.map((s) => (
        <Select.Option key={s.id} value={String(s.id)}>
          #{s.id} - {s.name}
        </Select.Option>
      )),
    [shopTypes],
  );

  return (
    <Modal
      width={768}
      open={true}
      onOk={() => handleSubmit()}
      onCancel={() => closeModal(id ? `/orders/${id}` : '/orders')}
      confirmLoading={isSubmitting}
      title={!id ? 'Yeni sifariş' : 'Sifarişdə düzəliş et'}
      okText='Yadda saxla'
      cancelText='Ləğv et'
    >
      <Form layout='vertical' component='div' size='large'>
        <Row gutter={[24, 0]}>
          <Col xs={24}>
            <SelectField name='countryId' item={{ label: 'Ölkə' }} input={{ placeholder: 'Ölkə seçin...' }}>
              {COUNTRY_OPTIONS.map((c) => (
                <Select.Option key={c.id} value={String(c.id)}>
                  {c.name}
                </Select.Option>
              ))}
            </SelectField>
          </Col>
          <Col xs={24} md={10}>
            <SelectField name='userId' item={{ label: 'İstifadəçi' }} input={{ placeholder: 'İstifadəçini seçin...', loading: usersLoading, showSearch: true, filterOption }}>
              {userOptions}
            </SelectField>
          </Col>
          <Col xs={24} md={14}>
            <TextField name='product.url' item={{ label: 'Məhsulun linki' }} input={{ placeholder: 'Məhsulun linkini daxil edin...' }} />
          </Col>
          <Col xs={24} md={12}>
            <SelectField name='product.typeId' item={{ label: 'Kateqoriya' }} input={{ placeholder: 'Məhsulun kateqoriyasını seçin...', loading: shopTypesLoading, showSearch: true, filterOption }}>
              {shopTypeOptions}
            </SelectField>
          </Col>
          <Col xs={24} md={12}>
            <TextField name='product.shop' item={{ label: 'Mağaza' }} input={{ placeholder: 'Mağaza adını daxil edin...' }} />
          </Col>
          <Col xs={24} md={6}>
            <TextField name='product.color' item={{ label: 'Rəng' }} input={{ placeholder: 'Məhsulun rəngini daxil edin...' }} />
          </Col>
          <Col xs={24} md={6}>
            <TextField name='product.size' item={{ label: 'Ölçü' }} input={{ placeholder: 'Məhsulun ölçüsünü daxil edin...' }} />
          </Col>
          <Col xs={24} md={6}>
            <TextField name='product.quantity' item={{ label: 'Miqdar' }} input={{ placeholder: 'Miqdarı daxil edin...', type: 'number', suffix: 'ədəd' }} />
          </Col>
          <Col xs={24} md={6}>
            <TextField name='product.price' item={{ label: 'Qiymət' }} input={{ placeholder: 'Qiyməti daxil edin...', type: 'number', suffix: currency }} />
          </Col>
          <Col xs={24} md={8}>
            <TextField
              name='product.internalShippingPrice'
              item={{ label: 'Daxili karqo qiyməti' }}
              input={{ placeholder: 'Daxili karqo qiymətini daxil edin...', type: 'number', suffix: currency }}
            />
          </Col>
          <Col xs={24} md={16}>
            <CheckboxField name='isUrgent' item={{ label: <>&nbsp;</> }} input={{ children: 'Təcilidir' }} />
          </Col>
          <Col xs={24}>
            <TextAreaField name='description' item={{ label: 'Açıqlama' }} input={{ placeholder: 'Açıqlamanı daxil edin...', rows: 3 }} />
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export const CreateOrder: FC = () => {
  const { id, isLoading, initialValues, onSubmit, users, usersLoading, shopTypes, shopTypesLoading } = useCreateOrder();

  if (isLoading) {
    return (
      <Modal open={true} footer={null} closable={false}>
        <Spin style={{ display: 'block', padding: '40px 0', textAlign: 'center' }} />
      </Modal>
    );
  }

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit} enableReinitialize={true}>
      {(formik) => <OrderFormFields {...formik} id={id} users={users} usersLoading={usersLoading} shopTypes={shopTypes} shopTypesLoading={shopTypesLoading} />}
    </Formik>
  );
};
