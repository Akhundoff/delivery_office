import { useCallback, useEffect, useMemo, useState } from 'react';
import { FormikHelpers } from 'formik';
import { message } from 'antd';
import { useQuery } from 'react-query';
import { decode } from 'html-entities';
import { AboutService } from '../services';

type AboutValues = { body: string };

export const useAbout = () => {
  const [editorValue, setEditorValue] = useState('');

  const { data } = useQuery(['about'], async () => {
    const result = await AboutService.get();
    if (result.status === 200) return result.data;
    throw new Error(result.data);
  });

  useEffect(() => {
    if (data) setEditorValue(decode(data));
  }, [data]);

  const initialValues = useMemo<AboutValues>(() => ({ body: decode(data ?? '') }), [data]);

  const handleChange = useCallback((_event: any, editor: any) => {
    setEditorValue(editor.getData());
  }, []);

  const onSubmit = useCallback(
    async (_values: AboutValues, helpers: FormikHelpers<AboutValues>) => {
      const result = await AboutService.save(editorValue);
      if (result.status === 200) {
        message.success('Əməliyyat müvəffəqiyyətlə başa çatdı.');
      } else {
        message.error(result.data || 'Xəta baş verdi');
      }
      helpers.setSubmitting(false);
    },
    [editorValue],
  );

  return { initialValues, onSubmit, handleChange };
};
