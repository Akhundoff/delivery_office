import { useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { FormikHelpers } from 'formik';
import { message } from 'antd';
import { useBackgroundNavigate } from '@shared/hooks';
import { localURLMaker } from '@shared/utils';
import { PartnerBoxesService } from '../../services';
import { IPartnerBoxFormValues } from '../../interfaces';

export const usePartnerBoxForm = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useBackgroundNavigate();

  const detail = useQuery(['partner-boxes', id], async () => {
    const result = await PartnerBoxesService.getById(id!);
    if (result.status === 200) return result.data;
    throw new Error(result.data as string);
  }, { enabled: !!id });

  const initialValues = useMemo<IPartnerBoxFormValues>(() => {
    if (id && detail.data) return { name: detail.data.name };
    return { name: '' };
  }, [id, detail.data]);

  const onSubmit = useCallback(async (values: IPartnerBoxFormValues, helpers: FormikHelpers<IPartnerBoxFormValues>) => {
    const result = id ? await PartnerBoxesService.update(id, values) : await PartnerBoxesService.create(values);
    if (result.status === 200) {
      message.success(id ? 'Dəyişikliklər saxlanıldı' : 'Yeşik yaradıldı');
      navigate(localURLMaker('/partner-boxes', {}, { reFetchPartnerBoxesTable: '1' }));
    } else if (result.status === 422) {
      const errors: Record<string, string> = {};
      const map: Record<string, string> = { container_name: 'name' };
      Object.entries(result.data as Record<string, string[]>).forEach(([k, v]) => {
        errors[map[k] || k] = Array.isArray(v) ? v.join(', ') : String(v);
      });
      helpers.setErrors(errors);
    } else {
      message.error((result.data as string) || 'Xəta baş verdi');
    }
    helpers.setSubmitting(false);
  }, [id, navigate]);

  return { initialValues, onSubmit, id, isLoading: !!id && (detail.isLoading || !detail.data) };
};
