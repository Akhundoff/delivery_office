import React, { FC, memo, useCallback, useMemo } from 'react';
import { Form, Switch } from 'antd';
import { FormItemProps } from 'antd/es/form';
import { FieldHookConfig, useField } from 'formik';
import { SwitchProps } from 'antd/es/switch';
import { twoLevelShallowEqualObject } from '@shared/utils';

export type SwitchFieldProps = FieldHookConfig<boolean> & {
  item?: FormItemProps;
  input?: SwitchProps;
};

type MemoizedSwitchFieldProps = {
  item?: FormItemProps;
  input?: SwitchProps;
  field: any;
  meta: any;
};

const MemoizedSwitchField = memo<MemoizedSwitchFieldProps>(({ meta, item, field, input }) => {
  return (
    <Form.Item {...item} validateStatus={meta.touched && !!meta.error ? 'error' : undefined} help={meta.error}>
      <Switch {...field} {...input} />
    </Form.Item>
  );
}, twoLevelShallowEqualObject);

export const SwitchField: FC<SwitchFieldProps> = ({ item, input, ...props }) => {
  const [{ onChange: baseOnChange, ...field }, meta] = useField({ ...props, type: 'checkbox' });

  const onChange = useCallback(
    (value: boolean) => {
      baseOnChange(field.name)({ target: { type: 'checkbox', checked: value } } as any);
    },
    [baseOnChange, field.name],
  );

  const newField = useMemo(() => ({ ...field, onChange }), [field, onChange]);

  return <MemoizedSwitchField field={newField} meta={meta} input={input} item={item} />;
};
