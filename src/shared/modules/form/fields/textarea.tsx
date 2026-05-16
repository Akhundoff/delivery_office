import React, { FC } from 'react';
import { Form, Input } from 'antd';
import { TextAreaProps } from 'antd/lib/input/TextArea';
import { FormItemProps } from 'antd/lib/form';
import { useField, FieldHookConfig } from 'formik';

export type TextAreaFieldProps = FieldHookConfig<string> & {
  item?: FormItemProps;
  input?: TextAreaProps;
};

export const TextAreaField: FC<TextAreaFieldProps> = ({ item, input, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <Form.Item {...item} validateStatus={meta.touched && !!meta.error ? 'error' : undefined} help={meta.touched ? meta.error : undefined}>
      <Input.TextArea {...field} {...input} value={field.value ?? ''} />
    </Form.Item>
  );
};
