import { FC, useEffect, useMemo, useState } from 'react';
import { Alert, Button, Card, Checkbox, Col, Descriptions, Divider, Input, InputNumber, Modal, Row, Space, Spin, Statistic, Tag, Typography, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { MinusOutlined, PlusOutlined, WalletOutlined } from '@ant-design/icons';
import { DeclarationsService } from '../services';
import { DeclarationsTableContext } from '../context';
import { useContext } from 'react';

const fmt = (n: number | undefined) => (n != null ? n.toFixed(2) : '0.00');

export const HandoverDeclarationModal: FC = () => {
  const { id } = useParams<{ id: string }>();
  const ids = useMemo(() => id!.split(','), [id]);
  const navigate = useNavigate();
  const close = () => navigate(-1);
  const { handleFetch } = useContext(DeclarationsTableContext);

  const [smallPackage, setSmallPackage] = useState(0);
  const [mediumPackage, setMediumPackage] = useState(0);
  const [bigPackage, setBigPackage] = useState(0);
  const [terminalAmount, setTerminalAmount] = useState('');
  const [cashAmount, setCashAmount] = useState('');
  const [amountToBeBorrowed, setAmountToBeBorrowed] = useState('');
  const [handoverPreparations, setHandoverPreparations] = useState(true);
  const [handover, setHandover] = useState(false);
  const [redirectToBalance, setRedirectToBalance] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { data: details, isLoading } = useQuery(
    ['handover-details', id, smallPackage, mediumPackage, bigPackage],
    () =>
      DeclarationsService.getHandoverDetails(ids, {
        small_package: String(smallPackage),
        medium_package: String(mediumPackage),
        big_package: String(bigPackage),
      }).then((r) => (r.status === 200 ? r.data : null)),
    { enabled: !!id, keepPreviousData: true },
  );

  const totalAmount = details?.debt.all.azn ?? 0;

  useEffect(() => {
    const azn = details?.debt.all.azn;
    if (azn != null) setCashAmount(fmt(azn));
  }, [details?.debt.all.azn]);

  useEffect(() => {
    const terminal = parseFloat(terminalAmount) || 0;
    const cash = Math.max(0, Math.round((totalAmount - terminal) * 100) / 100);
    setCashAmount(fmt(cash));
  }, [terminalAmount, totalAmount]);

  useEffect(() => {
    if (handoverPreparations) setHandover(false);
    else setHandover(true);
  }, [handoverPreparations]);

  const amountToGiveBack = useMemo(() => {
    const borrowed = parseFloat(amountToBeBorrowed) || 0;
    return borrowed - totalAmount;
  }, [amountToBeBorrowed, totalAmount]);

  const handleOk = async () => {
    setSubmitting(true);
    const result = await DeclarationsService.handover(ids, {
      cash: cashAmount,
      terminal: terminalAmount || '0',
      accepted: handover,
      handover_task: handoverPreparations,
      redirect_to_balance: redirectToBalance,
      small_package: String(smallPackage),
      medium_package: String(mediumPackage),
      big_package: String(bigPackage),
      confirm: true,
    });
    setSubmitting(false);
    if (result.status === 200) {
      message.success('Təhvil uğurla tamamlandı.');
      handleFetch();
      close();
    } else {
      const errMsg =
        typeof result.data === 'object'
          ? Object.values(result.data as object)
              .flat()
              .join('. ')
          : String(result.data);
      message.error(errMsg || 'Xəta baş verdi.');
    }
  };

  const totalUsd = details?.debt.total.usd ?? 0;

  return (
    <Modal
      open={true}
      onCancel={close}
      onOk={handleOk}
      confirmLoading={submitting}
      title={
        <Space>
          <Typography.Text strong>Bağlamaları təhvil ver</Typography.Text>
          {totalUsd > 0.03 && (
            <Tag color="error" icon={<WalletOutlined />}>
              Ödəniş tələb edilir
            </Tag>
          )}
        </Space>
      }
      okText="Təsdiq et"
      cancelText="İmtina"
      width={720}
    >
      {isLoading && <Spin />}
      {details && (
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          {totalUsd > 0.03 && (
            <Alert
              banner
              type="error"
              showIcon
              message={
                <Typography.Text strong style={{ fontSize: 15 }}>
                  DİQQƏT! ÖDƏNIŞ TƏLƏB EDİLİR — {fmt(details.debt.total.usd)} $ ({fmt(details.debt.total.azn)} ₼)
                </Typography.Text>
              }
            />
          )}

          <Row gutter={12}>
            <Col xs={24} lg={14}>
              <Card size="small" title="Ödəniş xülasəsi">
                <Descriptions bordered column={1} size="small">
                  <Descriptions.Item label="Sifariş">
                    {fmt(details.ordersPrice.try)} ₺ / {fmt(details.ordersPrice.azn)} ₼
                  </Descriptions.Item>
                  <Descriptions.Item label="Bağlama">
                    {fmt(details.deliveryPrice.usd)} $ / {fmt(details.deliveryPrice.azn)} ₼
                  </Descriptions.Item>
                  <Descriptions.Item label="Borc">
                    {fmt(details.debt.total.usd)} $ / {fmt(details.debt.total.azn)} ₼
                  </Descriptions.Item>
                  <Descriptions.Item label="Paket qiyməti">{fmt(details.debt.all.package)} ₼</Descriptions.Item>
                  <Descriptions.Item label={<Typography.Text strong>Cəmi ödəniləcək</Typography.Text>}>
                    <Button type="link" size="small" style={{ padding: 0, fontWeight: 600 }} onClick={() => setTerminalAmount('')}>
                      {fmt(details.debt.all.azn)} ₼
                    </Button>
                  </Descriptions.Item>
                  <Descriptions.Item label="Minimal ödəniləcək">
                    <Button type="link" size="small" style={{ padding: 0 }} onClick={() => setTerminalAmount(fmt(totalAmount - details.debt.minimum.azn))}>
                      {fmt(details.debt.minimum.azn)} ₼
                    </Button>
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>
            <Col xs={24} lg={10}>
              <Card size="small" title="Balans">
                <Statistic title="ABŞ Dolları" value={details.balance.usd} precision={2} prefix="$" valueStyle={{ color: '#3f8600', fontSize: 18 }} />
                <Divider style={{ margin: '8px 0' }} />
                <Statistic title="Türk Lirəsi" value={details.balance.try} precision={2} prefix="₺" valueStyle={{ color: '#cf1322', fontSize: 18 }} />
              </Card>
            </Col>
          </Row>

          <Card size="small" title="Ödəniş detalları">
            <Row gutter={12}>
              <Col xs={24} sm={8}>
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  Nağd 💵
                </Typography.Text>
                <Input value={`${cashAmount} ₼`} disabled style={{ fontWeight: 600, marginTop: 4 }} />
              </Col>
              <Col xs={24} sm={8}>
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  Terminal 💳
                </Typography.Text>
                <Input value={terminalAmount} onChange={(e) => setTerminalAmount(e.target.value)} placeholder="0.00" suffix="₼" style={{ fontWeight: 600, marginTop: 4 }} />
              </Col>
              <Col xs={24} sm={8}>
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  Alınan məbləğ 💸
                </Typography.Text>
                <Input value={amountToBeBorrowed} onChange={(e) => setAmountToBeBorrowed(e.target.value)} placeholder="0.00" suffix="₼" style={{ fontWeight: 600, marginTop: 4 }} />
              </Col>
            </Row>
            {amountToGiveBack !== 0 && (
              <Alert
                style={{ marginTop: 8 }}
                message="Qaytarılmalı məbləğ"
                description={
                  <Typography.Text strong style={{ color: amountToGiveBack > 0 ? 'green' : 'red' }}>
                    {fmt(amountToGiveBack)} ₼
                  </Typography.Text>
                }
                type={amountToGiveBack > 0 ? 'success' : 'warning'}
                showIcon
              />
            )}
          </Card>

          <Card size="small" title="Əməliyyatlar">
            <Row gutter={12}>
              <Col xs={24} md={12}>
                <Space direction="vertical">
                  <Checkbox checked={handover} disabled={!handoverPreparations} onChange={(e) => setHandover(e.target.checked)}>
                    ✓ Təhvil ver
                  </Checkbox>
                  <Checkbox checked={handoverPreparations} onChange={(e) => setHandoverPreparations(e.target.checked)}>
                    🏬 Anbara yönəlt
                  </Checkbox>
                  <Checkbox checked={redirectToBalance} onChange={(e) => setRedirectToBalance(e.target.checked)}>
                    💰 Balans artır
                  </Checkbox>
                </Space>
                {!handoverPreparations && <Alert message="Təhvil sənədi avtomatik çap ediləcək" type="info" showIcon style={{ marginTop: 12, fontSize: 12 }} />}
              </Col>
              <Col xs={24} md={12}>
                <div style={{ background: '#fafafa', padding: '8px 12px', borderRadius: 4 }}>
                  <Typography.Text strong style={{ display: 'block', marginBottom: 8, fontSize: 13 }}>
                    Paket sayı
                  </Typography.Text>
                  {(
                    [
                      ['Böyük', bigPackage, setBigPackage],
                      ['Orta', mediumPackage, setMediumPackage],
                      ['Kiçik', smallPackage, setSmallPackage],
                    ] as [string, number, (v: number) => void][]
                  ).map(([label, val, setter]) => (
                    <Row key={label} align="middle" gutter={8} style={{ marginBottom: 6 }}>
                      <Col flex="55px">
                        <Typography.Text strong style={{ fontSize: 12 }}>
                          {label}:
                        </Typography.Text>
                      </Col>
                      <Col flex="auto">
                        <Space size={0} style={{ display: 'flex' }}>
                          <Button size="small" icon={<MinusOutlined />} disabled={val <= 0} onClick={() => setter(val - 1)} style={{ borderRadius: '4px 0 0 4px' }} />
                          <InputNumber min={0} max={20} value={val} onChange={(v) => setter(v ?? 0)} size="small" style={{ width: 60, borderRadius: 0, textAlign: 'center' }} />
                          <Button size="small" icon={<PlusOutlined />} disabled={val >= 20} onClick={() => setter(val + 1)} style={{ borderRadius: '0 4px 4px 0' }} />
                        </Space>
                      </Col>
                    </Row>
                  ))}
                </div>
              </Col>
            </Row>
          </Card>
        </Space>
      )}
    </Modal>
  );
};
