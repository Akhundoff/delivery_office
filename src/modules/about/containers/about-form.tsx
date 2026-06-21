import { FC } from 'react';
import { Button, Spin } from 'antd';
import { Formik, FormikProps } from 'formik';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useAbout } from '../hooks/use-about';

type AboutValues = { body: string };

const AboutFormInner: FC<FormikProps<AboutValues> & { onChange: (event: any, editor: any) => void }> = ({ submitForm, isSubmitting, values, onChange }) => (
  <div>
    <Spin spinning={!values.body.length}>
      <CKEditor editor={ClassicEditor} data={values.body} onChange={onChange} />
    </Spin>
    <Button style={{ width: '100%', marginTop: 16 }} loading={isSubmitting} type="primary" onClick={submitForm} block>
      Yadda saxla
    </Button>
  </div>
);

export const AboutForm: FC = () => {
  const { initialValues, onSubmit, handleChange } = useAbout();
  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit} enableReinitialize>
      {(f) => <AboutFormInner onChange={handleChange} {...f} />}
    </Formik>
  );
};
