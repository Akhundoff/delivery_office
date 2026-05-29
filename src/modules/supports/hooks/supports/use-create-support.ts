import { useCallback, useMemo } from 'react';
import { FormikHelpers } from 'formik';
import { message } from 'antd';
import { useBackgroundNavigate } from '@shared/hooks';
import { localURLMaker } from '@shared/utils';
import { SupportsService } from '../../services';
import { ICreateSupportFormValues } from '../../interfaces';

export const useCreateSupport = () => {
  const navigate = useBackgroundNavigate();

  const initialValues = useMemo<ICreateSupportFormValues>(() => ({ userId: '', categoryId: '', body: '', files: [] }), []);

  const onSubmit = useCallback(
    async (values: ICreateSupportFormValues, helpers: FormikHelpers<ICreateSupportFormValues>) => {
      const result = await SupportsService.create(values);
      if (result.status === 200) {
        message.success('Müraciət yaradıldı');
        navigate(localURLMaker('/supports', {}, { reFetchSupportsTable: '1' }));
      } else if (result.status === 422) {
        helpers.setErrors(result.data as Record<string, string>);
      } else {
        message.error(result.data as string);
      }
      helpers.setSubmitting(false);
    },
    [navigate],
  );

  return { initialValues, onSubmit };
};
