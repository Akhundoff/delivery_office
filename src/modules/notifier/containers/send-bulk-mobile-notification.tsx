import { FC, useCallback, useState } from 'react';
import { Formik, FormikProps } from 'formik';
import { Button, Col, Descriptions, Radio, Row, Select, Space, Table, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import * as Icons from '@ant-design/icons';
import { RadioField } from '@shared/modules/form/fields/radio';
import { SelectField } from '@shared/modules/form/fields/select';
import { DateField } from '@shared/modules/form/fields/date';
import { PageContent } from '@shared/styled/page-content';
import { useBranches } from '@modules/branches';
import { ISendBulkMobileNotificationDto } from '../interfaces';
import { BulkMobileNotificationService, NotificationTemplatesService } from '../services';
import { useQuery } from 'react-query';

const initialValues: ISendBulkMobileNotificationDto = {
    type: 'allUsers',
    templateId: '',
    flightId: '',
    user: { ids: [], monthlyLimit: '' },
    declarationStatusIds: [],
    branchIds: [],
    countryIds: [],
    orderStatusIds: [],
    courierStatusIds: [],
    customsStatusId: '',
    customsDeclarationStatusId: '',
    plannedAt: '',
};

const FormikComponent: FC<FormikProps<ISendBulkMobileNotificationDto>> = ({ values, submitForm, isSubmitting }) => {
    const navigate = useNavigate();
    const branches = useBranches();

    const templates = useQuery(['notifier', 'templates', 'mobile'], () =>
        NotificationTemplatesService.getList({ template_type_id: 3, per_page: 200 }),
    );

    const usersQuery = useQuery(
        ['notifier', 'mobile', 'users', values],
        () => BulkMobileNotificationService.getUsers(values),
        { enabled: !!values.type },
    );

    const title = (
        <Space>
            <Icons.LeftCircleOutlined onClick={() => navigate(-1)} style={{ cursor: 'pointer' }} />
            <span>Toplu APP bildiriş göndər</span>
        </Space>
    );

    return (
        <PageContent title={title}>
            <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}>
                    <div style={{ marginBottom: 16 }}>
                        <div style={{ fontWeight: 600, marginBottom: 8 }}>Göndəriş tipi</div>
                        <RadioField name='type'>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                <Radio value='allUsers'>Bütün müştərilərə</Radio>
                                <Radio value='userBirthday'>Doğum günü olan müştərilər</Radio>
                                <Radio value='declarationStatus'>Bağlama statusuna görə</Radio>
                                <Radio value='orderStatus'>Sifariş statusuna görə</Radio>
                                <Radio value='courierStatus'>Kuryer statusuna görə</Radio>
                                <Radio value='customsStatus'>Bəyan statusuna görə</Radio>
                                <Radio value='userMonthlyLimit'>Cari ay limitinə görə</Radio>
                            </div>
                        </RadioField>
                    </div>

                    {(values.type === 'declarationStatus' || values.type === 'orderStatus' || values.type === 'courierStatus') && (
                        <div style={{ marginBottom: 16 }}>
                            <div style={{ fontWeight: 600, marginBottom: 8 }}>Filial</div>
                            <SelectField name='branchIds' input={{ placeholder: 'Filial seçin...', mode: 'multiple', disabled: branches.isLoading, loading: branches.isLoading }}>
                                {branches.data?.map((b) => (
                                    <Select.Option key={b.id} value={b.id.toString()}>
                                        {b.name}
                                    </Select.Option>
                                ))}
                            </SelectField>
                        </div>
                    )}

                    <div style={{ marginBottom: 16 }}>
                        <div style={{ fontWeight: 600, marginBottom: 8 }}>Şablon</div>
                        <SelectField
                            name='templateId'
                            input={{
                                placeholder: 'Şablon seçin...',
                                disabled: templates.isLoading,
                                loading: templates.isLoading,
                            }}
                        >
                            {templates.data?.status === 200 &&
                                templates.data.data.data.map((t) => (
                                    <Select.Option key={t.id} value={t.id.toString()}>
                                        {t.name}
                                    </Select.Option>
                                ))}
                        </SelectField>
                    </div>

                    <div style={{ marginBottom: 16 }}>
                        <div style={{ fontWeight: 600, marginBottom: 8 }}>Planlanmış vaxt</div>
                        <DateField name='plannedAt' input={{ placeholder: 'Planlanmış vaxtı daxil edin...' }} />
                    </div>

                    <Button block type='primary' onClick={submitForm} loading={isSubmitting}>
                        Göndər
                    </Button>
                </Col>
                <Col xs={24} lg={12}>
                    {usersQuery.data?.status === 200 && (
                        <>
                            <Table
                                rowKey='id'
                                size='small'
                                bordered
                                dataSource={usersQuery.data.data.data}
                                loading={usersQuery.isLoading}
                                pagination={false}
                            >
                                <Table.Column width={60} key='id' dataIndex='id' title='Kod' />
                                <Table.Column key='firstname' dataIndex='firstname' title='Ad' />
                                <Table.Column key='lastname' dataIndex='lastname' title='Soyad' />
                            </Table>
                            <Descriptions size='small' column={1} style={{ marginTop: 12 }}>
                                <Descriptions.Item label='Göndəriləcək bildiriş sayı'>{usersQuery.data.data.total}</Descriptions.Item>
                            </Descriptions>
                        </>
                    )}
                </Col>
            </Row>
        </PageContent>
    );
};

export const SendBulkMobileNotification: FC = () => {
    const navigate = useNavigate();

    const handleSubmit = useCallback(async (values: ISendBulkMobileNotificationDto) => {
        const result = await BulkMobileNotificationService.send(values);
        if (result.status === 200) {
            message.success('Bildirişlər göndərildi.');
            navigate('/notifier/mobile/bulk/send');
        } else {
            message.error('Xəta baş verdi.');
        }
    }, [navigate]);

    return <Formik<ISendBulkMobileNotificationDto> initialValues={initialValues} onSubmit={handleSubmit} component={FormikComponent} />;
};
