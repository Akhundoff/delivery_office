import React, { FC, useCallback } from 'react';
import { Form, Select } from 'antd';
import { SelectProps } from 'antd/lib/select';
import { FormItemProps } from 'antd/lib/form';
import { useField, FieldConfig } from 'formik';

export type SelectFieldProps = FieldConfig & {
  item?: FormItemProps;
  input?: SelectProps<any>;
  children?: React.ReactNode;
};

export const SelectField: FC<SelectFieldProps> = ({ item, input, children, ...props }) => {
  const [{ onChange: baseOnChange, ...field }, meta] = useField(props);

  const onChange = useCallback(
    (value: any) => {
      baseOnChange(field.name)(value ?? '');
    },
    [baseOnChange, field.name],
  );

  return (
    <Form.Item {...item} validateStatus={meta.touched && !!meta.error ? 'error' : undefined} help={meta.touched ? meta.error : undefined}>
      <Select allowClear showSearch {...field} {...input} value={field.value || undefined} onChange={onChange}>
        {children}
      </Select>
    </Form.Item>
  );
};
