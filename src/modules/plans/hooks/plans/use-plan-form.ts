import { useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { FormikHelpers } from 'formik';
import { message } from 'antd';
import { useBackgroundNavigate } from '@shared/hooks';
import { localURLMaker } from '@shared/utils';
import { PlansService } from '../../services';
import { IPlanFormValues } from '../../interfaces';

export const usePlanForm = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useBackgroundNavigate();

  const detail = useQuery(
    ['plans', id],
    async () => {
      const result = await PlansService.getById(id!);
      if (result.status === 200) return result.data;
      throw new Error(result.data as string);
    },
    { enabled: !!id },
  );

  const initialValues = useMemo<IPlanFormValues>(() => {
    if (id && detail.data) {
      const d = detail.data;
      return {
        countryId: String(d.countryId),
        weightFrom: String(d.weight.from),
        weightTo: d.weight.to != null ? String(d.weight.to) : '',
        price: String(d.price),
        oldPrice: String(d.oldPrice),
        description: d.description,
        isLiquid: d.type === 'maye',
        isSpecial: d.tariffCategory.name !== 'Standart' && !!d.tariffCategory.id,
        categoryId: String(d.tariffCategory.id),
      };
    }
    return { countryId: '', weightFrom: '', weightTo: '', price: '', oldPrice: '', description: '', isLiquid: false, isSpecial: false, categoryId: '' };
  }, [id, detail.data]);

  const onSubmit = useCallback(
    async (values: IPlanFormValues, helpers: FormikHelpers<IPlanFormValues>) => {
      const result = id ? await PlansService.update(id, values) : await PlansService.create(values);
      if (result.status === 200) {
        message.success(id ? 'Dəyişikliklər saxlanıldı' : 'Tarif yaradıldı');
        navigate(localURLMaker('/plans', {}, { reFetchPlansTable: '1' }));
      } else if (result.status === 422) {
        const errors: Record<string, string> = {};
        const map: Record<string, string> = {
          country_id: 'countryId',
          from_weight: 'weightFrom',
          to_weight: 'weightTo',
          old_price: 'oldPrice',
          descr: 'description',
          tariff_category_id: 'categoryId',
        };
        Object.entries(result.data as Record<string, string[]>).forEach(([k, v]) => {
          errors[map[k] || k] = Array.isArray(v) ? v.join(', ') : String(v);
        });
        helpers.setErrors(errors);
      } else {
        message.error((result.data as string) || 'Xəta baş verdi');
      }
      helpers.setSubmitting(false);
    },
    [id, navigate],
  );

  return { initialValues, onSubmit, id, isLoading: !!id && (detail.isLoading || !detail.data) };
};
