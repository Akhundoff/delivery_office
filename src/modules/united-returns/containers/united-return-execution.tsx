import { FC, useCallback, useContext } from 'react';
import { Button, Checkbox, Col, Input, Row, Space, Table, Typography } from 'antd';
import * as Icons from '@ant-design/icons';
import { PageContent } from '@shared/styled/page-content';
import { BarcodeScan } from '@shared/components/barcode-scan';
import { MeContext } from '@modules/me/context/context';
import { useUnitedReturnExecution } from '../hooks';

export const UnitedReturnExecution: FC = () => {
  const { can } = useContext(MeContext);
  const { barcodeInputRef, disabled, onBarcodeSearch, lastBarcode, data, isFetching, onFinish, transferType, onTransferTypeSwitch } = useUnitedReturnExecution();

  const title = useCallback(
    () => (
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <Space size={8}>
          {can('united_returns.finish') && (
            <Button icon={<Icons.ClearOutlined />} danger onClick={onFinish}>
              Unitedə göndər
            </Button>
          )}
        </Space>
      </div>
    ),
    [onFinish, can],
  );

  return (
    <PageContent>
      <Row>
        <Col xs={{ span: 24, order: 2 }} lg={{ span: 12, order: 1 }}>
          <div style={{ maxWidth: 400, padding: '48px 0', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <BarcodeScan barcode={lastBarcode} />
            <Input.Search ref={barcodeInputRef} disabled={disabled} onSearch={onBarcodeSearch} autoFocus style={{ marginTop: 24 }} placeholder="Barkod daxil edin..." />
            {can('united_returns.finish') && (
              <Space align="center" direction="vertical">
                <Checkbox disabled={disabled} checked={transferType} onChange={(e) => onTransferTypeSwitch(e.target.checked)} style={{ marginTop: 16 }}>
                  Depoya qəbul
                </Checkbox>
                <Typography.Paragraph type="secondary">Öz filialınıza dəyişmək üçün Depoya qəbul yanılı olmalıdır.</Typography.Paragraph>
              </Space>
            )}
            {!!lastBarcode && (
              <Typography.Text strong style={{ marginTop: 4 }}>
                {lastBarcode}
              </Typography.Text>
            )}
          </div>
        </Col>
        <Col xs={{ span: 24, order: 1 }} lg={{ span: 12, order: 2 }}>
          <Table pagination={{ hideOnSinglePage: true }} loading={isFetching} title={title} rowKey="id" dataSource={data} size="small" bordered>
            <Table.Column title="No" key="id" dataIndex="id" width={100} />
            <Table.Column title="Barkod" key="barcode" dataIndex="barcode" />
            <Table.Column title="Filial" key="branch" dataIndex={['branch', 'name']} />
            <Table.Column title="Çəki" key="weight" dataIndex="weight" />
          </Table>
        </Col>
      </Row>
    </PageContent>
  );
};
