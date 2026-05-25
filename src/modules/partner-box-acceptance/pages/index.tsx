import { FC, useCallback } from 'react';
import { Alert, Button, Col, Input, Row, Select, Space, Switch, Table, Typography, Spin, Result } from 'antd';
import * as Icons from '@ant-design/icons';
import * as Colors from '@ant-design/colors';
import { PageContent } from '@shared/styled/page-content';
import { usePartnerBoxAcceptance } from '../hooks';
import { BoxSelectionModal } from '../components/box-selection-modal';

export const PartnerBoxAcceptancePage: FC = () => {
  const {
    partnerBoxes,
    myPartnerBox,
    tableData,
    duplicatedTrackCodes,
    lastBarcode,
    barcodeType,
    disabled,
    barcodeInputRef,
    canClearBarcodes,
    closeBoxMutation,
    closeError,
    selectBoxMutation,
    isBoxSelectVisible,
    onCloseBoxSelect,
    onSelectBoxId,
    onBarcodeSearch,
    onBarcodeTypeSwitch,
    onSelectPartnerBox,
    removeBarcode,
    resetBarcodes,
    onClosePartnerBox,
  } = usePartnerBoxAcceptance();

  const renderRemove = useCallback((value: number) => (
    <Button onClick={() => removeBarcode(value - 1)} size='small' danger={true} icon={<Icons.DeleteOutlined />} />
  ), [removeBarcode]);

  const title = useCallback(() => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Space size={8}>
        <Button icon={<Icons.CheckCircleOutlined />} onClick={onClosePartnerBox} loading={closeBoxMutation.isLoading} type='primary'>Yeşiyi bağla</Button>
        <Button icon={<Icons.ClearOutlined />} danger={true} onClick={resetBarcodes} disabled={!canClearBarcodes}>Təmizlə</Button>
      </Space>
    </div>
  ), [canClearBarcodes, closeBoxMutation.isLoading, onClosePartnerBox, resetBarcodes]);

  const onRow = useCallback(
    (data: any) => ({
      style:
        closeError?.failedBarcodeIndexes?.includes(data.id - 1) || duplicatedTrackCodes.includes(data.barcode) || data.requires_declaration
          ? { backgroundColor: Colors.red[0] }
          : undefined,
    }),
    [closeError, duplicatedTrackCodes],
  );

  if (myPartnerBox.isLoading || partnerBoxes.isLoading) {
    return <PageContent><Spin style={{ display: 'block', padding: '80px 0', textAlign: 'center' }} /></PageContent>;
  }

  if (myPartnerBox.data) {
    return (
      <PageContent title={`#${myPartnerBox.data.id} - ${myPartnerBox.data.name}`}>
        {closeError && <Alert type='error' showIcon={true} message={closeError.message} style={{ marginBottom: 16 }} />}
        {duplicatedTrackCodes.length > 0 && (
          <Alert type='error' showIcon={true} message={`${duplicatedTrackCodes.length} ədəd təkrar izləmə kodu aşkarlandı`} style={{ marginBottom: 16 }} />
        )}
        <Row gutter={[16, 16]}>
          <Col xs={{ span: 24, order: 2 }} lg={{ span: 12, order: 1 }}>
            <div style={{ maxWidth: 400, padding: '48px 0', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              {lastBarcode && (
                <Typography.Title level={4} style={{ fontFamily: 'monospace', letterSpacing: 2 }}>{lastBarcode.barcode}</Typography.Title>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div>{barcodeType ? 'Trendyol' : 'Findex'}<Switch checked={barcodeType} onChange={onBarcodeTypeSwitch} style={{ marginLeft: 8 }} /></div>
              </div>
              <Input.Search
                ref={barcodeInputRef}
                disabled={disabled}
                onSearch={onBarcodeSearch}
                autoFocus={true}
                style={{ marginTop: 8 }}
                placeholder={barcodeType ? 'United barkodunu oxutdurun' : 'Findex izləmə kodunu daxil edin...'}
                enterButton
              />
              <Typography.Text type='secondary' style={{ fontSize: 12, textAlign: 'center' }}>
                TEMU bağlamaları bəyansız olarsa yeşiyə əlavə edilmir.
              </Typography.Text>
            </div>
          </Col>
          <Col xs={{ span: 24, order: 1 }} lg={{ span: 12, order: 2 }}>
            <Table onRow={onRow} title={title} rowKey='id' dataSource={tableData} size='small' bordered={true}>
              <Table.Column title='No' key='id' dataIndex='id' width={60} />
              <Table.Column title='Barkod' key='barcode' dataIndex='barcode' />
              <Table.Column title='Filial' key='branch_name' dataIndex='branch_name' />
              <Table.Column title='Uçuş' key='flight_name' dataIndex='flight_name' />
              <Table.Column key='actions' dataIndex='id' width={48} render={renderRemove} />
            </Table>
          </Col>
        </Row>
        <BoxSelectionModal visible={isBoxSelectVisible} onClose={onCloseBoxSelect} onOk={onSelectBoxId} />
      </PageContent>
    );
  }

  return (
    <PageContent>
      <Result
        icon={<Icons.InboxOutlined style={{ fontSize: 80, color: '#1da57a' }} />}
        title={
          <Space size={12}>
            <Select
              disabled={selectBoxMutation.isLoading}
              loading={selectBoxMutation.isLoading}
              showSearch
              onSelect={onSelectPartnerBox}
              style={{ width: 224 }}
              placeholder='Yeşik seçin'
              filterOption={(input, option) => String(option?.children || '').toLowerCase().includes(input.toLowerCase())}
            >
              {(partnerBoxes.data || []).map((box) => (
                <Select.Option key={box.id} value={box.id}>{box.name}</Select.Option>
              ))}
            </Select>
          </Space>
        }
        subTitle='Bağlamaları qəbul etmək üçün yeşik seçmək zəruridir.'
      />
    </PageContent>
  );
};
