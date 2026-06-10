import React, { FC, useContext, useMemo } from 'react';
import { Alert, Button, Col, Collapse, Dropdown, Form, Input, List, Menu, Modal, Result, Row, Space, Spin, Steps, Table, Tag, Tooltip, Typography } from 'antd';
import * as Icons from '@ant-design/icons';
import { Formik } from 'formik';
import ReactJson from 'react-json-view';

import { DetailActions, DetailActionCol, DetailCard, DetailCol, DetailDescriptions, DetailHeader, DetailPage, DetailRow } from '@shared/styled/detail';
import { TagSpace } from '@shared/styled/tag-space';
import { SettingsContext } from '@modules/settings';
import { CouponTags, CurrencySymbols, getCurrencySymbol, getCurrencySymbolByCountryId } from '@modules/orders/constants';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { BoxTransfersTable } from '@modules/box-transfers';
import { BoxTransfersTableContext } from '@modules/box-transfers/context';
import { boxTransfersTableFetchUseCase } from '@modules/box-transfers/use-cases/box-transfers-table-fetch';
import { DeclarationStatusTag } from '../components/declaration-status-tag';
import { useAddCommercial, useDeclaration } from '../hooks';
import TrendyolLogo from '../../../assets/images/trendyol.svg';
import TemuLogo from '../../../assets/images/temu.svg';

const tooltipStyle: React.CSSProperties = {
    background: '#ffffff',
    color: '#262626',
    boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
    padding: 10,
    borderRadius: 6,
};

const tooltipContentStyle: React.CSSProperties = { maxWidth: 300 };

const tooltipTitleStyle: React.CSSProperties = { color: '#262626' };

const tooltipTextStyle: React.CSSProperties = {
    fontSize: 12,
    color: '#595959',
    lineHeight: 1.6,
};

const iconStyle: React.CSSProperties = {
    color: '#1890ff',
    cursor: 'pointer',
};

export const DeclarationDetail: FC<{ id: string }> = ({ id }) => {
    const settings = useContext(SettingsContext);
    const {
        data,
        isLoading,
        error,
        orderIds,
        can,
        notification,
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
        printWaybill,
        printProformaInvoice,
        printHandoverCheck,

        isContainerTransfersModalVisible,
        openContainerTransfersModal,
        closeContainerTransfersModal,

        customsStatus,
        customStatusName,
        customsStatesInfo,
        isAccordionOpen,
        handleAccordionChange,
        customsStatusModalOpen,
        openCustomsStatusModal,
        closeCustomsStatusModal,

        isCustomsRawModalOpen,
        openCustomsRawModal,
        closeCustomsRawModal,

        parcelStates,
        trendyolStatus,
        changeTrendyolStatus,
        customsStatusName: trendyolCustomsStatusName,

        pinCodeEditing,
        onTogglePinCodeEditing,
        onPinCodeSubmit,
        form,
    } = useDeclaration(id);

    const { initialValues, addCommercialVoen, closeModal: closeCommercialModal, commercialModalOpen, openModal: openCommercialModal } = useAddCommercial(+id, data);

    React.useEffect(() => {
        if (data?.isWanted) {
            notification.warning({
                message: 'Diqqət!',
                description: 'Bu bağlama axtarış siyahısındadır. Bağlama axtarılır və xüsusi diqqət tələb edir.',
                duration: 8,
                placement: 'topRight',
            });
        }
    }, [data?.isWanted, notification]);

    const boxTransfersFetch = useMemo(() => (data ? boxTransfersTableFetchUseCase(String(data.id), 'declaration') : undefined), [data]);

    const getAccordionHeader = React.useCallback(() => {
        if (customsStatus.isLoading) {
            return (
                <Tooltip title='Yüklənir...'>
                    <Space size={6} align='center'>
                        <Icons.LoadingOutlined />
                        <Typography.Text strong>DGK Status</Typography.Text>
                    </Space>
                </Tooltip>
            );
        }
        if (customsStatus.isError) {
            return (
                <Tooltip title='Yenidən cəhd edin'>
                    <Space size={6} align='center'>
                        <Icons.ReloadOutlined style={{ color: '#ff4d4f' }} />
                        <Typography.Text strong>DGK Status</Typography.Text>
                        <Typography.Text type='secondary'> (Yenidən cəhd edin)</Typography.Text>
                    </Space>
                </Tooltip>
            );
        }
        return (
            <Tooltip title='DGK Statusu'>
                <Space size={6} align='center'>
                    <Icons.FileTextOutlined style={{ color: '#52c41a' }} />
                    <Typography.Text strong>DGK Status</Typography.Text>
                    <Typography.Text type='secondary'>{!customsStatus.isSuccess ? '(Məlumatı görmək üçün klikləyin)' : ''}</Typography.Text>
                </Space>
            </Tooltip>
        );
    }, [customsStatus.isLoading, customsStatus.isError, customsStatus.isSuccess]);

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
        <TagSpace size={8}>
            {country && <Tag>{country.name}</Tag>}
            <DeclarationStatusTag id={data.status.id} name={data.status.name} />
            {data.isCommercial ? (
                <Tag color='blue'>Kommersial bağlama</Tag>
            ) : (
                <Tag>Vətəndaş bağlaması</Tag>
            )}
            {data.returned && <Tag color='#e77b8a'>İadə edilmişdir</Tag>}
            {data.trendyol === 1 && <img style={{ width: 80, height: 30 }} src={TrendyolLogo} alt='Trendyol' />}
            {data.trendyol === 2 && <img style={{ width: 60, height: 40 }} src={TemuLogo} alt='Temu' />}
        </TagSpace>
    );

    const extra = [
        <Tooltip key='timeline' title='Status xəritəsi'>
            <Button type='link' onClick={openTimeline} icon={<Icons.FieldTimeOutlined />} />
        </Tooltip>,
        <Tooltip key='edit' title='Düzəliş et'>
            <Button type='link' onClick={openEdit} icon={<Icons.EditOutlined />} />
        </Tooltip>,
        <Tooltip key='delete' title='Sil'>
            <Button type='link' disabled={!can('declaration_cancel')} danger onClick={remove} icon={<Icons.DeleteOutlined />} />
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

    const hasTrendyolLogs = !!Object.keys(data.trendyolLogs || {}).length;

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
                            {can('canceldepesh') && (
                                <Button type='primary' onClick={cancelDispatch} icon={<Icons.IssuesCloseOutlined />} disabled={data.status.id !== 8} ghost block>
                                    Depeşi ləğv et
                                </Button>
                            )}
                            <Dropdown
                                overlay={
                                    <Menu>
                                        <Menu.Item disabled={waybillIsDisabled} onClick={printWaybill}>Yol vərəqi</Menu.Item>
                                        <Menu.Item onClick={printProformaInvoice}>Proforma invoice</Menu.Item>
                                        <Menu.Item disabled={!data.handoverTaskId} onClick={() => printHandoverCheck(data)}>Təhvil sənədi</Menu.Item>
                                        <Menu.Item onClick={() => printHandoverCheck(data)}>Təhvil sənədi (fərdi)</Menu.Item>
                                    </Menu>
                                }
                            >
                                <Button type='primary' icon={<Icons.PrinterOutlined />} ghost block>
                                    Çap et
                                </Button>
                            </Dropdown>
                            {data.trendyol === 1 && (
                                <Dropdown
                                    overlay={
                                        <Menu>
                                            {trendyolStatus.data?.map((elem) => (
                                                <Menu.Item key={elem.id} onClick={() => changeTrendyolStatus(elem.id, elem.name)}>
                                                    {elem.name}
                                                </Menu.Item>
                                            ))}
                                        </Menu>
                                    }
                                >
                                    <Button type='primary' icon={<Icons.EditFilled />} ghost block>
                                        Trendyol Statusunu dəyiş
                                    </Button>
                                </Dropdown>
                            )}
                            {data.isCommercial && (
                                <Button type='primary' onClick={openCommercialModal} icon={<Icons.FileMarkdownOutlined />} ghost block>
                                    Kommersial bəyan
                                </Button>
                            )}
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
                                    <DetailDescriptions.Item label='Qlobal izləmə kodu'>
                                        {data.globalTrackCode || 'Qeyd olunmayıb'} {data.trendyol === 1 ? `(${data.trendyolLogs?.barcode})` : ''}
                                    </DetailDescriptions.Item>
                                    {!!data.partnerName && (
                                        <DetailDescriptions.Item label='Partnyor'>{data.partnerName}</DetailDescriptions.Item>
                                    )}
                                    <DetailDescriptions.Item label='Gömrük bəyanı'>
                                        <Space size={6} align='center'>
                                            <span>{data.customs === 0 ? 'edilməyib' : 'edilib'}</span>
                                            {!!data.customsData?.raw_data && (
                                                <Tooltip title='DGK cavabını JSON formatda göstər'>
                                                    <Icons.FileSearchOutlined style={{ color: '#1890ff', cursor: 'pointer', fontSize: 16 }} onClick={openCustomsRawModal} />
                                                </Tooltip>
                                            )}
                                        </Space>
                                        {!!data.customsData?.created_at && (
                                            <Typography.Text type='secondary' style={{ fontSize: 12, display: 'block' }}>
                                                {data.customsData.created_at}
                                            </Typography.Text>
                                        )}
                                    </DetailDescriptions.Item>
                                    <DetailDescriptions.Item label='İadə'>{data.returned ? 'Bəli' : 'Xeyr'}</DetailDescriptions.Item>
                                    <DetailDescriptions.Item label='Axtarılır'>
                                        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                                            <Space size={8}>
                                                <Typography.Text>{data.isWanted ? 'Bəli' : 'Xeyr'}</Typography.Text>
                                                {data.isWanted && (
                                                    <Tooltip
                                                        mouseEnterDelay={0.2}
                                                        overlayInnerStyle={tooltipStyle}
                                                        title={
                                                            <div style={tooltipContentStyle}>
                                                                <Typography.Text strong style={tooltipTitleStyle}>
                                                                    Axtarış səbəbi:
                                                                </Typography.Text>
                                                                <br />
                                                                <Typography.Text style={tooltipTextStyle}>{data.wantedDescription || 'Qeyd edilməyib'}</Typography.Text>
                                                            </div>
                                                        }
                                                    >
                                                        <Icons.InfoCircleOutlined style={iconStyle} />
                                                    </Tooltip>
                                                )}
                                            </Space>
                                            {can('wanted_parcel') && (
                                                <Button type='primary' size='small' loading={isTogglingWanted} onClick={handleToggleWantedStatus} ghost>
                                                    {data.isWanted ? 'Axtarışdan çıxar' : 'Axtarışa ver'}
                                                </Button>
                                            )}
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
                                            <Button type='text' disabled={!data.lastBox?.id} onClick={openContainerTransfersModal} icon={<Icons.HistoryOutlined />} />
                                            {data.lastBox ? (
                                                <Tooltip title={data.status.id === 10 ? 'Köhnə yeşik' : undefined}>
                                                    <Tag color={data.status.id === 10 ? 'success' : undefined}>{data.lastBox.name}</Tag>
                                                </Tooltip>
                                            ) : (
                                                <Typography.Text>Qeyd olunmayıb</Typography.Text>
                                            )}
                                            {data.box && can('remove_parcel_from_container') && (
                                                <Button type='primary' onClick={handleRemoveFromContainer} icon={<Icons.DeleteOutlined />} size='small' ghost danger>
                                                    Yeşikdən çıxar
                                                </Button>
                                            )}
                                        </Space>
                                    </DetailDescriptions.Item>
                                </DetailDescriptions>
                            </DetailCard>
                        </DetailCol>
                        {hasTrendyolLogs && (
                            <DetailCol xs={24}>
                                <DetailCard title='United Məhsul'>
                                    <DetailDescriptions>
                                        <DetailDescriptions.Item label='Məhsul adı'>{data.trendyolLogs?.name || 'Qeyd olunmayıb'}</DetailDescriptions.Item>
                                        <DetailDescriptions.Item label='Kateqoriya'>{data.trendyolLogs?.category || 'Qeyd olunmayıb'}</DetailDescriptions.Item>
                                        <DetailDescriptions.Item label='Maye'>{data.trendyolLogs?.isLiquid ? 'Bəli' : 'Xeyr'}</DetailDescriptions.Item>
                                        <DetailDescriptions.Item label='Qapıda təhvil'>{data.trendyolLogs?.isDoor ? 'Bəli' : 'Xeyr'}</DetailDescriptions.Item>
                                        <DetailDescriptions.Item label='Növ'>{data.trendyolLogs?.type || 'Qeyd olunmayıb'}</DetailDescriptions.Item>
                                        <DetailDescriptions.Item label='Micro'>{data.trendyolLogs?.isMicro ? 'Bəli' : 'Xeyr'}</DetailDescriptions.Item>
                                        <DetailDescriptions.Item label='İnvoys qiyməti'>
                                            {data.trendyolLogs?.invoice.invoicePrice}
                                            <a target='_blank' href={data.trendyolLogs?.invoice.invoiceUrl} rel='noreferrer noopener'>
                                                {' '}
                                                PDF
                                            </a>
                                        </DetailDescriptions.Item>
                                        <DetailDescriptions.Item label='SKU'>{data.trendyolLogs?.products.sku || 'Qeyd olunmayıb'}</DetailDescriptions.Item>
                                        <DetailDescriptions.Item label='Provayder trak kod'>{data.trendyolLogs?.trendyolDeliveryNumber || 'Qeyd olunmayıb'}</DetailDescriptions.Item>
                                        <DetailDescriptions.Item label='Vahidin qiyməti'>{data.trendyolLogs?.unitPrice || 'Qeyd olunmayıb'}</DetailDescriptions.Item>
                                        <DetailDescriptions.Item label='Sayı'>{data.trendyolLogs?.quantity || 'Qeyd olunmayıb'}</DetailDescriptions.Item>
                                        <DetailDescriptions.Item label='State'>{data.trendyolLogs?.state || 'Qeyd olunmayıb'}</DetailDescriptions.Item>
                                        <DetailDescriptions.Item label='Parcel id'>{data.trendyolLogs?.parcelId || 'Qeyd olunmayıb'}</DetailDescriptions.Item>
                                        <DetailDescriptions.Item label='UIDs'>{data.trendyolLogs?.uid || 'Qeyd olunmayıb'}</DetailDescriptions.Item>
                                        <DetailDescriptions.Item label='Gömrük vəziyyəti'>{trendyolCustomsStatusName || 'Qeyd olunmayıb'}</DetailDescriptions.Item>
                                    </DetailDescriptions>
                                </DetailCard>
                            </DetailCol>
                        )}
                    </DetailRow>
                </DetailCol>

                <DetailCol xs={24} lg={12}>
                    <DetailRow>
                        <DetailCol xs={24}>
                            <DetailCard title='Qiymətlər'>
                                <DetailDescriptions>
                                    <DetailDescriptions.Item label='Məhsulun qiyməti'>
                                        {data.price ? `${data.price.toFixed(2)} ${data.currency ? getCurrencySymbol(data.currency) : getCurrencySymbolByCountryId(data.countryId)}` : 'Qeyd olunmayıb'}
                                    </DetailDescriptions.Item>
                                    <DetailDescriptions.Item label='Çatdırılma qiyməti'>
                                        {data.deliveryPrice ? `${data.deliveryPrice.toFixed(2)} ${CurrencySymbols.USD}` : 'Qeyd olunmayıb'}
                                    </DetailDescriptions.Item>
                                    <DetailDescriptions.Item label='Ödənilmə statusu'>
                                        {data.paid ? 'Ödənilib' : 'Ödənilməyib'}
                                    </DetailDescriptions.Item>
                                    <DetailDescriptions.Item label='Kupon'>{data.couponId ? CouponTags[data.couponId] : '-'}</DetailDescriptions.Item>
                                </DetailDescriptions>
                            </DetailCard>
                        </DetailCol>
                        <DetailCol xs={24}>
                            <DetailCard title='Ölçülər'>
                                <DetailDescriptions>
                                    <DetailDescriptions.Item label='Çəki'>
                                        {data.weight ? `${data.weight.toFixed(2)} kq` : 'Qeyd olunmayıb'}
                                    </DetailDescriptions.Item>
                                    <DetailDescriptions.Item label='Volumn'>{data.trendyolLogs?.volume || 'Qeyd olunmayıb'}</DetailDescriptions.Item>
                                    <DetailDescriptions.Item label='En'>
                                        {data.depth ? `${data.depth.toFixed(2)} sm` : 'Qeyd olunmayıb'}
                                    </DetailDescriptions.Item>
                                    <DetailDescriptions.Item label='Uzunluq'>
                                        {data.width ? `${data.width.toFixed(2)} sm` : 'Qeyd olunmayıb'}
                                    </DetailDescriptions.Item>
                                    <DetailDescriptions.Item label='Hündürlük'>
                                        {data.height ? `${data.height.toFixed(2)} sm` : 'Qeyd olunmayıb'}
                                    </DetailDescriptions.Item>
                                </DetailDescriptions>
                            </DetailCard>
                        </DetailCol>
                        <DetailCol xs={24}>
                            <DetailCard title='Yerləşmə'>
                                <DetailDescriptions>
                                    {data.branch && (
                                        <DetailDescriptions.Item label='Filial'>{data.branch.name || 'Qeyd olunmayıb'}</DetailDescriptions.Item>
                                    )}
                                    <DetailDescriptions.Item label='Uçuş'>
                                        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                                            <Row>
                                                <Col span={24}>
                                                    <Typography.Text>{data.flight?.name || 'Qeyd olunmayıb'}</Typography.Text>
                                                </Col>
                                                {data.bbs?.user && (
                                                    <Col span={24}>
                                                        <Typography.Text style={{ fontStyle: 'italic', fontSize: 12 }}>
                                                            {data.bbs.user} tərəfindən {data.bbs.date}
                                                        </Typography.Text>
                                                    </Col>
                                                )}
                                            </Row>
                                            {can('take_of_from_flight') && (
                                                <Button type='primary' onClick={removeFromFlight} icon={<Icons.DeleteOutlined />} size='small' ghost disabled={!data.flight?.name}>
                                                    Uçuşdan çıxar
                                                </Button>
                                            )}
                                        </Space>
                                    </DetailDescriptions.Item>
                                    <DetailDescriptions.Item label='Filial göndərişi'>
                                        <Row>
                                            <Col span={24}>
                                                <Typography.Text>
                                                    {data.parcelSorting?.id ? `${data.parcelSorting.id} (${data.parcelSorting.state_name ?? ''})` : 'Çeşidlənməyib'}
                                                </Typography.Text>
                                            </Col>
                                            <Col span={24}>
                                                <Typography.Text style={{ fontStyle: 'italic', fontSize: 12 }}>{data.parcelSorting?.created_at}</Typography.Text>
                                            </Col>
                                        </Row>
                                    </DetailDescriptions.Item>
                                </DetailDescriptions>
                            </DetailCard>
                        </DetailCol>
                        {hasTrendyolLogs && (
                            <DetailCol xs={24}>
                                <DetailCard title='United Müştəri'>
                                    <DetailDescriptions>
                                        <DetailDescriptions.Item label='Tam adı'>{data.trendyolLogs?.fullName || 'Qeyd olunmayıb'}</DetailDescriptions.Item>
                                        <DetailDescriptions.Item label='FIN Kod'>
                                            {!pinCodeEditing ? (
                                                <Space align='center' size={6}>
                                                    <Typography.Text>{data.trendyolLogs?.pinCode || 'Qeyd olunmayıb'}</Typography.Text>
                                                    {can('parcel_pin_change') && <Button type='text' icon={<Icons.EditOutlined />} onClick={onTogglePinCodeEditing} />}
                                                </Space>
                                            ) : (
                                                <>
                                                    <Form form={form} onFinish={(values) => onPinCodeSubmit(values, data.trendyol === 2)} layout='inline' initialValues={{ pincode: data.trendyolLogs?.pinCode }}>
                                                        <Form.Item name='pincode'>
                                                            <Input />
                                                        </Form.Item>
                                                    </Form>
                                                    <Typography.Text style={{ fontSize: 12 }} type='secondary'>
                                                        FİN kod düzəlişi bir neçə dəqiqə ərzində icra edilir.
                                                    </Typography.Text>
                                                </>
                                            )}
                                        </DetailDescriptions.Item>
                                        <DetailDescriptions.Item label='Müştəri qeydi'>{data.trendyolLogs?.comment || 'Qeyd olunmayıb'}</DetailDescriptions.Item>
                                        <DetailDescriptions.Item label='Telefon nömrəsi'>{data.trendyolLogs?.phoneNumber || 'Qeyd olunmayıb'}</DetailDescriptions.Item>
                                        <DetailDescriptions.Item label='Yaradılma tarixi'>{data.trendyolLogs?.createdAt || 'Qeyd olunmayıb'}</DetailDescriptions.Item>
                                        <DetailDescriptions.Item label='Email'>{data.trendyolLogs?.emailAddress || 'Qeyd olunmayıb'}</DetailDescriptions.Item>
                                        <DetailDescriptions.Item label='ZIP Kod'>{data.trendyolLogs?.zipCode || 'Qeyd olunmayıb'}</DetailDescriptions.Item>
                                        <DetailDescriptions.Item label='Filial kodu'>{data.trendyolLogs?.warehouseId || 'Qeyd olunmayıb'}</DetailDescriptions.Item>
                                        <DetailDescriptions.Item label='Xarici karqo'>{data.trendyolLogs?.domesticCargoCompany || 'Qeyd olunmayıb'}</DetailDescriptions.Item>
                                        <DetailDescriptions.Item label='Şəhər'>{data.trendyolLogs?.city || 'Qeyd olunmayıb'}</DetailDescriptions.Item>
                                        <DetailDescriptions.Item label='SMS sayı'>{data.trendyolLogs?.smsCount || 'Qeyd olunmayıb'}</DetailDescriptions.Item>
                                        <DetailDescriptions.Item label='SMS tarix'>{data.trendyolLogs?.smsDate || 'Qeyd olunmayıb'}</DetailDescriptions.Item>
                                        <DetailDescriptions.Item label='Müştəri ünvanı'>{data.trendyolLogs?.shippingAddress || 'Qeyd olunmayıb'}</DetailDescriptions.Item>
                                    </DetailDescriptions>
                                </DetailCard>
                            </DetailCol>
                        )}
                        {(data.trendyol === 1 || data.trendyol === 2) && (
                            <DetailCol xs={24}>
                                <Table size='small' rowKey='_id' pagination={false} dataSource={parcelStates} title={() => <h4>United Status dəyişiklikləri</h4>} bordered>
                                    <Table.Column title='Id' key='_id' dataIndex='_id' width={100} />
                                    <Table.Column title='Author' key='author' dataIndex='author' />
                                    <Table.Column title='State' key='state' dataIndex='state' />
                                    <Table.Column title='Comment' key='comment' dataIndex='comment' />
                                    <Table.Column title='Created At' key='createdAt' dataIndex='createdAt' />
                                </Table>
                            </DetailCol>
                        )}
                    </DetailRow>
                </DetailCol>

                <DetailCol xs={24}>
                    <DetailCard title='Açıqlama'>{data.description || 'Qeyd olunmayıb'}</DetailCard>
                </DetailCol>

                <DetailCol xs={24}>
                    <Collapse bordered={false} activeKey={isAccordionOpen ? ['customs-status'] : []} onChange={handleAccordionChange} collapsible={customsStatus.isLoading ? 'disabled' : undefined}>
                        <Collapse.Panel header={getAccordionHeader()} key='customs-status'>
                            {!customsStatus.isLoading && customsStatus.isSuccess && (
                                <DetailRow style={{ backgroundColor: '#fff', paddingTop: '1rem' }}>
                                    <DetailCol xs={24} style={{ display: 'flex', marginBottom: 0, justifyContent: 'center', gap: '0.5rem' }}>
                                        <Typography.Title level={5} style={{ margin: 0 }}>DGK statusu</Typography.Title>
                                        <Button onClick={openCustomsStatusModal} type='text' icon={<Icons.FileSearchOutlined />} />
                                    </DetailCol>
                                    <DetailCol xs={24} style={{ marginTop: 0, textAlign: 'center' }}>
                                        <Typography.Text strong>{customStatusName}</Typography.Text>
                                    </DetailCol>
                                    <DetailCol xs={24}>
                                        <div style={{ padding: '1.5rem 1rem' }}>
                                            <Steps current={typeof customsStatus.data?.customsStatus === 'number' ? customsStatus.data.customsStatus : -1} responsive progressDot>
                                                <Steps.Step title='Əlavə edilib' description='Karqo şirkəti bağlamanı əlavə edib' />
                                                <Steps.Step title='Bəyan edilib' description='Müştəri bağlamanı bəyan edib' />
                                                <Steps.Step title='Kolilənib' description='Bağlamalar kolilərə yığılıb' />
                                                <Steps.Step title='Depesh göndərilib' description='Depesh sorğusu göndərilib' />
                                            </Steps>
                                        </div>
                                    </DetailCol>
                                </DetailRow>
                            )}
                        </Collapse.Panel>
                    </Collapse>
                </DetailCol>
            </DetailRow>

            <Modal width={992} title='Yeşik transferləri' open={isContainerTransfersModalVisible} onCancel={closeContainerTransfersModal} footer={null}>
                {boxTransfersFetch && (
                    <NextTableProvider key={`declaration-${data.id}-transfers`} context={BoxTransfersTableContext} onFetch={boxTransfersFetch} name='declaration-box-transfers-table' useCache={false}>
                        <BoxTransfersTable />
                    </NextTableProvider>
                )}
            </Modal>

            <Modal width={800} title='DGK Statusu' open={customsStatusModalOpen} onCancel={closeCustomsStatusModal} footer={null}>
                <ReactJson src={customsStatus.data?.json || {}} />
                <List
                    size='small'
                    header={<Typography.Text>Birbaşa gömrükdən gələn cavabdır və status parametrinin izahı aşağıdakı kimidir.</Typography.Text>}
                    dataSource={customsStatesInfo}
                    renderItem={(item) => (
                        <List.Item>
                            <Typography.Text type='secondary'>
                                {item.id} - {item.label}
                            </Typography.Text>
                        </List.Item>
                    )}
                />
            </Modal>

            <Modal width={800} title='DGK cavabı' open={isCustomsRawModalOpen} onCancel={closeCustomsRawModal} footer={null} bodyStyle={{ backgroundColor: '#ffffff' }}>
                <div style={{ backgroundColor: '#ffffff', color: '#000' }}>
                    <ReactJson src={data.customsData?.raw_data || {}} />
                </div>
            </Modal>

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

            <Formik initialValues={initialValues} enableReinitialize onSubmit={() => {}}>
                {({ values, setErrors, handleReset, handleChange, handleBlur }) => (
                    <Modal open={commercialModalOpen} onCancel={closeCommercialModal} onOk={() => addCommercialVoen(values, setErrors, handleReset)} title='Kommersial bəyan'>
                        <Form layout='vertical' component='div' size='large'>
                            <Row gutter={[24, 0]}>
                                <Col lg={24} md={24}>
                                    <Form.Item label='Bağlama'>
                                        <Input name='declarationId' value={values.declarationId} disabled placeholder='Bağlama kodunu daxil edin...' />
                                    </Form.Item>
                                </Col>
                                <Col lg={24} md={24}>
                                    <Form.Item label='Avia Qaimə'>
                                        <Input name='awb' value={values.awb} onChange={handleChange} onBlur={handleBlur} placeholder='Avia Qaimə kodunu daxil edin...' />
                                    </Form.Item>
                                </Col>
                                <Col lg={24} md={24}>
                                    <Form.Item label='VÖEN'>
                                        <Input name='voen' value={values.voen} onChange={handleChange} onBlur={handleBlur} placeholder='VÖEN daxil edin...' />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </Modal>
                )}
            </Formik>
        </DetailPage>
    );
};
