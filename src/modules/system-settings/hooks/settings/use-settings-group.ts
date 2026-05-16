import { useCallback, useMemo } from "react";
import { useQuery } from "react-query";
import { FormikErrors, FormikHelpers } from "formik";
import { message } from "antd";
import { SystemSettingsService } from "../../services";

export const useSettingsGroup = <T extends Record<string, any>>(groupId: string, defaultValues: T) => {
  const query = useQuery(
    ["settings", groupId],
    async () => {
      const result = await SystemSettingsService.getGroup(groupId);
      if (result.status === 200) return result.data;
      throw new Error(result.data as string);
    },
    { staleTime: 5 * 60 * 1000 },
  );

  const initialValues = useMemo<T>(() => {
    if (!query.data) return defaultValues;
    return { ...defaultValues, ...query.data } as T;
  }, [query.data, defaultValues]);

  const onSubmit = useCallback(
    async (values: T, helpers: FormikHelpers<T>) => {
      const result = await SystemSettingsService.updateGroup(groupId, values);
      if (result.status === 200) {
        message.success("Dəyişikliklər saxlanıldı");
      } else if (result.status === 422) {
        helpers.setErrors(result.data as FormikErrors<T>);
      } else {
        message.error((result.data as string) || "Xəta baş verdi");
      }
      helpers.setSubmitting(false);
    },
    [groupId],
  );

  return { initialValues, onSubmit, isLoading: query.isLoading };
};
