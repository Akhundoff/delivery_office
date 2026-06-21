import { useCallback, useMemo } from 'react';
import { useQuery } from 'react-query';
import { FormikErrors, FormikHelpers } from 'formik';
import { message } from 'antd';
import { SystemSettingsService } from '../../services';

export const useSettingsGroup = <T extends Record<string, any>>(
  groupId: string,
  defaultValues: T,
  fromApi?: (raw: Record<string, any>) => Partial<T>,
  toApi?: (values: T) => Record<string, any>,
  errorKeyMap?: Record<string, string>,
  groupIdAsQuery?: boolean,
) => {
  const query = useQuery(
    ['settings', groupId],
    async () => {
      const result = await SystemSettingsService.getGroup(groupId);
      if (result.status === 200) return result.data;
      throw new Error(result.data as string);
    },
    { staleTime: 5 * 60 * 1000 },
  );

  const initialValues = useMemo<T>(() => {
    if (!query.data) return defaultValues;
    const mapped = fromApi ? fromApi(query.data) : query.data;
    return { ...defaultValues, ...mapped } as T;
  }, [query.data, defaultValues, fromApi]);

  const onSubmit = useCallback(
    async (values: T, helpers: FormikHelpers<T>) => {
      const payload = toApi ? toApi(values) : values;
      const result = await SystemSettingsService.updateGroup(groupId, payload, groupIdAsQuery);
      if (result.status === 200) {
        message.success('Dəyişikliklər saxlanıldı');
      } else if (result.status === 422) {
        const rawErrors = result.data as Record<string, string[]>;
        if (errorKeyMap) {
          const mapped: Record<string, string> = {};
          for (const [apiKey, messages] of Object.entries(rawErrors)) {
            const formKey = errorKeyMap[apiKey] ?? apiKey;
            mapped[formKey] = Array.isArray(messages) ? messages.join(', ') : (messages as unknown as string);
          }
          helpers.setErrors(mapped as FormikErrors<T>);
        } else {
          helpers.setErrors(rawErrors as FormikErrors<T>);
        }
      } else {
        message.error((result.data as string) || 'Xəta baş verdi');
      }
      helpers.setSubmitting(false);
    },
    [groupId, toApi, errorKeyMap, groupIdAsQuery],
  );

  return { initialValues, onSubmit, isLoading: query.isLoading };
};
