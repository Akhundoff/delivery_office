import { FC, useState } from 'react';
import { Button, Card, Col, Descriptions, Modal, Result, Row, Spin, Table, Tag, message } from 'antd';
import * as Icons from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { PageContent } from '@shared/styled/page-content';
import { IFlightPackage, IFlightPackageExecution } from '../interfaces';
import { FlightsService } from '../services';
import { useFlightPackages } from '../hooks';

export const FlightPackagesContainer: FC<{ id: string }> = ({ id }) => {
  const navigate = useNavigate();
  const { data, loading, error, fetch } = useFlightPackages(id);
  const [selectedPkg, setSelectedPkg] = useState<number | undefined>();
  const [sentModal, setSentModal] = useState(false);
  const [resultModal, setResultModal] = useState(false);

  const executePackage = async (pkgId: number) => {
    message.loading({ key: 'exec', content: 'Əməliyyat aparılır...', duration: 0 });
    const result = await FlightsService.executePackage(pkgId);
    message.destroy('exec');
    if (result.status === 200) {
      fetch();
      Modal.info({
        width: 768,
        title: `#${pkgId} nömrəli paket`,
        okText: 'Bağla',
        content: (
          <Descriptions size='small' bordered column={1} style={{ marginTop: 24 }}>
            {(result.data as IFlightPackageExecution[]).map((item) => (
              <Descriptions.Item key={item.trackingNumber} label={item.trackingNumber}>
                {item.codeText || item.code}
              </Descriptions.Item>
            ))}
          </Descriptions>
        ),
      });
    } else {
      message.error(result.data as string);
    }
  };

  if (loading) return <Spin style={{ display: 'block', margin: '48px auto' }} />;
  if (error) return <Result status='500' title={error} />;
  if (!data.length) return <Result status='404' title='Məlumat tapılmadı' />;

  const selected = data.find((i) => i.id === selectedPkg);

  return (
    <PageContent>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <Button icon={<Icons.LeftCircleOutlined />} type='text' onClick={() => navigate(`/flights/${id}`)}>
          Geri
        </Button>
        <span style={{ fontWeight: 600 }}>Uçuş #{id} — Bağlanma prosesi ({data.length} paket)</span>
      </div>
      <Row gutter={[16, 16]}>
        {data.map((item: IFlightPackage) => (
          <Col key={item.id} span={24} lg={8}>
            <Card
              size='small'
              title={item.executed ? <Tag color='green'>#{item.id} - İcra edilib</Tag> : <Tag color='red'>#{item.id} - İcra edilməyib</Tag>}
              type='inner'
              bodyStyle={{ padding: 0 }}
              extra={
                <Button icon={<Icons.ReloadOutlined />} size='small' disabled={item.executed} onClick={() => executePackage(item.id)}>
                  İcra et
                </Button>
              }
            >
              <Descriptions size='small' bordered column={1} style={{ margin: -1 }}>
                <Descriptions.Item label='Göndərilmiş'>
                  <Button size='small' type='link' style={{ padding: 0 }} disabled={!item.input.length} onClick={() => { setSelectedPkg(item.id); setSentModal(true); }}>
                    {item.input.length} ədəd
                  </Button>
                </Descriptions.Item>
                <Descriptions.Item label='Qəbul edilmiş'>
                  <Button size='small' type='link' style={{ padding: 0 }} disabled={!item.output.data.length} onClick={() => { setSelectedPkg(item.id); setResultModal(true); }}>
                    {item.output.data.filter(({ code }) => code === '200' || code === '048').length} ədəd
                  </Button>
                </Descriptions.Item>
                <Descriptions.Item label='İcra müddəti'>{item.elapsedTime > 0 ? `${item.elapsedTime.toFixed(2)} saniyə` : 'Növbədədir'}</Descriptions.Item>
                <Descriptions.Item label='Başlama'>{item.startedAt}</Descriptions.Item>
                <Descriptions.Item label='Bitmə'>{item.endedAt}</Descriptions.Item>
                <Descriptions.Item label='Yaradılma'>{item.createdAt}</Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        ))}
      </Row>
      <Modal title='Qəbul edilmiş bağlamalar' width={576} open={resultModal} onCancel={() => setResultModal(false)} footer={null}>
        <Descriptions size='small' bordered column={1} style={{ marginTop: 24 }}>
          {selected?.output.data.map((i) => (
            <Descriptions.Item key={i.trackingNumber} label={i.trackingNumber}>{i.code}</Descriptions.Item>
          ))}
        </Descriptions>
      </Modal>
      <Modal title='Göndərilmiş bağlamalar' width={768} open={sentModal} onCancel={() => setSentModal(false)} footer={null}>
        <Table size='small' bordered dataSource={selected?.input} rowKey='trackingNumber' style={{ marginTop: 24 }}>
          <Table.Column title='İzləmə kodu' dataIndex='trackingNumber' />
          <Table.Column title='Air waybill' dataIndex='airWaybillNumber' />
          <Table.Column title='Depesh' dataIndex='dispatchNumber' />
          <Table.Column title='Reg nömrəsi' dataIndex='regNumber' />
        </Table>
      </Modal>
    </PageContent>
  );
};
