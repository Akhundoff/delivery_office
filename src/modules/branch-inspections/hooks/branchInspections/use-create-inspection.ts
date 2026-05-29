import { useCallback, useMemo } from 'react';
import dayjs from 'dayjs';
import { FormikHelpers } from 'formik';
import { message } from 'antd';
import { useBackgroundNavigate } from '@shared/hooks';
import { localURLMaker } from '@shared/utils';
import { Constants } from '@shared/constants';
import { BranchInspectionsService } from '../../services';
import { ICreateInspectionFormValues } from '../../interfaces';

export const useCreateInspection = () => {
  const navigate = useBackgroundNavigate();

  const initialValues = useMemo<ICreateInspectionFormValues>(
    () => ({
      branchId: '',
      note: 'Qeyd edilən vaxta qədər bütün filialdakı bağlamaları scan etməlisiz!',
      deadline: dayjs().add(48, 'hour'),
    }),
    [],
  );

  const onSubmit = useCallback(
    async (values: ICreateInspectionFormValues, helpers: FormikHelpers<ICreateInspectionFormValues>) => {
      const result = await BranchInspectionsService.create({
        branch_id: parseInt(values.branchId, 10),
        note: values.note || undefined,
        deadline: values.deadline ? values.deadline.format(Constants.DATE_TIME) : undefined,
      });
      if (result.status === 200) {
        message.success('Yoxlanış uğurla yaradıldı');
        navigate(localURLMaker('/branch-inspections', {}, { reFetchBranchInspectionsTable: '1' }));
      } else {
        message.error(result.data as string);
      }
      helpers.setSubmitting(false);
    },
    [navigate],
  );

  return { onSubmit, initialValues };
};
