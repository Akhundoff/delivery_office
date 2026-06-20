import { FC, useMemo } from 'react';
import { Button, Col, Form, Popover, Row, Spin, Typography } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { Formik, FormikProps } from 'formik';
import { TextField } from '@shared/modules/form/fields/text';
import { UploadField } from '@shared/modules/form/fields/upload';
import { useSettingsGroup } from '../hooks';

const { Text } = Typography;

const defaultValues = {
  ticketHtmlTemplateId: '',
  footerText: '',
  headerBannerUrl: '',
  rightBannerUrl: '',
  headerBannerPhoto: null as File | null,
  rightBannerPhoto: null as File | null,
};

const fromApi = (raw: Record<string, any>): Partial<typeof defaultValues> => ({
  ticketHtmlTemplateId: raw.ticket_html_template_id ?? '',
  footerText: raw.footer_text ?? '',
  headerBannerUrl: raw.header_banner_url ?? '',
  rightBannerUrl: raw.right_banner_url ?? '',
});

const toApi = (values: typeof defaultValues) => ({
  ticket_html_template_id: values.ticketHtmlTemplateId,
  footer_text: values.footerText,
  header_banner_url: values.headerBannerUrl,
  right_banner_url: values.rightBannerUrl,
  ...(values.headerBannerPhoto ? { header_banner_photo: values.headerBannerPhoto } : {}),
  ...(values.rightBannerPhoto ? { right_banner_photo: values.rightBannerPhoto } : {}),
});

const errorKeyMap: Record<string, string> = {
  ticket_html_template_id: 'ticketHtmlTemplateId',
  footer_text: 'footerText',
  header_banner_url: 'headerBannerUrl',
  right_banner_url: 'rightBannerUrl',
  header_banner_photo: 'headerBannerPhoto',
  right_banner_photo: 'rightBannerPhoto',
};

const MailSettingsForm: FC<FormikProps<typeof defaultValues>> = ({ submitForm, isSubmitting, values }) => {
  const headerPreview = useMemo(() => <img src={values.headerBannerUrl || undefined} alt="Preview" width={100} height={100} />, [values.headerBannerUrl]);
  const rightPreview = useMemo(() => <img src={values.rightBannerUrl || undefined} alt="Preview" width={100} height={100} />, [values.rightBannerUrl]);

  return (
    <Form layout="vertical" component="div" size="large">
      <Row gutter={16}>
        <Col span={12}>
          <TextField name="ticketHtmlTemplateId" item={{ label: 'Müraciət şablonu', required: true }} input={{ placeholder: 'Müraciət şablonu daxil edin...' }} />
        </Col>
        <Col span={12}>
          <TextField name="footerText" item={{ label: 'Footer mətni' }} input={{ placeholder: 'Footer mətni daxil edin...' }} />
        </Col>
        <Col span={12}>
          <TextField name="headerBannerUrl" item={{ label: 'Başlıq banner URL-i', required: true }} input={{ placeholder: 'Başlıq banner URL-i daxil edin...' }} />
        </Col>
        <Col span={12}>
          <TextField name="rightBannerUrl" item={{ label: 'Sağ banner URL-i', required: true }} input={{ placeholder: 'Sağ banner URL-i daxil edin...' }} />
        </Col>
        <Col span={12}>
          <UploadField
            name="headerBannerPhoto"
            item={{ label: 'Başlıq üçün şəkil yüklə' }}
            renderContent={() => (
              <Popover content={headerPreview} trigger="hover">
                <Button type="primary" icon={<DownloadOutlined />}>
                  Şəkil yüklə
                </Button>
              </Popover>
            )}
          />
          <Text type="secondary">Tövsiyə edilən ölçü: 600x190</Text>
        </Col>
        <Col span={12}>
          <UploadField
            name="rightBannerPhoto"
            item={{ label: 'Sağ banner üçün şəkil yüklə' }}
            renderContent={() => (
              <Popover content={rightPreview} trigger="hover">
                <Button type="primary" icon={<DownloadOutlined />}>
                  Şəkil yüklə
                </Button>
              </Popover>
            )}
          />
          <Text type="secondary">Tövsiyə edilən ölçü: 200x250</Text>
        </Col>
      </Row>
      <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
        <Button type="primary" loading={isSubmitting} onClick={submitForm}>
          Yadda saxla
        </Button>
      </div>
    </Form>
  );
};

export const MailSettings: FC = () => {
  const { initialValues, onSubmit, isLoading } = useSettingsGroup('email', defaultValues, fromApi, toApi, errorKeyMap, true);
  if (isLoading) return <Spin />;
  return (
    <Formik initialValues={initialValues as typeof defaultValues} onSubmit={onSubmit} enableReinitialize>
      {(f) => <MailSettingsForm {...f} />}
    </Formik>
  );
};
