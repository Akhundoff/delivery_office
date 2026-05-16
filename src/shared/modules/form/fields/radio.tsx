import React, { FC, useCallback } from 'react';
import { Form, Radio } from 'antd';
import { RadioGroupProps } from 'antd/lib/radio';
import { FormItemProps } from 'antd/lib/form';
import { useField, FieldHookConfig } from 'formik';

export type RadioFieldProps = FieldHookConfig<string> & {
    item?: FormItemProps;
    input?: RadioGroupProps;
    children?: React.ReactNode;
};

export const RadioField: FC<RadioFieldProps> = ({ item, input, children, ...props }) => {
    const [{ onChange: baseOnChange, ...field }, meta] = useField(props);

    const onChange = useCallback(
        (e: any) => {
            baseOnChange({ target: { name: field.name, value: e.target.value } } as any);
        },
        [baseOnChange, field.name],
    );

    return (
        <Form.Item {...item} validateStatus={meta.touched && !!meta.error ? 'error' : undefined} help={meta.touched ? meta.error : undefined}>
            <Radio.Group {...field} {...input} onChange={onChange}>
                {children}
            </Radio.Group>
        </Form.Item>
    );
};
