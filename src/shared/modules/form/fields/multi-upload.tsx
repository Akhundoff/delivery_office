import React, { FC, memo, PropsWithChildren, useCallback, useMemo } from 'react';
import { FieldHookConfig, FieldMetaProps, useField } from 'formik';
import { Form, Upload } from 'antd';
import { FormItemProps } from 'antd/es/form';
import { UploadChangeParam, UploadProps } from 'antd/es/upload';
import { twoLevelShallowEqualObject } from '@shared/utils';

export type MultiUploadFieldProps = FieldHookConfig<File[]> & {
  item?: FormItemProps;
  input?: UploadProps;
};

type MemoizedMultiUploadFieldProps = {
  item?: FormItemProps;
  input?: UploadProps;
  field: any;
  meta: FieldMetaProps<any>;
};

const MemoizedMultiUploadField = memo<PropsWithChildren<MemoizedMultiUploadFieldProps>>(({ item, input, field, meta, children }) => {
  const internalUploadProps = useMemo(() => ({ beforeUpload: () => false }), []);

  return (
    <Form.Item {...item} validateStatus={meta.touched && !!meta.error ? 'error' : undefined} help={meta.error}>
      <Upload {...internalUploadProps} {...field} {...input}>
        {children}
      </Upload>
    </Form.Item>
  );
}, twoLevelShallowEqualObject);

export const MultiUploadField: FC<MultiUploadFieldProps> = ({ item, input, children, ...props }) => {
  const [{ onChange: baseOnChange, ...field }, meta] = useField<File[]>(props);

  const onChange = useCallback(
    (params: UploadChangeParam) => {
      baseOnChange(field.name)({ target: { type: 'text', value: params.fileList } } as any);
    },
    [baseOnChange, field.name],
  );

  const newField = useMemo(() => ({ onChange, fileList: field.value }), [field.value, onChange]);

  return <MemoizedMultiUploadField field={newField} meta={meta} item={item} input={input} children={children} />;
};
