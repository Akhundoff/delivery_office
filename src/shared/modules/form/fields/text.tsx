import React, { FC } from 'react';
import { Form, Input } from 'antd';
import { InputProps } from 'antd/lib/input';
import { FormItemProps } from 'antd/lib/form';
import { useField, FieldHookConfig } from 'formik';

export type TextFieldProps = FieldHookConfig<string> & {
  item?: FormItemProps;
  input?: InputProps;
};

export const TextField: FC<TextFieldProps> = ({ item, input, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <Form.Item {...item} validateStatus={meta.touched && !!meta.error ? 'error' : undefined} help={meta.touched ? meta.error : undefined}>
      <Input {...field} {...input} value={field.value ?? ''} />
    </Form.Item>
  );
};
