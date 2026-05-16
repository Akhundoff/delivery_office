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
import { ModelsService } from '@modules/models/services';
import { useQuery } from 'react-query';
import { caller, urlMaker } from '@shared/utils';

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

const FormikComponent: FC<FormikProps<ICreateNotificationTemplateDto> & { onClose: () => void }> = ({
    values,
    submitForm,
    isSubmitting,
    setFieldValue,
    onClose,
}) => {
    const modelsQuery = useQuery(['models', 'list'], () => ModelsService.getList({ per_page: 200 }));

    const statusQuery = useQuery(
        ['statuses', 'model', values.modelId],
        () => caller(urlMaker('/api/admin/states/getlistbymodelid', { model_id: values.modelId })).then((r) => r.json()),
        { enabled: !!values.modelId },
    );

    const modelsOptions = useMemo(
        () =>
            modelsQuery.data?.status === 200
                ? modelsQuery.data.data.data.map((m) => (
                      <Select.Option key={m.id} value={m.id.toString()}>
                          {m.name}
                      </Select.Option>
                  ))
                : [],
        [modelsQuery.data],
    );

    const statusOptions = useMemo(
        () =>
            (statusQuery.data?.data || []).map((s: any) => (
                <Select.Option key={s.id} value={s.id.toString()}>
                    {s.name}
                </Select.Option>
            )),
        [statusQuery.data],
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
                                loading: modelsQuery.isLoading,
                                disabled: modelsQuery.isLoading,
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
                                loading: statusQuery.isLoading,
                                disabled: statusQuery.isLoading || !values.modelId,
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
                        <Col lg={24}>
                            <h3 style={{ marginBottom: 0 }}>Mail dəyişənləri:</h3>
                        </Col>
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
                        <Col lg={24}>
                            <h3 style={{ marginBottom: 0 }}>Whatsapp dəyişənləri:</h3>
                        </Col>
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
                        <Col lg={24}>
                            <h3 style={{ marginBottom: 0 }}>APP Bildiriş dəyişənləri:</h3>
                        </Col>
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

    const onClose = useCallback(() => navigate(-1), [navigate]);

    const templateQuery = useQuery(
        ['notifier', 'template', id],
        () => NotificationTemplatesService.getById(id!),
        { enabled: !!id },
    );

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

    if (id && templateQuery.isLoading) return null;

    const tpl = templateQuery.data?.status === 200 ? templateQuery.data.data : null;
    const initialValues: ICreateNotificationTemplateDto = tpl
        ? {
              id: tpl.id,
              name: tpl.name,
              title: tpl.title,
              body: tpl.body,
              typeId: tpl.type.id.toString(),
              modelId: tpl.model.id.toString(),
              statusId: tpl.status?.id.toString() ?? '',
              isActive: tpl.isActive,
              delay: tpl.delay.toString(),
              htmlTemplateId: tpl.htmlTemplateId ?? '',
          }
        : emptyValues;

    return (
        <Formik<ICreateNotificationTemplateDto>
            initialValues={initialValues}
            enableReinitialize
            onSubmit={handleSubmit}
            component={(props) => <FormikComponent {...props} onClose={onClose} />}
        />
    );
};
