import { useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { FormikHelpers } from 'formik';
import { message } from 'antd';

import { useBackgroundNavigate } from '@shared/hooks';
import { localURLMaker } from '@shared/utils';
import { BranchesService } from '../../services';
import { IBranchFormValues } from '../../interfaces';

const emptyValues: IBranchFormValues = {
  name: '',
  descr: '',
  address: '',
  phone: '',
  email: '',
  workinghours: '',
  isBranch: false,
  isRegionBranch: false,
  hide: false,
  latitude: '',
  longitude: '',
  mapUrl: '',
  mapAddress: '',
  parentId: '',
  stateId: '',
  companyId: '',
  sortingLetter: '',
  openHour: '',
  closeHour: '',
  openHourSaturday: '',
  closeHourSaturday: '',
  cityName: '',
  provinceName: '',
  postCode: '',
  warehouseMan: '',
};

export const useBranchForm = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useBackgroundNavigate();

  const detail = useQuery(
    ['branches', id],
    async () => {
      const result = await BranchesService.getById(id!);
      if (result.status === 200) return result.data;
      throw new Error(result.data as string);
    },
    { enabled: !!id },
  );

  const initialValues = useMemo<IBranchFormValues>(() => {
    if (id && detail.data) {
      const d = detail.data;
      return {
        name: d.name,
        descr: d.descr,
        address: d.address,
        phone: d.phone,
        email: d.email,
        workinghours: d.workinghours,
        isBranch: d.isBranch,
        isRegionBranch: d.isRegionBranch,
        hide: d.hide,
        latitude: d.latitude,
        longitude: d.longitude,
        mapUrl: d.mapUrl,
        mapAddress: d.mapAddress,
        parentId: d.parent ? String(d.parent.id) : '',
        stateId: d.status ? String(d.status.id) : '',
        companyId: d.company ? String(d.company.id) : '',
        sortingLetter: d.sortingLetter,
        openHour: d.openHour,
        closeHour: d.closeHour,
        openHourSaturday: d.openHourSaturday,
        closeHourSaturday: d.closeHourSaturday,
        cityName: d.cityName,
        provinceName: d.provinceName,
        postCode: d.postCode,
        warehouseMan: d.warehouseMan,
      };
    }
    return emptyValues;
  }, [id, detail.data]);

  const onSubmit = useCallback(
    async (values: IBranchFormValues, helpers: FormikHelpers<IBranchFormValues>) => {
      const result = id ? await BranchesService.update(id, values) : await BranchesService.create(values);

      if (result.status === 200) {
        message.success(id ? 'Dəyişikliklər saxlanıldı' : 'Filial yaradıldı');
        navigate(localURLMaker('/branches', {}, { reFetchBranchesTable: '1' }));
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
