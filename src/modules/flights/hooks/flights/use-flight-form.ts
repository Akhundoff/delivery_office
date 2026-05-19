import { useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { FormikHelpers } from 'formik';
import { message } from 'antd';
import dayjs from 'dayjs';
import { useBackgroundNavigate } from '@shared/hooks';
import { localURLMaker } from '@shared/utils';
import { FlightsService } from '../../services';
import { CreateFlightDto } from '../../interfaces';

export const useFlightForm = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useBackgroundNavigate();

  const detail = useQuery(
    ['flights', id],
    async () => {
      const result = await FlightsService.getById(id!);
      if (result.status === 200) return result.data;
      throw new Error(result.data as string);
    },
    { enabled: !!id },
  );

  const initialValues = useMemo<CreateFlightDto>(() => {
    if (id && detail.data) {
      return {
        name: detail.data.name,
        startedAt: dayjs(detail.data.startedAt),
        endedAt: detail.data.endedAt ? dayjs(detail.data.endedAt) : null,
        statusId: String(detail.data.status.id),
        countryId: detail.data.country.id,
      };
    }
    return {
      name: dayjs().format('LLLL'),
      startedAt: dayjs(),
      endedAt: null,
      statusId: '29',
      countryId: null,
    };
  }, [id, detail.data]);

  const onSubmit = useCallback(
    async (values: CreateFlightDto, helpers: FormikHelpers<CreateFlightDto>) => {
      const result = await FlightsService.create(values);

      if (result.status === 200) {
        message.success(id ? 'Dəyişikliklər saxlanıldı.' : 'Uçuş yaradıldı.');
        navigate(localURLMaker('/flights', {}, { reFetchFlightsTable: '1' }));
      } else if (result.status === 422) {
        helpers.setErrors(result.data as any);
      } else {
        message.error((result.data as string) || 'Xəta baş verdi.');
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
