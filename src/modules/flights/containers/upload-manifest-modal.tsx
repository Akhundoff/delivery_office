import { FC, useState } from 'react';
import { Alert, Button, Col, Descriptions, Modal, Row, Upload, message } from 'antd';
import * as Icons from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { FlightsService } from '../services';

type ManifestResult = {
  file: string;
  bags: { empty: number; full: number; all: number };
  declarations: { found: number; notFound: number };
};

export const UploadManifestModal: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ManifestResult | null>(null);

  const handleUpload = async (file: File) => {
    setLoading(true);
    setError(null);
    setResult(null);
    const res = await FlightsService.uploadManifest(id!, file);
    setLoading(false);
    if (res.status === 200) {
      message.success('Manifest yükləndi.');
      setResult(res.data as ManifestResult);
    } else {
      setError(res.data as string);
    }
    return false;
  };

  return (
    <Modal open={true} onCancel={() => navigate(`/flights/${id}`)} footer={null} title='Kisələrlə toplu manifest' width={576}>
      <Row gutter={[16, 16]}>
        {error && (
          <Col xs={24}>
            <Alert message={error} type='error' showIcon />
          </Col>
        )}
        <Col xs={24}>
          <Upload beforeUpload={handleUpload} fileList={[]} multiple={false} disabled={loading}>
            <Button disabled={loading} loading={loading} icon={<Icons.UploadOutlined />}>
              Sənədi yüklə
            </Button>
          </Upload>
        </Col>
        {result && (
          <Col xs={24}>
            <Descriptions column={1} size='small' bordered>
              <Descriptions.Item label='Ümumi kisələr'>{result.bags.all} ədəd</Descriptions.Item>
              <Descriptions.Item label='Dolu kisələr'>{result.bags.full} ədəd</Descriptions.Item>
              <Descriptions.Item label='Boş kisələr'>{result.bags.empty} ədəd</Descriptions.Item>
              <Descriptions.Item label='Tapılan bağlamalar'>{result.declarations.found} ədəd</Descriptions.Item>
              <Descriptions.Item label='Tapılmayan bağlamalar'>{result.declarations.notFound} ədəd</Descriptions.Item>
              <Descriptions.Item label='Manifest'>
                <a href={result.file} target='_blank' rel='noopener noreferrer'>
                  <Button icon={<Icons.CloudDownloadOutlined />}>Sənədi endir</Button>
                </a>
              </Descriptions.Item>
            </Descriptions>
          </Col>
        )}
      </Row>
    </Modal>
  );
};
