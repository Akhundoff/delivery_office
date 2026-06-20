import { FC, useCallback } from 'react';
import { Formik, FormikProps, FieldArray } from 'formik';
import { Button, Col, Descriptions, Radio, Row, Select, Space, Table, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import * as Icons from '@ant-design/icons';
import { RadioField } from '@shared/modules/form/fields/radio';
import { SelectField } from '@shared/modules/form/fields/select';
import { DateField } from '@shared/modules/form/fields/date';
import { TextAreaField } from '@shared/modules/form/fields/textarea';
import { TextField } from '@shared/modules/form/fields/text';
import { PageContent } from '@shared/styled/page-content';
import { useBranches } from '@modules/branches';
import { useTinyFlights } from '@modules/flights';
import { useLimitedUsers } from '@modules/users/hooks';
import { ISendBulkSmsNotificationDto } from '../interfaces';
import { BulkSmsNotificationService } from '../services';
import { useSendBulkSmsNotification } from '../hooks';

const initialValues: ISendBulkSmsNotificationDto = {
  type: 'allUsers',
  body: '',
  flightId: '',
  user: { ids: [], monthlyLimit: '', phoneNumbers: [''] },
  declarationStatusIds: [],
  branchIds: [],
  countryIds: [],
  orderStatusIds: [],
  courierStatusIds: [],
  customsStatusId: '',
  customsDeclarationStatusId: '',
  plannedAt: '',
};

const FormikComponent: FC<FormikProps<ISendBulkSmsNotificationDto>> = ({ values, submitForm, isSubmitting }) => {
  const navigate = useNavigate();
  const branches = useBranches();
  const flights = useTinyFlights();
  const limitedUsers = useLimitedUsers(values.type === 'userIds');
  const { orderStatuses, orderStatusesLoading, declarationStatuses, declarationStatusesLoading, courierStatuses, courierStatusesLoading, smsBalance, users, usersLoading } =
    useSendBulkSmsNotification(values);

  const title = (
    <Space>
      <Icons.LeftCircleOutlined onClick={() => navigate(-1)} style={{ cursor: 'pointer' }} />
      <span>Toplu sms göndər</span>
    </Space>
  );

  const balance = smsBalance;

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
                <Radio value="userPhoneNumbers">Müştərinin telefon nömrələrinə görə</Radio>
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

          {values.type === 'userPhoneNumbers' && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>Telefon nömrələri</div>
              <FieldArray name="user.phoneNumbers">
                {({ push, remove }) => (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {values.user.phoneNumbers.map((_, index) => (
                      <TextField
                        key={index}
                        name={`user.phoneNumbers.${index}`}
                        input={{
                          addonAfter: index + 1 !== values.user.phoneNumbers.length ? <Icons.DeleteOutlined onClick={() => remove(index)} /> : <Icons.PlusOutlined onClick={() => push('')} />,
                          placeholder: 'Telefon nömrəsini daxil edin...',
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
                  <Select.Option value="1">Bəyan olunub</Select.Option>
                  <Select.Option value="2">Bəyan olunmayıb</Select.Option>
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
                <Select.Option value="1">Bəyan olunub</Select.Option>
                <Select.Option value="2">Bəyan olunmayıb</Select.Option>
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
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Məzmun</div>
            <TextAreaField name="body" input={{ placeholder: 'Sms-in məzmununu daxil edin...' }} />
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
                <Table.Column key="phoneNumber" dataIndex="phoneNumber" title="Telefon" />
              </Table>

              {balance !== undefined && balance < 100 && (
                <Descriptions size="small" column={1} style={{ marginTop: 12 }}>
                  <Descriptions.Item>
                    <Typography.Text type="danger">
                      <Icons.NotificationOutlined /> SMS Balansı azdır. Göndərişin bərpası üçün balansı artırın.
                    </Typography.Text>
                  </Descriptions.Item>
                </Descriptions>
              )}

              <Descriptions size="small" column={1} style={{ marginTop: 12 }}>
                <Descriptions.Item label="Göndəriləcək sms sayı">{users.total || 0}</Descriptions.Item>
                {balance !== undefined && (
                  <>
                    <Descriptions.Item label="SMS balansı">{balance}</Descriptions.Item>
                    <Descriptions.Item label="Qalıq balans">{Math.max(0, balance - users.total)}</Descriptions.Item>
                  </>
                )}
              </Descriptions>
              {balance !== undefined && balance - users.total < 0 && <Typography.Text type="danger">Diqqət: Sms balansınız yetərsizdir. Bütün mesajlar göndərilməyəcək.</Typography.Text>}
            </>
          )}
        </Col>
      </Row>
    </PageContent>
  );
};

export const SendBulkSmsNotification: FC = () => {
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (values: ISendBulkSmsNotificationDto) => {
      const result = await BulkSmsNotificationService.send(values);
      if (result.status === 200) {
        message.success('SMS-lər göndərildi.');
        navigate('/notifier/sms');
      } else {
        message.error('Xəta baş verdi.');
      }
    },
    [navigate],
  );

  return <Formik<ISendBulkSmsNotificationDto> initialValues={initialValues} onSubmit={handleSubmit} component={FormikComponent} />;
};
