import { FC, useCallback } from 'react';
import { Button, Card, Col, Input, Row, Select, Space, Table, Typography } from 'antd';
import * as Icons from '@ant-design/icons';
import { PageContent } from '@shared/styled/page-content';
import { BarcodeScan } from '@shared/components/barcode-scan';
import { useBranchTransferAcceptance } from '../hooks';

export const NewBranchTransfer: FC = () => {
  const {
    openSortingInfo,
    barcodeInputRef,
    disabled,
    checkDisabled,
    onBarcodeSearch,
    lastBarcode,
    tableData,
    branchOptions,
    flightOptions,
    parcelTypeId,
    setParcelTypeId,
    branchId,
    setBranchId,
    flightIds,
    setFlightIds,
    onCreateTransfer,
    resetBarcodes,
    canClearBarcodes,
    removeBarcode,
    selectDisabled,
    parcelTypeOptions,
  } = useBranchTransferAcceptance();

  const title = useCallback(
    () => (
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <Space size={8}>
          <Button disabled={checkDisabled} icon={<Icons.CheckOutlined />} onClick={openSortingInfo}>
            Göndərişi yoxlamaq
          </Button>
          <Button icon={<Icons.ClearOutlined />} danger onClick={resetBarcodes} disabled={!canClearBarcodes}>
            Hamısını boşalt
          </Button>
        </Space>
      </div>
    ),
    [resetBarcodes, canClearBarcodes, openSortingInfo, checkDisabled],
  );

  const renderRemove = useCallback((_: unknown, row: any) => <Button onClick={() => removeBarcode(row)} size="small" danger icon={<Icons.DeleteOutlined />} />, [removeBarcode]);

  return (
    <PageContent>
      <Row>
        <Col xs={{ span: 24, order: 2 }} lg={{ span: 12, order: 1 }}>
          <Row justify="center" align="top" style={{ padding: '48px 0' }}>
            <Col style={{ maxWidth: 400, width: '100%' }}>
              <Row gutter={[0, 24]} justify="start">
                <Col span={24}>
                  <BarcodeScan barcode={lastBarcode?.barcode} />
                </Col>
                <Col span={24}>
                  <Row gutter={[16, 0]}>
                    <Col span={12}>
                      <Select style={{ width: '100%' }} allowClear value={parcelTypeId} placeholder="Bağlama növün seçin..." onChange={setParcelTypeId}>
                        {parcelTypeOptions.map((option) => (
                          <Select.Option value={option.value} key={option.value}>
                            {option.label}
                          </Select.Option>
                        ))}
                      </Select>
                    </Col>
                    <Col span={12}>
                      <Input.Search ref={barcodeInputRef} disabled={disabled || !parcelTypeId} onSearch={onBarcodeSearch} autoFocus placeholder="İzləmə kodunu daxil edin..." />
                    </Col>
                  </Row>
                </Col>
                {!!lastBarcode && (
                  <Col span={24}>
                    <Typography.Text strong>{lastBarcode?.barcode}</Typography.Text>
                  </Col>
                )}
                <Col span={24}>
                  <Row justify="start" gutter={[0, 8]}>
                    <Col xs={24}>
                      <Select style={{ width: '100%' }} disabled={selectDisabled} showSearch optionFilterProp="children" allowClear value={branchId} placeholder="Filial seçin..." onChange={setBranchId}>
                        {branchOptions.map((option) => (
                          <Select.Option value={option.value} key={option.value}>
                            {option.label}
                          </Select.Option>
                        ))}
                      </Select>
                    </Col>
                    <Col xs={24}>
                      <Select style={{ width: '100%' }} showSearch optionFilterProp="children" disabled={selectDisabled} mode="multiple" allowClear value={flightIds} placeholder="Uçuşları seçin..." onChange={setFlightIds}>
                        {flightOptions.map((option) => (
                          <Select.Option value={option.value} key={option.value}>{`${option.value} - ${option.label}`}</Select.Option>
                        ))}
                      </Select>
                    </Col>
                    <Col xs={24}>
                      <Button disabled={selectDisabled} onClick={onCreateTransfer} htmlType="button" type="primary">
                        Göndəriş yaratmaq
                      </Button>
                    </Col>
                  </Row>
                </Col>
                <Col span={24}>
                  <Card title="Qaydalar" style={{ backgroundColor: '#eef4ff', borderRadius: 6 }} size="small">
                    <Typography.Paragraph style={{ fontSize: 14 }}>
                      ✅&nbsp;&nbsp; Eyni uçuş və eyni filial üçün yalnız <Typography.Text strong>bir dəfə</Typography.Text> göndəriş yaradıla bilər.
                    </Typography.Paragraph>
                    <Typography.Paragraph style={{ fontSize: 14 }}>
                      📦&nbsp;&nbsp; Bağlama əlavə edildikdə onun uçuşları <Typography.Text strong>avtomatik təyin olunur</Typography.Text>.
                    </Typography.Paragraph>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
        <Col xs={{ span: 24, order: 1 }} lg={{ span: 12, order: 2 }}>
          <Table title={title} rowKey="id" dataSource={tableData} size="small" bordered pagination={{ hideOnSinglePage: true }}>
            <Table.Column title="No" key="id" dataIndex="id" width={80} />
            <Table.Column title="Barkod" key="barcode" dataIndex="barcode" />
            <Table.Column title="Göndəriş №" key="parcel_sorting_id" dataIndex="parcel_sorting_id" />
            <Table.Column title="Eyni uçuş" key="checked" dataIndex="checked" render={(val) => <Icons.CheckSquareOutlined style={{ color: val ? 'green' : 'red' }} />} />
            <Table.Column key="remove" dataIndex="barcode" width={1} render={renderRemove} />
          </Table>
        </Col>
      </Row>
    </PageContent>
  );
};
