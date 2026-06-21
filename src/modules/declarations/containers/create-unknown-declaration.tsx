import React, { FC, useCallback, useContext, useMemo } from 'react';
import { Button, Col, Form, Modal, Row, Select, Spin, Upload, message } from 'antd';
import * as Icons from '@ant-design/icons';
import { Formik, FormikProps, useField } from 'formik';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { TextField } from '@shared/modules/form/fields/text';
import { SelectField } from '@shared/modules/form/fields/select';
import { CheckboxField } from '@shared/modules/form/fields/checkbox';
import { filterOption } from '@shared/modules/antd/helpers/filter-option';
import { useCloseModal } from '@shared/hooks';
import { appendToFormData } from '@shared/utils';
import { SettingsContext } from '@modules/settings';
import { MeContext } from '@modules/me';
import { UnknownDeclarationsService } from '../services';
import { DeclarationsService } from '../services';
import { UsersService } from '@modules/users/services';

interface UnknownDeclarationFormValues {
  userId: string;
  globalTrackCode: string;
  countryId: string;
  productTypeId: string;
  quantity: string;
  weight: string;
  price: string;
  deliveryPrice: string;
  shop: string;
  description: string;
  isLiquid: boolean;
  file: File | null;
  wardrobeNumber: string;
}

const EMPTY_VALUES: UnknownDeclarationFormValues = {
  userId: '',
  globalTrackCode: '',
  countryId: '',
  productTypeId: '',
  quantity: '1',
  weight: '',
  price: '',
  deliveryPrice: '',
  shop: '',
  description: '',
  isLiquid: false,
  file: null,
  wardrobeNumber: '',
};

const FormFields: FC<FormikProps<UnknownDeclarationFormValues> & { id?: string; onCancel: () => void }> = ({ values, handleSubmit, isSubmitting, id, onCancel }) => {
  const settings = useContext(SettingsContext);
  const { can } = useContext(MeContext);
  const [fileField, , fileHelpers] = useField<File | null>('file');

  const users = useQuery(
    ['users-select-unknown'],
    async () => {
      const result = await UsersService.getUsers({ per_page: 1000 });
      if (result.status === 200) return result.data.data.map((u) => ({ id: u.id, name: `${u.firstname} ${u.lastname}` }));
      return [];
    },
    { staleTime: 5 * 60 * 1000 },
  );

  const productTypes = useQuery(
    ['declarations-product-types'],
    async () => {
      const result = await DeclarationsService.getProductTypes();
      if (result.status === 200) return result.data;
      return [];
    },
    { staleTime: 5 * 60 * 1000 },
  );

  const userOptions = useMemo(
    () =>
      (users.data || []).map((u) => (
        <Select.Option key={u.id} value={String(u.id)}>
          #{u.id} - {u.name}
        </Select.Option>
      )),
    [users.data],
  );

  const productTypeOptions = useMemo(
    () =>
      [...(productTypes.data || [])]
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((p) => (
          <Select.Option key={p.id} value={String(p.id)}>
            {p.name}
          </Select.Option>
        )),
    [productTypes.data],
  );

  const countryOptions = useMemo(
    () =>
      (settings.data?.countries || []).map((c) => (
        <Select.Option key={c.id} value={String(c.id)}>
          {c.name}
        </Select.Option>
      )),
    [settings.data],
  );

  return (
    <Modal
      open
      width={768}
      onCancel={onCancel}
      onOk={() => handleSubmit()}
      confirmLoading={isSubmitting}
      okText="Yadda saxla"
      cancelText="Ləğv et"
      title={id ? 'Naməlum bəyannamədə düzəliş et' : 'Yeni naməlum bəyannamə'}
    >
      <Form layout="vertical" component="div" size="large">
        <Row gutter={[24, 0]}>
          <Col xs={24} md={12}>
            <SelectField name="userId" item={{ label: 'Müştəri' }} input={{ placeholder: 'Müştəri seçin', showSearch: true, filterOption, loading: users.isLoading }}>
              {userOptions}
            </SelectField>
          </Col>
          <Col xs={24} md={12}>
            <TextField name="globalTrackCode" item={{ label: 'Q.İ kodu' }} input={{ placeholder: 'Q.İ kodunu daxil edin...' }} />
          </Col>
          <Col xs={24} md={12}>
            <SelectField name="countryId" item={{ label: 'Ölkə' }} input={{ placeholder: 'Ölkəni seçin' }}>
              {countryOptions}
            </SelectField>
          </Col>
          <Col xs={24} md={12}>
            <SelectField name="productTypeId" item={{ label: 'Məhsul növü' }} input={{ placeholder: 'Məhsul növü seçin', showSearch: true, filterOption }}>
              {productTypeOptions}
            </SelectField>
          </Col>
          <Col xs={24} md={8}>
            <TextField name="quantity" item={{ label: 'Miqdar' }} input={{ placeholder: '1', type: 'number' }} />
          </Col>
          <Col xs={24} md={8}>
            <TextField name="weight" item={{ label: 'Çəki (kq)' }} input={{ placeholder: '0.00', type: 'number', disabled: !can('changeweightdeclaration') }} />
          </Col>
          <Col xs={24} md={8}>
            <TextField name="price" item={{ label: 'Məhsulun qiyməti' }} input={{ placeholder: '0.00', type: 'number' }} />
          </Col>
          <Col xs={24} md={12}>
            <TextField name="deliveryPrice" item={{ label: 'Çatdırılma qiyməti ($)' }} input={{ placeholder: '0.00', type: 'number', disabled: !can('changedeliveryprice') }} />
          </Col>
          <Col xs={24} md={12}>
            <TextField name="shop" item={{ label: 'Mağaza' }} input={{ placeholder: 'Mağaza adını daxil edin...' }} />
          </Col>
          <Col xs={24} md={12}>
            <TextField name="wardrobeNumber" item={{ label: 'Şkaf nömrəsi' }} input={{ placeholder: 'Şkaf nömrəsini daxil edin...' }} />
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Sənəd">
              <Upload
                maxCount={1}
                beforeUpload={(file) => {
                  void fileHelpers.setValue(file);
                  return false;
                }}
                onRemove={() => {
                  void fileHelpers.setValue(null);
                }}
                fileList={fileField.value ? [{ uid: '-1', name: (fileField.value as File).name, status: 'done' as const }] : []}
              >
                <Button icon={<Icons.UploadOutlined />}>Yüklə</Button>
              </Upload>
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Row gutter={[16, 0]} style={{ paddingTop: 8 }}>
              <Col>
                <CheckboxField name="isLiquid" input={{ children: 'Maye' }} />
              </Col>
            </Row>
          </Col>
          <Col xs={24}>
            <Form.Item label="Açıqlama">
              <TextField name="description" input={{ placeholder: 'Açıqlamanı daxil edin' }} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export const CreateUnknownDeclaration: FC = () => {
  const { id } = useParams<{ id?: string }>();
  const [closeModal] = useCloseModal();
  const onCancel = useCallback(() => closeModal('/declarations/unknowns'), [closeModal]);

  const existing = useQuery(
    ['declarations', 'unknowns', id],
    async () => {
      const result = await UnknownDeclarationsService.getById(id!);
      if (result.status === 200) return result.data;
      throw new Error(result.data as string);
    },
    { enabled: !!id },
  );

  const initialValues = useMemo<UnknownDeclarationFormValues>(() => {
    if (id && existing.data) {
      const d = existing.data;
      return {
        userId: String(d.user?.id || ''),
        globalTrackCode: d.globalTrackCode || '',
        countryId: String(d.countryId || ''),
        productTypeId: String(d.productType?.id || ''),
        quantity: String(d.quantity || 1),
        weight: String(d.weight || ''),
        price: String(d.price || ''),
        deliveryPrice: String(d.deliveryPrice || ''),
        shop: d.shop || '',
        description: d.description || '',
        isLiquid: d.type === 'liquid',
        file: null,
        wardrobeNumber: d.wardrobeNumber || '',
      };
    }
    return EMPTY_VALUES;
  }, [id, existing.data]);

  const onSubmit = useCallback(
    async (values: UnknownDeclarationFormValues) => {
      const body = new FormData();
      appendToFormData(
        {
          user_id: values.userId,
          global_track_code: values.globalTrackCode,
          country_id: values.countryId,
          product_type_id: values.productTypeId,
          quantity: values.quantity,
          weight: values.weight,
          price: values.price,
          delivery_price: values.deliveryPrice,
          shop_name: values.shop,
          descr: values.description,
          type: values.isLiquid ? '1' : '2',
          wardrobe_number: values.wardrobeNumber,
        },
        body,
      );
      if (values.file) body.append('document_file', values.file);

      const result = id ? await UnknownDeclarationsService.update(id, body) : await UnknownDeclarationsService.create(body);

      if (result.status === 200) {
        message.success(id ? 'Dəyişikliklər saxlanıldı' : 'Naməlum bəyannamə yaradıldı');
        onCancel();
      } else {
        message.error(result.data?.message || 'Xəta baş verdi');
      }
    },
    [id, onCancel],
  );

  if (id && (existing.isLoading || !existing.data)) {
    return (
      <Modal open footer={null} closable={false}>
        <Spin style={{ display: 'block', padding: '40px 0', textAlign: 'center' }} />
      </Modal>
    );
  }

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit} enableReinitialize>
      {(props) => <FormFields {...props} id={id} onCancel={onCancel} />}
    </Formik>
  );
};
