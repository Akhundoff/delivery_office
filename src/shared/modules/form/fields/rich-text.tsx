import React, { FC } from 'react';
import { Form } from 'antd';
import { FormItemProps } from 'antd/lib/form';
import { useField, FieldHookConfig } from 'formik';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export type RichTextFieldProps = FieldHookConfig<string> & {
  item?: FormItemProps;
};

export const RichTextField: FC<RichTextFieldProps> = ({ item, ...props }) => {
  const [field, meta, helpers] = useField(props);

  return (
    <Form.Item {...item} validateStatus={meta.touched && !!meta.error ? 'error' : undefined} help={meta.touched ? meta.error : undefined}>
      <CKEditor
        editor={ClassicEditor}
        data={field.value ?? ''}
        onChange={(_event: any, editor: any) => {
          helpers.setValue(editor.getData());
        }}
        onBlur={() => helpers.setTouched(true)}
      />
    </Form.Item>
  );
};
