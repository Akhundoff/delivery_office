import { FC, useCallback } from 'react';
import { Formik, FormikProps, FieldArray } from 'formik';
import { Button, Col, Descriptions, Radio, Row, Select, Space, Table, message } from 'antd';
import { NavLink, useNavigate } from 'react-router-dom';
import * as Icons from '@ant-design/icons';
import { RadioField } from '@shared/modules/form/fields/radio';
import { SelectField } from '@shared/modules/form/fields/select';
import { DateField } from '@shared/modules/form/fields/date';
import { TextField } from '@shared/modules/form/fields/text';
import { PageContent } from '@shared/styled/page-content';
import { useBranches } from '@modules/branches';
import { useTinyFlights } from '@modules/flights';
import { useLimitedUsers } from '@modules/users/hooks';
import { ISendBulkEmailNotificationDto } from '../interfaces';
import { BulkEmailNotificationService } from '../services';
import { useSendBulkEmailNotification } from '../hooks';

const initialValues: ISendBulkEmailNotificationDto = {
  type: 'allUsers',
  templateId: '',
  flightId: '',
  user: { ids: [], monthlyLimit: '', emails: [''] },
  declarationStatusIds: [],
  branchIds: [],
  countryIds: [],
  orderStatusIds: [],
  courierStatusIds: [],
  customsStatusId: '',
  customsDeclarationStatusId: '',
  plannedAt: '',
};

const FormikComponent: FC<FormikProps<ISendBulkEmailNotificationDto>> = ({ values, submitForm, isSubmitting }) => {
  const navigate = useNavigate();
  const branches = useBranches();
  const flights = useTinyFlights();
  const limitedUsers = useLimitedUsers(values.type === 'userIds');
  const { templates, templatesLoading, orderStatuses, orderStatusesLoading, declarationStatuses, declarationStatusesLoading, courierStatuses, courierStatusesLoading, users, usersLoading } =
    useSendBulkEmailNotification(values);

  const title = (
    <Space>
      <Icons.LeftCircleOutlined onClick={() => navigate(-1)} style={{ cursor: 'pointer' }} />
      <span>Toplu email göndər</span>
    </Space>
  );

  return (
    <PageContent title={title}>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Göndəriş tipi</div>
            <RadioField name="type">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <Radio value="allUsers">Bütün müştərilərə</Radio>
                <Radio value="userIds">Müştəri adlarına görə</Radio>
                <Radio value="userBirthday">Doğum günü olan müştərilər</Radio>
                <Radio value="userEmails">Müştərinin emaillərinə görə</Radio>
                <Radio value="declarationStatus">Bağlama statusuna görə</Radio>
                <Radio value="orderStatus">Sifariş statusuna görə</Radio>
                <Radio value="courierStatus">Kuryer statusuna görə</Radio>
                <Radio value="customsStatus">Bəyan statusuna görə</Radio>
                <Radio value="userMonthlyLimit">Cari ay limitinə görə</Radio>
                <Radio value="flightId">Uçuşa görə</Radio>
              </div>
            </RadioField>
          </div>

          {values.type === 'userIds' && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>Müştərilər</div>
              <SelectField name="user.ids" input={{ placeholder: 'Müştəriləri seçin...', mode: 'multiple', disabled: limitedUsers.isLoading, loading: limitedUsers.isLoading }}>
                {limitedUsers.data?.map((u) => (
                  <Select.Option key={u.id} value={u.id.toString()}>
                    #{u.id} - {u.firstname} {u.lastname}
                  </Select.Option>
                ))}
              </SelectField>
            </div>
          )}

          {values.type === 'userEmails' && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>Email-lər</div>
              <FieldArray name="user.emails">
                {({ push, remove }) => (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {values.user.emails.map((_, index) => (
                      <TextField
                        key={index}
                        name={`user.emails.${index}`}
                        input={{
                          addonAfter: index + 1 !== values.user.emails.length ? <Icons.DeleteOutlined onClick={() => remove(index)} /> : <Icons.PlusOutlined onClick={() => push('')} />,
                          placeholder: 'Email daxil edin...',
                        }}
                      />
                    ))}
                  </div>
                )}
              </FieldArray>
            </div>
          )}

          {values.type === 'declarationStatus' && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>Bağlama statusu</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <SelectField
                  name="declarationStatusIds"
                  input={{
                    placeholder: 'Bağlama statusunu seçin...',
                    mode: 'multiple',
                    disabled: declarationStatusesLoading,
                    loading: declarationStatusesLoading,
                  }}
                >
                  {declarationStatuses.map((s) => (
                    <Select.Option key={s.id} value={s.id.toString()}>
                      {s.name}
                    </Select.Option>
                  ))}
                </SelectField>
                <SelectField
                  name="branchIds"
                  input={{
                    placeholder: 'Filial seçin...',
                    mode: 'multiple',
                    disabled: branches.isLoading,
                    loading: branches.isLoading,
                  }}
                >
                  {branches.data?.map((b) => (
                    <Select.Option key={b.id} value={b.id.toString()}>
                      {b.name}
                    </Select.Option>
                  ))}
                </SelectField>
                <SelectField name="customsDeclarationStatusId" input={{ placeholder: 'Bəyan statusu seçin...' }}>
                  <Select.Option value="0">Bəyan olunub</Select.Option>
                  <Select.Option value="1">Bəyan olunmayıb</Select.Option>
                </SelectField>
              </div>
            </div>
          )}

          {values.type === 'orderStatus' && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>Sifariş statusu</div>
              <SelectField
                name="orderStatusIds"
                input={{
                  placeholder: 'Sifariş statusu seçin...',
                  mode: 'multiple',
                  disabled: orderStatusesLoading,
                  loading: orderStatusesLoading,
                }}
              >
                {orderStatuses.map((s) => (
                  <Select.Option key={s.id} value={s.id.toString()}>
                    {s.name}
                  </Select.Option>
                ))}
              </SelectField>
            </div>
          )}

          {values.type === 'courierStatus' && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>Kuryer statusu</div>
              <SelectField
                name="courierStatusIds"
                input={{
                  placeholder: 'Kuryer statusunu seçin...',
                  mode: 'multiple',
                  disabled: courierStatusesLoading,
                  loading: courierStatusesLoading,
                }}
              >
                {courierStatuses.map((s) => (
                  <Select.Option key={s.id} value={s.id.toString()}>
                    {s.name}
                  </Select.Option>
                ))}
              </SelectField>
            </div>
          )}

          {values.type === 'customsStatus' && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>Bəyan statusu</div>
              <SelectField name="customsStatusId" input={{ placeholder: 'Bəyan statusunu seçin...' }}>
                <Select.Option value="0">Bəyan olunub</Select.Option>
                <Select.Option value="1">Bəyan olunmayıb</Select.Option>
              </SelectField>
            </div>
          )}

          {values.type === 'flightId' && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>Uçuş</div>
              <SelectField name="flightId" input={{ placeholder: 'Uçuşu seçin...', disabled: flights.isLoading, loading: flights.isLoading }}>
                {flights.data?.map((f) => (
                  <Select.Option key={f.id} value={f.id.toString()}>
                    #{f.id} - {f.name}
                  </Select.Option>
                ))}
              </SelectField>
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Məzmun (şablon)</div>
            <SelectField name="templateId" input={{ placeholder: 'Şablon seçin...', disabled: templatesLoading, loading: templatesLoading }}>
              {templates.map((t) => (
                <Select.Option key={t.id} value={t.id.toString()}>
                  {t.name}
                </Select.Option>
              ))}
            </SelectField>
            <NavLink to="/notifier/templates/create">
              <Button style={{ marginTop: 8 }} icon={<Icons.PlusCircleOutlined />} block>
                Şablon əlavə et
              </Button>
            </NavLink>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Planlanmış vaxt</div>
            <DateField name="plannedAt" input={{ placeholder: 'Planlanmış vaxtı daxil edin...' }} />
          </div>

          <Button block type="primary" onClick={submitForm} loading={isSubmitting}>
            Göndər
          </Button>
        </Col>

        <Col xs={24} lg={12}>
          {users && (
            <>
              <Table rowKey="id" size="small" bordered dataSource={users.data} loading={usersLoading} pagination={false}>
                <Table.Column width={60} key="id" dataIndex="id" title="Kod" />
                <Table.Column key="firstname" dataIndex="firstname" title="Ad" />
                <Table.Column key="lastname" dataIndex="lastname" title="Soyad" />
                <Table.Column key="email" dataIndex="email" title="Email" />
              </Table>
              <Descriptions size="small" column={1} style={{ marginTop: 12 }}>
                <Descriptions.Item label="Göndəriləcək email sayı">{users.total || 0}</Descriptions.Item>
              </Descriptions>
              <Button
                block
                style={{ marginTop: 8 }}
                icon={<Icons.FileExcelOutlined />}
                onClick={async () => {
                  const result = await BulkEmailNotificationService.export(values);
                  if (result.status !== 200) message.error('Export xətası baş verdi.');
                }}
              >
                Excel endir
              </Button>
            </>
          )}
        </Col>
      </Row>
    </PageContent>
  );
};

export const SendBulkEmailNotification: FC = () => {
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (values: ISendBulkEmailNotificationDto) => {
      const result = await BulkEmailNotificationService.send(values);
      if (result.status === 200) {
        message.success('Email-lər göndərildi.');
        navigate('/notifier/email');
      } else {
        message.error('Xəta baş verdi.');
      }
    },
    [navigate],
  );

  return <Formik<ISendBulkEmailNotificationDto> initialValues={initialValues} onSubmit={handleSubmit} component={FormikComponent} />;
};
