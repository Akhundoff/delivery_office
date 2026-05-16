import React, { FC, useContext } from 'react';
import { Alert, Button, Dropdown, Form, Input, Menu, Modal, Result, Space, Spin, Tag, Tooltip, Typography } from 'antd';
import * as Icons from '@ant-design/icons';
import { Formik } from 'formik';

import { DetailActions, DetailActionCol, DetailCard, DetailCol, DetailDescriptions, DetailHeader, DetailPage, DetailRow } from '@shared/styled/detail';
import { SettingsContext } from '@modules/settings';
import { DeclarationStatusTag } from '../components/declaration-status-tag';
import { useDeclaration } from '../hooks';

export const DeclarationDetail: FC<{ id: string }> = ({ id }) => {
    const settings = useContext(SettingsContext);
    const {
        data,
        isLoading,
        error,
        orderIds,
        canHandover,
        waybillIsDisabled,
        handover,
        returnDec,
        openEdit,
        openTimeline,
        remove,
        cancelDispatch,
        removeFromFlight,
        handleRemoveFromContainer,
        openOrder,
        isTogglingWanted,
        wantedModalVisible,
        closeWantedModal,
        handleToggleWantedStatus,
        handleSubmitWanted,
    } = useDeclaration(id);

    if (isLoading) {
        return (
            <DetailPage>
                <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
                    <Spin size='large' />
                </div>
            </DetailPage>
        );
    }

    if (error || !data) {
        return (
            <DetailPage>
                <Result status='404' title='Xəta baş verdi' subTitle={error || 'Məlumatlar əldə edilə bilmədi'} />
            </DetailPage>
        );
    }

    const country = settings.getCountry(data.countryId);

    const title = (
        <Space size={8}>
            <Icons.LeftCircleOutlined style={{ cursor: 'pointer' }} onClick={() => window.history.back()} />
            <span>#{data.trackCode}</span>
        </Space>
    );

    const tags = (
        <Space size={4}>
            {country && <Tag>{country.name}</Tag>}
            <DeclarationStatusTag id={data.status.id} name={data.status.name} />
            {data.isCommercial
                ? <Tag color='blue'>Kommersial bağlama</Tag>
                : <Tag>Vətəndaş bağlaması</Tag>
            }
            {data.returned && <Tag color='#e77b8a'>İadə edilmişdir</Tag>}
        </Space>
    );

    const extra = [
        <Tooltip key='timeline' title='Status xəritəsi'>
            <Button type='link' onClick={openTimeline} icon={<Icons.FieldTimeOutlined />} />
        </Tooltip>,
        <Tooltip key='edit' title='Düzəliş et'>
            <Button type='link' onClick={openEdit} icon={<Icons.EditOutlined />} />
        </Tooltip>,
        <Tooltip key='delete' title='Sil'>
            <Button type='link' danger onClick={remove} icon={<Icons.DeleteOutlined />} />
        </Tooltip>,
    ];

    const ordersNode = (
        <Dropdown
            disabled={!orderIds.length}
            overlay={
                <Menu>
                    {orderIds.map((oid, index) => (
                        <Menu.Item key={oid} onClick={() => openOrder(oid)}>
                            Sifariş #{index + 1}
                        </Menu.Item>
                    ))}
                </Menu>
            }
        >
            <Button type='primary' icon={<Icons.ShoppingCartOutlined />} ghost block>
                Sifarişlər
            </Button>
        </Dropdown>
    );

    return (
        <DetailPage>
            <DetailRow>
                <DetailCol xs={24}>
                    <DetailHeader title={title} subTitle={data.user.name} tags={tags} extra={extra} />
                    {!!data.editable && (
                        <Alert message='Bu bağlama məlumatları natamam doldurulduğundan gömrüyə göndərilməyib.' type='warning' showIcon style={{ marginTop: 12 }} />
                    )}
                </DetailCol>
                <DetailCol xs={24}>
                    <DetailActions>
                        <DetailActionCol>
                            <Button type='primary' disabled={!canHandover} onClick={handover} icon={<Icons.CheckCircleOutlined />} ghost block>
                                Təhvil ver
                            </Button>
                            <Button type='primary' onClick={returnDec} icon={<Icons.RollbackOutlined />} ghost block>
                                İadə et
                            </Button>
                            {data.status.id === 8 && (
                                <Button type='primary' onClick={cancelDispatch} icon={<Icons.IssuesCloseOutlined />} ghost block>
                                    Depeşi ləğv et
                                </Button>
                            )}
                            <Dropdown
                                overlay={
                                    <Menu>
                                        <Menu.Item disabled={waybillIsDisabled}>Yol vərəqi</Menu.Item>
                                        <Menu.Item>Proforma invoice</Menu.Item>
                                        <Menu.Item disabled={!data.handoverTaskId}>Təhvil sənədi</Menu.Item>
                                        <Menu.Item>Təhvil sənədi (fərdi)</Menu.Item>
                                    </Menu>
                                }
                            >
                                <Button type='primary' icon={<Icons.PrinterOutlined />} ghost block>
                                    Çap et
                                </Button>
                            </Dropdown>
                        </DetailActionCol>
                        <DetailActionCol>
                            {ordersNode}
                        </DetailActionCol>
                    </DetailActions>
                </DetailCol>

                <DetailCol xs={24} lg={12}>
                    <DetailRow>
                        <DetailCol xs={24}>
                            <DetailCard title='Ümumi məlumat'>
                                <DetailDescriptions>
                                    <DetailDescriptions.Item label='Müştəri kodu'>{data.user.id}</DetailDescriptions.Item>
                                    <DetailDescriptions.Item label='İzləmə kodu'>#{data.trackCode}</DetailDescriptions.Item>
                                    <DetailDescriptions.Item label='Qlobal izləmə kodu'>{data.globalTrackCode || 'Qeyd olunmayıb'}</DetailDescriptions.Item>
                                    {!!data.partnerName && (
                                        <DetailDescriptions.Item label='Partnyor'>{data.partnerName}</DetailDescriptions.Item>
                                    )}
                                    <DetailDescriptions.Item label='Gömrük bəyanı'>
                                        {data.customs === 0 ? 'edilməyib' : 'edilib'}
                                    </DetailDescriptions.Item>
                                    <DetailDescriptions.Item label='İadə'>{data.returned ? 'Bəli' : 'Xeyr'}</DetailDescriptions.Item>
                                    <DetailDescriptions.Item label='Axtarılır'>
                                        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                                            <Typography.Text>{data.isWanted ? 'Bəli' : 'Xeyr'}</Typography.Text>
                                            <Button type='primary' size='small' loading={isTogglingWanted} onClick={handleToggleWantedStatus} ghost>
                                                {data.isWanted ? 'Axtarışdan çıxar' : 'Axtarışa ver'}
                                            </Button>
                                        </Space>
                                    </DetailDescriptions.Item>
                                    <DetailDescriptions.Item label='Məhsul tipi'>{data.productType?.name}</DetailDescriptions.Item>
                                    <DetailDescriptions.Item label='Mağaza'>{data.shop || 'Qeyd olunmayıb'}</DetailDescriptions.Item>
                                    <DetailDescriptions.Item label='Tərkibi'>{data.type === 'liquid' ? 'Maye' : 'Digər'}</DetailDescriptions.Item>
                                    <DetailDescriptions.Item label='Miqdarı'>{data.quantity}</DetailDescriptions.Item>
                                    {data.voen && (
                                        <DetailDescriptions.Item label='VÖEN'>{data.voen}</DetailDescriptions.Item>
                                    )}
                                    <DetailDescriptions.Item label='Sənəd'>
                                        {data.file ? (
                                            <a href={data.file} target='_blank' rel='noreferrer noopener'>Sənədə bax</a>
                                        ) : (
                                            'Mövcud deyil'
                                        )}
                                    </DetailDescriptions.Item>
                                    <DetailDescriptions.Item label='Yaradılma tarixi'>{data.createdAt}</DetailDescriptions.Item>
                                    {data.causerId && (
                                        <DetailDescriptions.Item label='Düzəliş edən'>{data.causerId}</DetailDescriptions.Item>
                                    )}
                                </DetailDescriptions>
                            </DetailCard>
                        </DetailCol>
                        <DetailCol xs={24}>
                            <DetailCard title='Anbar məlumatları'>
                                <DetailDescriptions>
                                    <DetailDescriptions.Item label='Səbət'>{data.basket?.name || 'Qeyd olunmayıb'}</DetailDescriptions.Item>
                                    <DetailDescriptions.Item label='Koli'>{data.parcel?.id || 'Qeyd olunmayıb'}</DetailDescriptions.Item>
                                    <DetailDescriptions.Item label='Şkaf (Yerli)'>{data.wardrobeNumber || 'Qeyd olunmayıb'}</DetailDescriptions.Item>
                                    <DetailDescriptions.Item label='Yeşik'>
                                        <Space size={12} align='center'>
                                            {data.box ? (
                                                <>
                                                    <Tag>{data.box.name}</Tag>
                                                    <Button type='primary' onClick={handleRemoveFromContainer} icon={<Icons.DeleteOutlined />} size='small' ghost danger>
                                                        Yeşikdən çıxar
                                                    </Button>
                                                </>
                                            ) : (
                                                <Typography.Text>Qeyd olunmayıb</Typography.Text>
                                            )}
                                        </Space>
                                    </DetailDescriptions.Item>
                                </DetailDescriptions>
                            </DetailCard>
                        </DetailCol>
                    </DetailRow>
                </DetailCol>

                <DetailCol xs={24} lg={12}>
                    <DetailRow>
                        <DetailCol xs={24}>
                            <DetailCard title='Qiymətlər'>
                                <DetailDescriptions>
                                    <DetailDescriptions.Item label='Məhsulun qiyməti'>
                                        {data.price != null ? `${Number(data.price).toFixed(2)} ${data.currency || ''}` : 'Qeyd olunmayıb'}
                                    </DetailDescriptions.Item>
                                    <DetailDescriptions.Item label='Çatdırılma qiyməti'>
                                        {data.deliveryPrice != null ? `${Number(data.deliveryPrice).toFixed(2)} $` : 'Qeyd olunmayıb'}
                                    </DetailDescriptions.Item>
                                    <DetailDescriptions.Item label='Ödənilmə statusu'>
                                        {data.paid ? 'Ödənilib' : 'Ödənilməyib'}
                                    </DetailDescriptions.Item>
                                </DetailDescriptions>
                            </DetailCard>
                        </DetailCol>
                        <DetailCol xs={24}>
                            <DetailCard title='Ölçülər'>
                                <DetailDescriptions>
                                    <DetailDescriptions.Item label='Çəki'>
                                        {data.weight != null ? `${Number(data.weight).toFixed(2)} kq` : 'Qeyd olunmayıb'}
                                    </DetailDescriptions.Item>
                                    <DetailDescriptions.Item label='En'>
                                        {data.depth != null ? `${Number(data.depth).toFixed(2)} sm` : 'Qeyd olunmayıb'}
                                    </DetailDescriptions.Item>
                                    <DetailDescriptions.Item label='Uzunluq'>
                                        {data.width != null ? `${Number(data.width).toFixed(2)} sm` : 'Qeyd olunmayıb'}
                                    </DetailDescriptions.Item>
                                    <DetailDescriptions.Item label='Hündürlük'>
                                        {data.height != null ? `${Number(data.height).toFixed(2)} sm` : 'Qeyd olunmayıb'}
                                    </DetailDescriptions.Item>
                                </DetailDescriptions>
                            </DetailCard>
                        </DetailCol>
                        <DetailCol xs={24}>
                            <DetailCard title='Yerləşmə'>
                                <DetailDescriptions>
                                    {data.branch && (
                                        <DetailDescriptions.Item label='Filial'>{data.branch.name}</DetailDescriptions.Item>
                                    )}
                                    <DetailDescriptions.Item label='Uçuş'>
                                        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                                            <Typography.Text>{data.flight?.name || 'Qeyd olunmayıb'}</Typography.Text>
                                            <Button type='primary' onClick={removeFromFlight} icon={<Icons.DeleteOutlined />} size='small' ghost disabled={!data.flight?.name}>
                                                Uçuşdan çıxar
                                            </Button>
                                        </Space>
                                    </DetailDescriptions.Item>
                                    <DetailDescriptions.Item label='Çatdırılma məntəqəsi'>
                                        {data.deliveryPoint?.name || 'Qeyd olunmayıb'}
                                    </DetailDescriptions.Item>
                                </DetailDescriptions>
                            </DetailCard>
                        </DetailCol>
                    </DetailRow>
                </DetailCol>

                <DetailCol xs={24}>
                    <DetailCard title='Açıqlama'>{data.description || 'Qeyd olunmayıb'}</DetailCard>
                </DetailCol>
            </DetailRow>

            <Formik
                initialValues={{ descr: '' }}
                enableReinitialize
                onSubmit={async (values, helpers) => {
                    await handleSubmitWanted(values.descr || null);
                    helpers.resetForm();
                }}
            >
                {({ values, setFieldValue, handleSubmit, resetForm }) => (
                    <Modal
                        title='Axtarışa ver'
                        open={wantedModalVisible}
                        onOk={() => handleSubmit()}
                        onCancel={() => { resetForm(); closeWantedModal(); }}
                        okText='Təsdiq et'
                        cancelText='Ləğv et'
                        confirmLoading={isTogglingWanted}
                        width={500}
                    >
                        <Form layout='vertical' component='div' size='large'>
                            <Form.Item label='Axtarış səbəbi'>
                                <Input.TextArea
                                    placeholder='Axtarış səbəbini daxil edin...'
                                    rows={4}
                                    maxLength={250}
                                    showCount
                                    value={values.descr}
                                    onChange={(e) => setFieldValue('descr', e.target.value)}
                                />
                            </Form.Item>
                            <Typography.Text type='secondary' style={{ fontSize: 12 }}>
                                Maksimum 250 simvol
                            </Typography.Text>
                        </Form>
                    </Modal>
                )}
            </Formik>
        </DetailPage>
    );
};
