import React, { FC } from 'react';
import { Checkbox, Form } from 'antd';
import { CheckboxProps } from 'antd/lib/checkbox';
import { FormItemProps } from 'antd/lib/form';
import { useField, FieldHookConfig } from 'formik';

export type CheckboxFieldProps = FieldHookConfig<boolean> & {
    item?: FormItemProps;
    input?: CheckboxProps & { children?: React.ReactNode };
};

export const CheckboxField: FC<CheckboxFieldProps> = ({ item, input, ...props }) => {
    const [field, meta] = useField({ ...props, type: 'checkbox' });

    return (
        <Form.Item {...item} validateStatus={meta.touched && !!meta.error ? 'error' : undefined} help={meta.touched ? meta.error : undefined}>
            <Checkbox {...field} {...input} checked={field.checked}>
                {input?.children}
            </Checkbox>
        </Form.Item>
    );
};
