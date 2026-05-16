import React, { FC, useCallback } from 'react';
import { Form, DatePicker } from 'antd';
import { DatePickerProps } from 'antd/lib/date-picker';
import { FormItemProps } from 'antd/lib/form';
import { useField, FieldHookConfig } from 'formik';
import { Dayjs } from 'dayjs';

export type DateFieldProps = FieldHookConfig<Dayjs | null> & {
    item?: FormItemProps;
    input?: DatePickerProps;
};

export const DateField: FC<DateFieldProps> = ({ item, input, ...props }) => {
    const [{ onChange: baseOnChange, ...field }, meta] = useField(props);

    const onChange = useCallback(
        (value: Dayjs | null) => {
            baseOnChange({ target: { name: field.name, value } } as any);
        },
        [baseOnChange, field.name],
    );

    return (
        <Form.Item {...item} validateStatus={meta.touched && !!meta.error ? 'error' : undefined} help={meta.touched ? meta.error : undefined}>
            <DatePicker style={{ width: '100%' }} {...field} {...input} value={field.value ?? null} onChange={onChange} />
        </Form.Item>
    );
};
