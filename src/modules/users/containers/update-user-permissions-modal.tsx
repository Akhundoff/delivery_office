import { FC } from 'react';
import { Card, Col, Form, Modal, Row, Select, Spin, Switch, Typography, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useUserPermissions } from '../hooks';

export const UpdateUserPermissionsModal: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const close = () => navigate(-1);

  const {
    operations, cashboxes, companies, branches,
    operationIds, cashboxId, adminBranchId, companyId,
    isSelf, setCashboxId, setAdminBranchId, setCompanyId, toggleOperation,
    submit, isLoading, submitting,
  } = useUserPermissions(id!);

  const onOk = async () => {
    const result = await submit();
    if (result.status === 200) {
      message.success('İcazələr yadda saxlandı.');
      close();
    } else {
      message.error(result.data as string);
    }
  };

  return (
    <Modal
      open={true}
      onCancel={close}
      onOk={onOk}
      confirmLoading={submitting}
      title='İcazələr'
      width={768}
      okText='Yadda saxla'
      cancelText='Ləğv et'
    >
      {isLoading ? (
        <Spin />
      ) : (
        <Form layout='vertical' component='div'>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item label='Kassa'>
                <Select allowClear value={cashboxId} onChange={setCashboxId} placeholder='Kassa seçin...'>
                  {cashboxes.map((c: any) => (
                    <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label='Şirkət'>
                <Select allowClear value={companyId} onChange={setCompanyId} placeholder='Şirkət seçin...'>
                  {companies.map((c: any) => (
                    <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label='Filial'>
                <Select allowClear value={adminBranchId} onChange={setAdminBranchId} placeholder='Filial seçin...'>
                  {branches.map((b: any) => (
                    <Select.Option key={b.id} value={b.id}>{b.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <div style={{ columns: 2, columnGap: 16 }}>
            {operations.map((group) => (
              <div key={group.id} style={{ breakInside: 'avoid', marginBottom: 16 }}>
                <Card size='small' title={group.name}>
                  {group.operations.map((op) => (
                    <div key={op.id} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                      <Typography.Text style={{ flex: 1 }}>{op.name}</Typography.Text>
                      <Switch
                        checked={operationIds.includes(op.id)}
                        onChange={() => toggleOperation(op.id)}
                        size='small'
                        disabled={isSelf && op.codeName === 'changeuserpermissions'}
                      />
                    </div>
                  ))}
                </Card>
              </div>
            ))}
          </div>
        </Form>
      )}
    </Modal>
  );
};
