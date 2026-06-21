import { FC, useContext, useEffect, useMemo } from 'react';
import { Col, Form, Modal, Radio, Row, Select, Spin } from 'antd';
import { Formik, FormikProps } from 'formik';

import { TextField, SelectField, TextAreaField, DateField, RadioField, CheckboxField } from '@shared/modules/form';
import { useCloseModal } from '@shared/hooks';
import { useBranches } from '@modules/branches';
import { SettingsContext } from '@modules/settings';
import { RegionsService } from '@modules/regions';
import { useLimitedUsers } from '@modules/users';
import { useQuery } from 'react-query';

import { ICouponFormValues, CouponType, UserGender, PlatformType } from '../interfaces';
import { useCouponForm } from '../hooks';

const CreateCouponForm: FC<FormikProps<ICouponFormValues> & { id?: string }> = ({ handleSubmit, isSubmitting, values, setFieldValue, id }) => {
  const [closeModal] = useCloseModal();
  const settings = useContext(SettingsContext);
  const branches = useBranches();
  const limitedUsers = useLimitedUsers();

  const regionsQuery = useQuery(['regions', 'select', values.branchId], () =>
    RegionsService.getList(values.branchId ? { branch_id: values.branchId, per_page: 500 } : { per_page: 500 }).then((r) => (r.status === 200 ? r.data.data : [])),
  );

  useEffect(() => {
    if (String(values.couponType) !== String(CouponType.BALANCE)) {
      setFieldValue('currency', '');
    }
  }, [values.couponType, setFieldValue]);

  useEffect(() => {
    if (values.singleUse) setFieldValue('count', '1');
  }, [values.singleUse, setFieldValue]);

  const isCourierDiscount = String(values.couponType) === String(CouponType.COURIER_DISCOUNT);
  const isBalance = String(values.couponType) === String(CouponType.BALANCE);

  const branchOptions = useMemo(
    () =>
      branches.data?.map((b) => (
        <Select.Option key={b.id} value={String(b.id)}>
          {b.name}
        </Select.Option>
      )),
    [branches.data],
  );

  const regionOptions = useMemo(
    () =>
      regionsQuery.data?.map((r) => (
        <Select.Option key={r.id} value={String(r.id)}>
          {r.name}
        </Select.Option>
      )),
    [regionsQuery.data],
  );

  const countryOptions = useMemo(
    () =>
      settings?.data?.countries.map((c) => (
        <Select.Option key={c.id} value={String(c.id)}>
          {c.name}
        </Select.Option>
      )),
    [settings?.data?.countries],
  );

  const userOptions = useMemo(
    () =>
      limitedUsers.data?.map((u) => (
        <Select.Option key={u.id} value={String(u.id)}>
          {u.firstname} {u.lastname}
        </Select.Option>
      )),
    [limitedUsers.data],
  );

  return (
    <Modal
      open={true}
      onOk={() => handleSubmit()}
      onCancel={() => closeModal('/coupons')}
      confirmLoading={isSubmitting}
      title={!id ? 'Yeni kupon' : 'Kuponu düzəlt'}
      okText="Yadda saxla"
      cancelText="Ləğv et"
      width={768}
    >
      <Form layout="vertical" component="div" size="large">
        <Row gutter={16}>
          <Col span={12}>
            <TextField name="name" item={{ label: 'Ad' }} input={{ placeholder: 'Kuponun adını daxil edin...' }} />
          </Col>
          <Col span={12}>
            <TextField name="tag" item={{ label: 'Teq' }} input={{ placeholder: 'Kuponu etiketi daxil edin...' }} />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <SelectField name="couponType" item={{ label: 'Kupon tipi' }} input={{ placeholder: 'Kupon tipini seçin...' }}>
              <Select.Option value={String(CouponType.BALANCE)}>Balans artımı</Select.Option>
              <Select.Option value={String(CouponType.ORDER_SERVICE_PERCENT)}>Sifariş xidmətinə faiz</Select.Option>
              <Select.Option value={String(CouponType.DELIVERY_DISCOUNT)}>Çatdırılmaya endirim</Select.Option>
              <Select.Option value={String(CouponType.COURIER_DISCOUNT)}>Kuryerə endirim</Select.Option>
            </SelectField>
          </Col>
          <Col span={12}>
            <TextField name="amount" item={{ label: isBalance ? 'Məbləğ' : 'Endirim faizi' }} input={{ placeholder: '0' }} />
          </Col>
        </Row>
        {isBalance && (
          <Row gutter={16}>
            <Col span={12}>
              <SelectField name="currency" item={{ label: 'Valyuta' }} input={{ placeholder: 'Valyuta seçin...' }}>
                <Select.Option value="TRY">Türk lirəsi (TRY)</Select.Option>
                <Select.Option value="USD">ABŞ Dolları (USD)</Select.Option>
              </SelectField>
            </Col>
          </Row>
        )}
        {isCourierDiscount && (
          <Row gutter={16}>
            <Col span={12}>
              <SelectField name="branchId" item={{ label: 'Filial' }} input={{ placeholder: 'Filial seçin...' }}>
                {branchOptions}
              </SelectField>
            </Col>
            <Col span={12}>
              <SelectField name="regionId" item={{ label: 'Rayon' }} input={{ placeholder: 'Rayon seçin...' }}>
                {regionOptions}
              </SelectField>
            </Col>
          </Row>
        )}
        <Row gutter={16}>
          <Col span={12}>
            <DateField name="periodFrom" item={{ label: 'Başlama tarixi' }} input={{ placeholder: 'Başlama tarixi...', showTime: true, format: 'DD.MM.YYYY HH:mm' }} />
          </Col>
          <Col span={12}>
            <DateField name="periodTo" item={{ label: 'Bitmə tarixi' }} input={{ placeholder: 'Bitmə tarixi...', showTime: true, format: 'DD.MM.YYYY HH:mm' }} />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <DateField name="userRegisterFrom" item={{ label: 'Qeydiyyat tarixi (başlanğıc)' }} input={{ placeholder: 'Tarix seçin...', showTime: true, format: 'DD.MM.YYYY HH:mm' }} />
          </Col>
          <Col span={12}>
            <DateField name="userRegisterTo" item={{ label: 'Qeydiyyat tarixi (son)' }} input={{ placeholder: 'Tarix seçin...', showTime: true, format: 'DD.MM.YYYY HH:mm' }} />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <SelectField name="countryId" item={{ label: 'Ölkə' }} input={{ placeholder: 'Ölkə seçin...' }}>
              {countryOptions}
            </SelectField>
          </Col>
          <Col span={12}>
            <RadioField name="userGender" item={{ label: 'Cins' }}>
              <Radio value={String(UserGender.BOTH)}>Hər ikisi</Radio>
              <Radio value={String(UserGender.MALE)}>Kişi</Radio>
              <Radio value={String(UserGender.FEMALE)}>Qadın</Radio>
            </RadioField>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <RadioField name="platform" item={{ label: 'Platform' }}>
              <Radio value={PlatformType.EVERYWHERE}>Hər ikisi</Radio>
              <Radio value={PlatformType.MOBILE}>Mobil tətbiq</Radio>
              <Radio value={PlatformType.WEB}>Sayt</Radio>
            </RadioField>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <TextField name="count" item={{ label: 'İstifadə limiti' }} input={{ placeholder: '0', disabled: values.singleUse }} />
          </Col>
          <Col span={12}>
            <CheckboxField name="singleUse" input={{ children: 'Birdəfəlik istifadə' }} />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <TextField name="stateId" item={{ label: 'Status ID' }} input={{ placeholder: 'Status ID daxil edin...' }} />
          </Col>
          <Col span={12}>
            <SelectField name="userIds" item={{ label: 'Müştərilər' }} input={{ placeholder: 'Müştəriləri seçin...', mode: 'multiple', loading: limitedUsers.isLoading }}>
              {userOptions}
            </SelectField>
          </Col>
        </Row>
        <TextAreaField name="description" item={{ label: 'Açıqlama' }} input={{ placeholder: 'Açıqlama daxil edin...' }} />
      </Form>
    </Modal>
  );
};

export const CreateCoupon: FC = () => {
  const { initialValues, onSubmit, id, isLoading } = useCouponForm();

  if (isLoading) {
    return (
      <Modal open={true} footer={null} closable={false}>
        <Spin style={{ display: 'block', padding: '40px 0', textAlign: 'center' }} />
      </Modal>
    );
  }

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit} enableReinitialize={true}>
      {(f) => <CreateCouponForm {...f} id={id} />}
    </Formik>
  );
};
