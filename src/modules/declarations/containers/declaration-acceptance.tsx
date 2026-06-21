import React, { FC, useCallback, useMemo } from 'react';
import { Button, Card, Checkbox, Col, Descriptions, Divider, Form, Input, Row, Space, Spin } from 'antd';
import { Formik } from 'formik';
import { useQuery } from 'react-query';
import { TextField } from '@shared/modules/form/fields/text';
import { CheckboxField } from '@shared/modules/form/fields/checkbox';
import { DeclarationsService } from '../services';
import { useDeclarationAcceptance } from '../hooks';

interface AcceptFormValues {
  wardrobeNumber: string;
  description: string;
  updateStatus: boolean;
}

const DeclarationAcceptForm: FC<{ trackCode: string; onClose: () => void }> = ({ trackCode, onClose }) => {
  const declaration = useQuery(
    ['declaration-acceptance', trackCode],
    async () => {
      const result = await DeclarationsService.getDeclarationByTrackCode({ trackCode });
      if (result.status === 200) return result.data;
      throw new Error(result.data as string);
    },
    { enabled: !!trackCode },
  );

  const initialValues = useMemo<AcceptFormValues>(
    () => ({
      wardrobeNumber: declaration.data?.wardrobeNumber || '',
      description: declaration.data?.description || '',
      updateStatus: true,
    }),
    [declaration.data],
  );

  const onSubmit = useCallback(
    async (values: AcceptFormValues) => {
      if (!declaration.data) return;
      const result = await DeclarationsService.acceptDeclaration(declaration.data.id, values);
      if (result.status === 200) {
        onClose();
      } else {
        const { message } = await import('antd');
        message.error(result.data as string);
      }
    },
    [declaration.data, onClose],
  );

  if (declaration.isLoading) {
    return <Spin style={{ display: 'block', padding: '40px 0', textAlign: 'center' }} />;
  }

  if (!declaration.data) return null;

  const d = declaration.data;

  return (
    <div>
      <Formik initialValues={initialValues} onSubmit={onSubmit} enableReinitialize>
        {({ handleSubmit, isSubmitting }) => (
          <form style={{ maxWidth: 360, margin: '0 auto 24px auto' }} onSubmit={handleSubmit}>
            <Form layout="vertical" component="div">
              <TextField name="wardrobeNumber" item={{ label: 'Şkaf nömrəsi' }} input={{ placeholder: 'Şkaf nömrəsini daxil edin' }} />
              <TextField name="description" item={{ label: 'Qeyd' }} input={{ placeholder: 'Qeydinizi daxil edin...' }} />
              <CheckboxField name="updateStatus" input={{ children: 'Status dəyişsin' }} />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
                <Space>
                  <Button onClick={onClose}>Ləğv et</Button>
                  <Button type="primary" htmlType="submit" loading={isSubmitting}>
                    Qəbul et
                  </Button>
                </Space>
              </div>
            </Form>
          </form>
        )}
      </Formik>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Ümumi məlumat" size="small">
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="İzləmə kodu">{d.trackCode}</Descriptions.Item>
              <Descriptions.Item label="Q.İ kodu">{d.globalTrackCode || '—'}</Descriptions.Item>
              <Descriptions.Item label="Məhsul tipi">{d.productType?.name || '—'}</Descriptions.Item>
              <Descriptions.Item label="Mağaza">{d.shop || '—'}</Descriptions.Item>
              <Descriptions.Item label="Tərkibi">{d.type === 'liquid' ? 'Maye' : 'Digər'}</Descriptions.Item>
              <Descriptions.Item label="Sənəd">
                {d.file ? (
                  <a href={d.file} target="_blank" rel="noreferrer noopener">
                    Sənədə bax
                  </a>
                ) : (
                  'Mövcud deyil'
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Yaradılma tarixi">{d.createdAt}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Anbar məlumatları" size="small">
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Koli">{d.parcel?.id || 'Qeyd olunmayıb'}</Descriptions.Item>
              <Descriptions.Item label="Şkaf (Yerli)">{d.wardrobeNumber || 'Qeyd olunmayıb'}</Descriptions.Item>
            </Descriptions>
          </Card>
          <Card title="Qiymətlər" size="small" style={{ marginTop: 16 }}>
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Məhsulun qiyməti">{d.price != null ? `${Number(d.price).toFixed(2)} ₺` : 'Qeyd olunmayıb'}</Descriptions.Item>
              <Descriptions.Item label="Çatdırılma qiyməti">{d.deliveryPrice != null ? `${Number(d.deliveryPrice).toFixed(2)} $` : 'Qeyd olunmayıb'}</Descriptions.Item>
              <Descriptions.Item label="Çəki">{d.weight != null ? `${Number(d.weight).toFixed(2)} kq` : 'Qeyd olunmayıb'}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export const DeclarationAcceptance: FC = () => {
  const { tempTrackCode, setTempTrackCode, trackCode, trackCodeInputRef, autoAccept, setAutoAccept, isLoading, handleSearch, handleReset } = useDeclarationAcceptance();

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
        <Input.Search
          autoFocus
          style={{ maxWidth: 400, marginTop: 24 }}
          ref={trackCodeInputRef}
          value={tempTrackCode}
          onChange={(e) => setTempTrackCode(e.target.value)}
          onSearch={handleSearch}
          placeholder="İzləmə kodunu daxil edin..."
          loading={isLoading}
          enterButton="Axtar"
        />
        <Checkbox checked={autoAccept} onChange={(e) => setAutoAccept(e.target.checked)} style={{ marginTop: 18 }}>
          Avto qəbul
        </Checkbox>
        <Divider />
      </div>
      {trackCode && <DeclarationAcceptForm trackCode={trackCode} onClose={handleReset} />}
    </div>
  );
};
