import React, { FC, useCallback, useEffect, useState } from 'react';
import { Checkbox, Col, Form, Input, Modal, Row, Select, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { UsersService } from '@modules/users/services';
import { RegionsService } from '@modules/regions/services';
import { DeclarationsService } from '@modules/declarations/services';
import { CouriersService } from '../services';

export const CreateCourier: FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [userSearch, setUserSearch] = useState('');

  const selectedUserId = Form.useWatch('userId', form);

  const { data: usersResult, isFetching: usersFetching } = useQuery(
    ['users-for-courier-create', userSearch],
    () => UsersService.getUsers({ page: 1, per_page: 20, ...(userSearch ? { search: userSearch } : {}) }),
    { keepPreviousData: true },
  );
  const users = usersResult?.status === 200 ? usersResult.data.data : [];

  const { data: regionsResult, isFetching: regionsFetching } = useQuery(['regions-for-courier'], () => RegionsService.getList({ per_page: 200 }));
  const regions = regionsResult?.status === 200 ? regionsResult.data.data : [];

  const { data: declarationsResult, isFetching: declarationsFetching } = useQuery(
    ['declarations-for-courier', selectedUserId],
    () => DeclarationsService.getDeclarations({ user_id: selectedUserId, state_id: 9, per_page: 100 }),
    { enabled: !!selectedUserId },
  );
  const declarations = declarationsResult?.status === 200 ? declarationsResult.data.data : [];

  useEffect(() => {
    form.setFieldValue('declarationIds', []);
  }, [selectedUserId, form]);

  const onOk = useCallback(async () => {
    try {
      await form.validateFields();
    } catch {
      return;
    }
    const values = form.getFieldsValue();
    setSubmitting(true);
    const result = await CouriersService.create({
      userId: values.userId,
      regionId: values.regionId || null,
      recipient: values.recipient || '',
      phoneNumber: values.phoneNumber || '',
      declarationIds: values.declarationIds || [],
      price: values.price || '0',
      courierPrice: values.courierPrice || '0',
      address: values.address || '',
      paid: !!values.paid,
      description: values.description || '',
    });
    setSubmitting(false);
    if (result.status === 200) {
      message.success('Kuryer yaradıldı.');
      navigate('/couriers');
    } else {
      message.error(result.data as string);
    }
  }, [form, navigate]);

  return (
    <Modal open title='Yeni kuryer' onCancel={() => navigate('/couriers')} onOk={onOk} confirmLoading={submitting} okText='Saxla' cancelText='Ləğv et' width={768}>
      <Form form={form} layout='vertical' size='large'>
        <Row gutter={[16, 0]}>
          <Col xs={24} md={12}>
            <Form.Item name='userId' label='İstifadəçi' rules={[{ required: true, message: 'İstifadəçi seçin' }]}>
              <Select showSearch filterOption={false} onSearch={setUserSearch} loading={usersFetching} placeholder='İstifadəçini axtarın...'>
                {users.map((u) => (
                  <Select.Option key={u.id} value={String(u.id)}>
                    #{u.id} — {u.firstname} {u.lastname}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name='regionId' label='Rayon'>
              <Select loading={regionsFetching} placeholder='Rayonu seçin...' allowClear>
                {regions.map((r) => (
                  <Select.Option key={r.id} value={String(r.id)}>
                    #{r.id} — {r.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item name='declarationIds' label='Bağlamalar'>
              <Select mode='multiple' loading={declarationsFetching} placeholder='Bağlamaları seçin...' disabled={!selectedUserId} filterOption={false}>
                {declarations.map((d) => (
                  <Select.Option key={d.id} value={String(d.id)}>
                    #{d.trackCode}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name='courierPrice' label='Kuryer qiyməti'>
              <Input placeholder='Kuryer qiymətini daxil edin...' />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name='price' label='Qiymət (₺)'>
              <Input placeholder='Qiyməti daxil edin...' />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item name='address' label='Ünvan'>
              <Input placeholder='Ünvanı daxil edin...' />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name='recipient' label='Qəbul edən'>
              <Input placeholder='Adı daxil edin...' />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name='phoneNumber' label='Telefon nömrəsi'>
              <Input placeholder='Telefonu daxil edin...' />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name='paid' label=' ' valuePropName='checked'>
              <Checkbox>Ödənilib</Checkbox>
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item name='description' label='Açıqlama'>
              <Input.TextArea placeholder='Açıqlamanı daxil edin...' rows={3} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
