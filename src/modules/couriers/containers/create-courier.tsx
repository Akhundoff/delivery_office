import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Checkbox, Col, Form, Input, Modal, Row, Select, Typography, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { UsersService } from '@modules/users/services';
import { RegionsService } from '@modules/regions/services';
import { DeclarationsService } from '@modules/declarations/services';
import { CouriersService } from '../services';

export const CreateCourier: FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [userSearch, setUserSearch] = useState('');

  const selectedUserId = Form.useWatch('userId', form);
  const selectedRegionId = Form.useWatch('regionId', form);
  const selectedDeclarationIds: string[] = Form.useWatch('declarationIds', form) || [];

  const { data: existingResult, isLoading: existingLoading } = useQuery(['courier-edit', id], () => CouriersService.getById(id!), { enabled: !!id });
  const existing = existingResult?.status === 200 ? existingResult.data : undefined;

  useEffect(() => {
    if (existing) {
      form.setFieldsValue({
        userId: String(existing.user.id),
        regionId: existing.region.id ? String(existing.region.id) : null,
        recipient: existing.recipient,
        phoneNumber: existing.phoneNumber,
        declarationIds: existing.declarations.items.map((d) => String(d.id)),
        price: String(existing.price),
        courierPrice: String(existing.courierPrice),
        address: existing.address,
        paid: existing.paid,
        description: existing.description,
        postBranch: existing.postBranch || undefined,
        documentNumber: existing.documentNumber || undefined,
      });
    }
  }, [existing, form]);

  const { data: usersResult, isFetching: usersFetching } = useQuery(
    ['users-for-courier-create', userSearch],
    () => UsersService.getUsers({ page: 1, per_page: 20, ...(userSearch ? { search: userSearch } : {}) }),
    { keepPreviousData: true },
  );
  const users = usersResult?.status === 200 ? usersResult.data.data : [];

  const { data: regionsResult } = useQuery(['regions-for-courier'], () => RegionsService.getList({ per_page: 200 }));
  const regions = useMemo(() => (regionsResult?.status === 200 ? regionsResult.data.data : []), [regionsResult]);

  const selectedRegion = useMemo(() => regions.find((r) => r.id === Number(selectedRegionId)), [regions, selectedRegionId]);
  const isShipping = selectedRegion?.shipping === 1;

  const { data: declarationsResult, isFetching: declarationsFetching } = useQuery(
    ['declarations-for-courier', selectedUserId],
    () => DeclarationsService.getDeclarations({ user_id: selectedUserId, state_id: 9, per_page: 100 }),
    { enabled: !!selectedUserId },
  );
  const declarations = declarationsResult?.status === 200 ? declarationsResult.data.data : [];

  const { data: azerpostBranchesResult } = useQuery(['azerpost-branches', selectedRegionId], () => CouriersService.getAzerpostBranches(selectedRegionId!), {
    enabled: !!selectedRegionId && isShipping,
  });
  const azerpostBranches = azerpostBranchesResult?.status === 200 ? azerpostBranchesResult.data : [];

  const { data: courierCostResult } = useQuery(
    ['courier-cost', selectedDeclarationIds, selectedRegionId, isShipping],
    () => {
      const postBranch = form.getFieldValue('postBranch');
      if (selectedDeclarationIds.length && selectedRegionId) {
        if (isShipping && postBranch) {
          return CouriersService.getCourierCost(selectedDeclarationIds, selectedRegionId, 1, postBranch);
        } else if (!isShipping) {
          return CouriersService.getCourierCost(selectedDeclarationIds, selectedRegionId, 0);
        }
      }
      return Promise.resolve(null);
    },
    { enabled: !!(selectedDeclarationIds.length && selectedRegionId) },
  );
  const courierCost = courierCostResult?.status === 200 ? courierCostResult.data : null;

  useEffect(() => {
    if (isShipping) form.setFieldValue('paid', true);
  }, [isShipping, form]);

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
      id: id || undefined,
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
      postBranch: values.postBranch || undefined,
      documentNumber: values.documentNumber || undefined,
    });
    setSubmitting(false);
    if (result.status === 200) {
      message.success(id ? 'Kuryer yeniləndi.' : 'Kuryer yaradıldı.');
      navigate('/couriers');
    } else {
      message.error(result.data as string);
    }
  }, [form, id, navigate]);

  return (
    <Modal
      open
      title={id ? 'Kuryerdə düzəliş et' : 'Yeni kuryer'}
      onCancel={() => navigate('/couriers')}
      onOk={onOk}
      confirmLoading={submitting || existingLoading}
      okText="Saxla"
      cancelText="Ləğv et"
      width={768}
    >
      <Form form={form} layout="vertical" size="large">
        <Row gutter={[16, 0]}>
          <Col xs={24} md={12}>
            <Form.Item name="userId" label="İstifadəçi" rules={[{ required: true, message: 'İstifadəçi seçin' }]}>
              <Select showSearch filterOption={false} onSearch={setUserSearch} loading={usersFetching} placeholder="İstifadəçini axtarın...">
                {users.map((u) => (
                  <Select.Option key={u.id} value={String(u.id)}>
                    #{u.id} — {u.firstname} {u.lastname}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="regionId" label="Rayon">
              <Select placeholder="Rayonu seçin..." allowClear>
                {regions.map((r) => (
                  <Select.Option key={r.id} value={String(r.id)}>
                    #{r.id} — {r.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item name="declarationIds" label="Bağlamalar">
              <Select mode="multiple" loading={declarationsFetching} placeholder="Bağlamaları seçin..." disabled={!selectedUserId} filterOption={false}>
                {declarations.map((d) => (
                  <Select.Option key={d.id} value={String(d.id)}>
                    #{d.trackCode}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          {isShipping && (
            <>
              <Col xs={24} md={12}>
                <Form.Item name="postBranch" label="Filial">
                  <Select placeholder="Filial seçin..." allowClear>
                    {azerpostBranches.map((b) => (
                      <Select.Option key={b.id} value={String(b.id)}>
                        #{b.id} — {b.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name="documentNumber" label="Ş/V nömrəsi">
                  <Input placeholder="Ş/V nömrəsini daxil edin..." />
                </Form.Item>
              </Col>
            </>
          )}
          <Col xs={24} md={12}>
            <Form.Item name="courierPrice" label="Kuryer qiyməti">
              <Input placeholder="Kuryer qiymətini daxil edin..." />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="price" label="Qiymət (₺)">
              <Input placeholder="Qiyməti daxil edin..." />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item name="address" label="Ünvan">
              <Input placeholder="Ünvanı daxil edin..." />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="recipient" label="Qəbul edən">
              <Input placeholder="Adı daxil edin..." />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="phoneNumber" label="Telefon nömrəsi">
              <Input placeholder="Telefonu daxil edin..." />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name="paid" label=" " valuePropName="checked">
              <Checkbox disabled={isShipping}>Ödənilib</Checkbox>
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item name="description" label="Açıqlama">
              <Input.TextArea placeholder="Açıqlamanı daxil edin..." rows={3} />
            </Form.Item>
          </Col>
          {courierCost && (
            <Col xs={24}>
              <Typography.Text>Bu kuryer sifarişinin dəyəri: {isShipping ? courierCost.total_price : courierCost.region_price} AZN*</Typography.Text>
              <br />
              <Typography.Text>Bağlama(lar)ın ümumi çəkisi {courierCost.total_weight} kq-dır</Typography.Text>
            </Col>
          )}
        </Row>
      </Form>
    </Modal>
  );
};
