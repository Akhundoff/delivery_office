import { FC, useCallback, useState } from 'react';
import { Alert, Button, Checkbox, Col, Input, Result, Row, Select, Space, Table, Typography } from 'antd';
import * as Icons from '@ant-design/icons';
import { PageContent } from '@shared/styled/page-content';
import { filterOption } from '@shared/modules/antd/helpers/filter-option';
import { useBranches } from '@modules/branches';
import { useBoxAcceptance } from '../hooks';

export const BoxAcceptancePage: FC = () => {
  const branches = useBranches();
  const {
    myBox,
    boxes,
    barcodeInputRef,
    tableData,
    type,
    setType,
    isSubmitting,
    isRequiredDeclarationExist,
    handleBarcodeSearch,
    removeBarcode,
    resetBarcodes,
    handleCloseBox,
    handleTransferBox,
    handleSelectBox,
  } = useBoxAcceptance();

  const [branchId, setBranchId] = useState('');

  const filteredBoxes = boxes.data?.filter((b) => !branchId || b.branch?.id?.toString() === branchId);

  const renderRemove = useCallback((id: number) => <Button size="small" danger icon={<Icons.DeleteOutlined />} onClick={() => removeBarcode(id)} />, [removeBarcode]);

  if (myBox.data) {
    return (
      <PageContent>
        <Typography.Title level={4}>
          #{myBox.data.id} - {myBox.data.name}
        </Typography.Title>
        {isRequiredDeclarationExist && <Alert type="warning" showIcon message="Bəyansız bağlamalar var." style={{ marginBottom: 16 }} />}
        <Row gutter={[24, 24]}>
          <Col xs={{ span: 24, order: 2 }} lg={{ span: 12, order: 1 }}>
            <div style={{ maxWidth: 400, padding: '24px 0', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Input.Search ref={barcodeInputRef} onSearch={handleBarcodeSearch} autoFocus style={{ marginTop: 24 }} placeholder="İzləmə kodunu daxil edin..." enterButton="Əlavə et" />
            </div>
            <Space>
              <Typography.Text type="secondary">TEMU bağlamaları bəyansız olarsa yeşiyə əlavə edilmir.</Typography.Text>
            </Space>
          </Col>
          <Col xs={{ span: 24, order: 1 }} lg={{ span: 12, order: 2 }}>
            <Table
              dataSource={tableData}
              rowKey="id"
              size="small"
              bordered
              rowClassName={(r) => (r.requiresDeclaration ? 'ant-table-row-danger' : '')}
              title={() => (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Checkbox checked={type === 'transfer'} onChange={(e) => setType(e.target.checked ? 'transfer' : 'acceptance')}>
                    Transfer
                  </Checkbox>
                  <Space>
                    <Button type="primary" icon={<Icons.CheckCircleOutlined />} loading={isSubmitting} onClick={() => (type === 'acceptance' ? handleCloseBox() : handleTransferBox())}>
                      Yeşiyi bağla
                    </Button>
                    <Button danger icon={<Icons.ClearOutlined />} onClick={resetBarcodes} disabled={!tableData.length}>
                      Təmizlə
                    </Button>
                  </Space>
                </div>
              )}
            >
              <Table.Column title="No" dataIndex="id" key="id" width={60} />
              <Table.Column title="Barkod" dataIndex="barcode" key="barcode" />
              <Table.Column title="Filial" dataIndex="branchName" key="branchName" />
              <Table.Column title="Uçuş" dataIndex="flightName" key="flightName" />
              <Table.Column key="actions" dataIndex="id" width={40} render={renderRemove} />
            </Table>
          </Col>
        </Row>
      </PageContent>
    );
  }

  return (
    <PageContent>
      <Result
        icon={<Icons.InboxOutlined style={{ fontSize: 64, color: '#1da57a' }} />}
        title={
          <Space>
            <Select
              disabled={branches.isLoading}
              loading={branches.isLoading}
              onChange={setBranchId}
              value={branchId || undefined}
              showSearch
              filterOption={filterOption}
              style={{ width: 200 }}
              placeholder="Filial seçin"
            >
              {branches.data?.map((b) => (
                <Select.Option key={b.id} value={b.id.toString()}>
                  {b.name}
                </Select.Option>
              ))}
            </Select>
            <Select disabled={boxes.isLoading} loading={boxes.isLoading} filterOption={filterOption} onSelect={handleSelectBox} showSearch style={{ width: 200 }} placeholder="Yeşik seçin">
              {filteredBoxes?.map((b) => (
                <Select.Option key={b.id} value={b.id}>
                  {b.name}
                </Select.Option>
              ))}
            </Select>
          </Space>
        }
        subTitle="Bağlamaları qəbul etmək üçün yeşik seçmək zəruridir."
      />
    </PageContent>
  );
};
