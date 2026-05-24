import { FC, useCallback, useMemo } from 'react';
import { Formik, FormikProps } from 'formik';
import { Col, Modal, Row, Select, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { TextField } from '@shared/modules/form/fields/text';
import { TextAreaField } from '@shared/modules/form/fields/textarea';
import { SelectField } from '@shared/modules/form/fields/select';
import { CheckboxField } from '@shared/modules/form/fields/checkbox';
import { RichTextField } from '@shared/modules/form/fields/rich-text';
import { ICreateNotificationTemplateDto } from '../interfaces';
import { NotificationTemplatesService } from '../services';
import { useCreateNotificationTemplate } from '../hooks';

const emptyValues: ICreateNotificationTemplateDto = {
    name: '',
    title: '',
    body: '',
    typeId: '1',
    modelId: '',
    statusId: '',
    isActive: true,
    delay: '0',
    htmlTemplateId: '',
};

const FormikComponent: FC<FormikProps<ICreateNotificationTemplateDto> & { id?: string; onClose: () => void }> = ({
    values,
    submitForm,
    isSubmitting,
    setFieldValue,
    id,
    onClose,
}) => {
    const { statuses, statusesLoading, models, modelsLoading } = useCreateNotificationTemplate(id, values.modelId);

    const modelsOptions = useMemo(
        () =>
            (models || []).map((m) => (
                <Select.Option key={m.id} value={m.id.toString()}>
                    {m.name}
                </Select.Option>
            )),
        [models],
    );

    const statusOptions = useMemo(
        () =>
            statuses.map((s) => (
                <Select.Option key={s.id} value={s.id.toString()}>
                    {s.name}
                </Select.Option>
            )),
        [statuses],
    );

    const onTypeIdChange = useCallback(
        (value: string) => {
            setFieldValue('typeId', value);
            setFieldValue('body', '');
        },
        [setFieldValue],
    );

    const onModelIdChange = useCallback(
        (value: string) => {
            setFieldValue('modelId', value);
            setFieldValue('statusId', '');
        },
        [setFieldValue],
    );

    return (
        <Modal open width={768} onCancel={onClose} onOk={submitForm} confirmLoading={isSubmitting} title={values.id ? 'Şablonda düzəliş et' : 'Yeni şablon yarat'}>
            <div>
                <Row gutter={16}>
                    <Col xs={24} lg={12}>
                        <TextField name='name' item={{ label: 'Şablonun adı' }} input={{ placeholder: 'Şablonun adını daxil edin...' }} />
                    </Col>
                    <Col xs={24} lg={12}>
                        <SelectField
                            name='typeId'
                            item={{ label: 'Bildirişin tipi' }}
                            input={{ placeholder: 'Bildirişin tipini seçin...', onChange: onTypeIdChange, allowClear: false }}
                        >
                            <Select.Option value='1'>SMS</Select.Option>
                            <Select.Option value='2'>Email</Select.Option>
                            <Select.Option value='3'>Mobile APP</Select.Option>
                            <Select.Option value='4'>Whatsapp</Select.Option>
                        </SelectField>
                    </Col>
                    {values.typeId === '2' && (
                        <Col xs={24} lg={12}>
                            <TextField name='htmlTemplateId' item={{ label: 'HTML Template ID' }} input={{ placeholder: 'HTML Template ID daxil edin...' }} />
                        </Col>
                    )}
                    <Col xs={24} lg={16}>
                        <TextField
                            name='title'
                            item={{ label: 'Başlıq' }}
                            input={{ disabled: values.typeId === '1' || values.typeId === '4', placeholder: 'Başlıq daxil edin...' }}
                        />
                    </Col>
                    <Col xs={24} lg={8}>
                        <TextField name='delay' item={{ label: 'Gecikmə' }} input={{ addonAfter: 'san', placeholder: 'Gecikmə daxil edin...' }} />
                    </Col>
                    <Col xs={24}>
                        {values.typeId !== '2' && <TextAreaField name='body' item={{ label: 'Məzmun' }} input={{ placeholder: 'Məzmun daxil edin...' }} />}
                        {values.typeId === '2' && <RichTextField name='body' item={{ label: 'Məzmun' }} />}
                    </Col>
                    <Col xs={24} lg={10}>
                        <SelectField
                            name='modelId'
                            item={{ label: 'Model' }}
                            input={{
                                placeholder: 'Model seçin...',
                                onChange: onModelIdChange,
                                loading: modelsLoading,
                                disabled: modelsLoading,
                            }}
                        >
                            {modelsOptions}
                        </SelectField>
                    </Col>
                    <Col xs={18} lg={10}>
                        <SelectField
                            name='statusId'
                            item={{ label: 'Status' }}
                            input={{
                                placeholder: 'Status seçin...',
                                loading: statusesLoading,
                                disabled: statusesLoading || !values.modelId,
                            }}
                        >
                            {statusOptions}
                        </SelectField>
                    </Col>
                    <Col xs={6} lg={4}>
                        <CheckboxField name='isActive' item={{ label: <>&nbsp;</> }} input={{ children: 'Aktiv' }} />
                    </Col>
                </Row>

                {values.typeId === '1' && (
                    <Row gutter={[24, 24]} style={{ marginTop: 16 }}>
                        <Col lg={24}>
                            <h3 style={{ marginBottom: 0 }}>SMS dəyişənləri:</h3>
                        </Col>
                        <Col lg={24}>
                            <table style={{ width: '100%' }}>
                                <tbody>
                                    <tr>
                                        <td>Müştəri adı:</td>
                                        <td>{'{user_name}'}</td>
                                    </tr>
                                    <tr>
                                        <td>Track code:</td>
                                        <td>{'{track_code}'}</td>
                                    </tr>
                                    <tr>
                                        <td>Filial:</td>
                                        <td>{'{branch_name}'}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </Col>
                    </Row>
                )}

                {values.typeId === '2' && (
                    <Row gutter={[24, 24]} style={{ marginTop: 16 }}>
                        <Col lg={24}><h3 style={{ marginBottom: 0 }}>Mail dəyişənləri:</h3></Col>
                        <Col lg={12}>
                            <table style={{ width: '100%' }}>
                                <tbody>
                                    <tr><td>Müştəri adı:</td><td>{'%recipient.user_name%'}</td></tr>
                                    <tr><td>Filial:</td><td>{'%recipient.branch_name%'}</td></tr>
                                    <tr><td>Ölkə:</td><td>{'%recipient.country_name%'}</td></tr>
                                    <tr><td>Track code:</td><td>{'%recipient.track_code%'}</td></tr>
                                    <tr><td>Global track kod:</td><td>{'%recipient.global_track_code%'}</td></tr>
                                    <tr><td>Say:</td><td>{'%recipient.quantity%'}</td></tr>
                                    <tr><td>Sifariş ləğv səbəbi:</td><td>{'%recipient.client_descr%'}</td></tr>
                                </tbody>
                            </table>
                        </Col>
                        <Col lg={12}>
                            <table style={{ width: '100%' }}>
                                <tbody>
                                    <tr><td>Bağlama qiyməti:</td><td>{'%recipient.price%'}</td></tr>
                                    <tr><td>Çatdırılma qiyməti:</td><td>{'%recipient.delivery_price%'}</td></tr>
                                    <tr><td>Çəki:</td><td>{'%recipient.weight%'}</td></tr>
                                    <tr><td>Mağaza:</td><td>{'%recipient.shop_name%'}</td></tr>
                                    <tr><td>Məhsul kateqoriyası:</td><td>{'%recipient.product_type_name%'}</td></tr>
                                    <tr><td>Valyuta:</td><td>{'%recipient.currency%'}</td></tr>
                                </tbody>
                            </table>
                        </Col>
                    </Row>
                )}

                {values.typeId === '4' && (
                    <Row gutter={[24, 24]} style={{ marginTop: 16 }}>
                        <Col lg={24}><h3 style={{ marginBottom: 0 }}>Whatsapp dəyişənləri:</h3></Col>
                        <Col lg={12}>
                            <table style={{ width: '100%' }}>
                                <tbody>
                                    <tr><td>Müştəri adı:</td><td>{'{user_name}'}</td></tr>
                                    <tr><td>Filial:</td><td>{'{branch_name}'}</td></tr>
                                    <tr><td>Ölkə:</td><td>{'{country_name}'}</td></tr>
                                    <tr><td>Track code:</td><td>{'{track_code}'}</td></tr>
                                    <tr><td>Global track kod:</td><td>{'{global_track_code}'}</td></tr>
                                    <tr><td>Say:</td><td>{'{quantity}'}</td></tr>
                                    <tr><td>Sifariş ləğv səbəbi:</td><td>{'{client_descr}'}</td></tr>
                                </tbody>
                            </table>
                        </Col>
                        <Col lg={12}>
                            <table style={{ width: '100%' }}>
                                <tbody>
                                    <tr><td>Bağlama qiyməti:</td><td>{'{price}'}</td></tr>
                                    <tr><td>Çatdırılma qiyməti:</td><td>{'{delivery_price}'}</td></tr>
                                    <tr><td>Çəki:</td><td>{'{weight}'}</td></tr>
                                    <tr><td>Mağaza:</td><td>{'{shop_name}'}</td></tr>
                                    <tr><td>Məhsul kateqoriyası:</td><td>{'{product_type_name}'}</td></tr>
                                    <tr><td>Valyuta:</td><td>{'{currency}'}</td></tr>
                                    <tr><td>Xəritə ünvanı linki:</td><td>{'{map_url}'}</td></tr>
                                </tbody>
                            </table>
                        </Col>
                    </Row>
                )}

                {values.typeId === '3' && (
                    <Row gutter={[24, 24]} style={{ marginTop: 16 }}>
                        <Col lg={24}><h3 style={{ marginBottom: 0 }}>APP Bildiriş dəyişənləri:</h3></Col>
                        <Col lg={12}>
                            <table style={{ width: '100%' }}>
                                <tbody>
                                    <tr><td>Müştəri adı:</td><td>{'{user_name}'}</td></tr>
                                    <tr><td>Filial:</td><td>{'{branch_name}'}</td></tr>
                                    <tr><td>Ölkə:</td><td>{'{country_name}'}</td></tr>
                                    <tr><td>Track code:</td><td>{'{track_code}'}</td></tr>
                                    <tr><td>Global track kod:</td><td>{'{global_track_code}'}</td></tr>
                                    <tr><td>Say:</td><td>{'{quantity}'}</td></tr>
                                    <tr><td>Sifariş ləğv səbəbi:</td><td>{'{client_descr}'}</td></tr>
                                </tbody>
                            </table>
                        </Col>
                        <Col lg={12}>
                            <table style={{ width: '100%' }}>
                                <tbody>
                                    <tr><td>Bağlama qiyməti:</td><td>{'{price}'}</td></tr>
                                    <tr><td>Çatdırılma qiyməti:</td><td>{'{delivery_price}'}</td></tr>
                                    <tr><td>Çəki:</td><td>{'{weight}'}</td></tr>
                                    <tr><td>Mağaza:</td><td>{'{shop_name}'}</td></tr>
                                    <tr><td>Məhsul kateqoriyası:</td><td>{'{product_type_name}'}</td></tr>
                                    <tr><td>Valyuta:</td><td>{'{currency}'}</td></tr>
                                </tbody>
                            </table>
                        </Col>
                    </Row>
                )}
            </div>
        </Modal>
    );
};

export const CreateNotificationTemplate: FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id?: string }>();
    const { template, templateLoading } = useCreateNotificationTemplate(id);

    const onClose = useCallback(() => navigate(-1), [navigate]);

    const handleSubmit = useCallback(
        async (values: ICreateNotificationTemplateDto) => {
            const result = await NotificationTemplatesService.create(values);
            if (result.status === 200) {
                message.success(id ? 'Şablon yeniləndi.' : 'Şablon yaradıldı.');
                navigate(-1);
            } else {
                message.error('Xəta baş verdi.');
            }
        },
        [id, navigate],
    );

    if (id && templateLoading) return null;

    const initialValues: ICreateNotificationTemplateDto = template
        ? {
              id: template.id,
              name: template.name,
              title: template.title,
              body: template.body,
              typeId: template.type.id.toString(),
              modelId: template.model.id.toString(),
              statusId: template.status?.id.toString() ?? '',
              isActive: template.isActive,
              delay: template.delay.toString(),
              htmlTemplateId: template.htmlTemplateId ?? '',
          }
        : emptyValues;

    return (
        <Formik<ICreateNotificationTemplateDto>
            initialValues={initialValues}
            enableReinitialize
            onSubmit={handleSubmit}
            component={(props) => <FormikComponent {...props} id={id} onClose={onClose} />}
        />
    );
};
