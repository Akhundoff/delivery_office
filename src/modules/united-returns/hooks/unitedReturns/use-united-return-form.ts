import { useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { FormikHelpers } from 'formik';
import { message } from 'antd';
import { useBackgroundNavigate } from '@shared/hooks';
import { localURLMaker } from '@shared/utils';
import { UnitedReturnsService } from '../../services';
import { IUnitedReturnFormValues } from '../../interfaces';

export const useUnitedReturnForm = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useBackgroundNavigate();

  const detail = useQuery(
    ['united-returns', id],
    async () => {
      const result = await UnitedReturnsService.getById(id!);
      if (result.status === 200) return result.data;
      throw new Error(result.data as string);
    },
    { enabled: !!id },
  );

  const initialValues = useMemo<IUnitedReturnFormValues>(() => {
    if (id && detail.data) return { barcode: detail.data.barcode, weight: detail.data.weight };
    return { barcode: '', weight: '' };
  }, [id, detail.data]);

  const onSubmit = useCallback(
    async (values: IUnitedReturnFormValues, helpers: FormikHelpers<IUnitedReturnFormValues>) => {
      const result = await UnitedReturnsService.create(values, id);
      if (result.status === 200) {
        message.success(result.data.message);
        if (result.data.labelUrl) window.open(result.data.labelUrl, '_blank');
        navigate(localURLMaker('/united-returns', {}, { reFetchUnitedReturnsTable: '1' }));
      } else if (result.status === 422) {
        const raw = result.data as Record<string, string[]>;
        const errors: Record<string, string> = {};
        Object.entries(raw).forEach(([k, v]) => {
          errors[k] = Array.isArray(v) ? v.join(', ') : String(v);
        });
        helpers.setErrors(errors);
      } else {
        message.error(result.data as string);
      }
      helpers.setSubmitting(false);
    },
    [id, navigate],
  );

  return { initialValues, onSubmit, id, isLoading: !!id && (detail.isLoading || !detail.data) };
};
