import { useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { FormikHelpers } from 'formik';
import { message } from 'antd';
import dayjs from 'dayjs';

import { useBackgroundNavigate } from '@shared/hooks';
import { localURLMaker } from '@shared/utils';
import { CouponsService } from '../../services';
import { ICouponFormValues } from '../../interfaces';

const emptyValues: ICouponFormValues = {
  name: '',
  tag: '',
  couponType: '',
  amount: '',
  currency: '',
  count: '',
  stateId: '',
  description: '',
  platform: '',
  periodFrom: null,
  periodTo: null,
  userRegisterFrom: null,
  userRegisterTo: null,
  userGender: '',
  singleUse: false,
  countryId: '',
  branchId: '',
  regionId: '',
  userIds: [],
};

export const useCouponForm = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useBackgroundNavigate();

  const detail = useQuery(
    ['coupons', id],
    async () => {
      const result = await CouponsService.getById(id!);
      if (result.status === 200) return result.data;
      throw new Error(result.data as string);
    },
    { enabled: !!id },
  );

  const initialValues = useMemo<ICouponFormValues>(() => {
    if (id && detail.data) {
      const d = detail.data;
      return {
        name: d.name,
        tag: d.tag,
        couponType: String(d.couponType),
        amount: String(d.amount),
        currency: d.currency,
        count: String(d.count),
        stateId: d.state ? String(d.state.id) : '',
        description: d.description,
        platform: d.platform || '',
        periodFrom: d.period?.from ? dayjs(d.period.from) : null,
        periodTo: d.period?.to ? dayjs(d.period.to) : null,
        userRegisterFrom: d.userRegister?.from ? dayjs(d.userRegister.from) : null,
        userRegisterTo: d.userRegister?.to ? dayjs(d.userRegister.to) : null,
        userGender: d.userRegister?.gender ? String(d.userRegister.gender) : '',
        singleUse: d.count === 1,
        countryId: d.country ? String(d.country.id) : '',
        branchId: '',
        regionId: d.region ? String(d.region.id) : '',
        userIds: [],
      };
    }
    return emptyValues;
  }, [id, detail.data]);

  const onSubmit = useCallback(
    async (values: ICouponFormValues, helpers: FormikHelpers<ICouponFormValues>) => {
      const result = id ? await CouponsService.update(id, values) : await CouponsService.create(values);

      if (result.status === 200) {
        message.success(id ? 'Dəyişikliklər saxlanıldı' : 'Kupon yaradıldı');
        navigate(localURLMaker('/coupons', {}, { reFetchCouponsTable: '1' }));
      } else if (result.status === 422) {
        const raw = result.data as Record<string, string[]>;
        const errors: Record<string, string> = {};
        Object.entries(raw).forEach(([k, v]) => {
          errors[k] = Array.isArray(v) ? v.join(', ') : String(v);
        });
        helpers.setErrors(errors);
      } else {
        message.error((result.data as string) || 'Xəta baş verdi');
      }
      helpers.setSubmitting(false);
    },
    [id, navigate],
  );

  return {
    initialValues,
    onSubmit,
    id,
    isLoading: !!id && (detail.isLoading || !detail.data),
  };
};
