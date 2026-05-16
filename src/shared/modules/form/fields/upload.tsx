import React, { FC, useState } from 'react';
import { Form, Upload } from 'antd';
import { UploadProps } from 'antd/lib/upload';
import { FormItemProps } from 'antd/lib/form';
import { useField, FieldHookConfig } from 'formik';
import { RcFile } from 'antd/lib/upload/interface';

export type UploadFieldProps = FieldHookConfig<File | null> & {
  item?: FormItemProps;
  input?: Omit<UploadProps, 'beforeUpload' | 'onChange' | 'showUploadList'>;
  renderContent?: (props: { previewUrl?: string }) => React.ReactNode;
};

export const UploadField: FC<UploadFieldProps> = ({ item, input, renderContent, ...props }) => {
  const [, meta, helpers] = useField(props);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>();

  const handleBeforeUpload = (file: RcFile) => {
    helpers.setValue(file);
    const reader = new FileReader();
    reader.onload = (e) => setPreviewUrl(e.target?.result as string);
    reader.readAsDataURL(file);
    return false;
  };

  return (
    <Form.Item {...item} validateStatus={meta.touched && !!meta.error ? 'error' : undefined} help={meta.touched ? meta.error : undefined}>
      <Upload {...input} beforeUpload={handleBeforeUpload} showUploadList={false} maxCount={1}>
        {renderContent ? renderContent({ previewUrl }) : null}
      </Upload>
    </Form.Item>
  );
};
