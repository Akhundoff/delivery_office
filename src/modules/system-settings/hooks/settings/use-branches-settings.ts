import { useCallback, useMemo } from 'react';
import { useQuery } from 'react-query';
import { FormikHelpers } from 'formik';
import { message } from 'antd';
import { caller, formDataFlat, urlMaker } from '@shared/utils';
import { SystemSettingsService } from '../../services';

export type BranchItem = {
  id: string;
  name: string;
  number: string;
  email: string;
  address: string;
  map: string;
  numbers: string;
  emails: string;
};

export type BranchesValues = { items: BranchItem[] };

export const useBranchesSettings = () => {
  const query = useQuery(
    ['settings', 'contact'],
    async () => {
      const result = await SystemSettingsService.getGroup('contact');
      if (result.status === 200) return result.data as any[];
      throw new Error(result.data as string);
    },
    { staleTime: 5 * 60 * 1000 },
  );

  const initialValues = useMemo<BranchesValues>(() => {
    if (!query.data) return { items: [] };
    return {
      items: (query.data as any[]).map((item) => ({
        id: item.id ?? '',
        name: item.name ?? '',
        number: item.number ?? '',
        email: item.email ?? '',
        address: item.address ?? '',
        map: item.map ?? '',
        numbers: item.numbers ?? '',
        emails: item.emails ?? '',
      })),
    };
  }, [query.data]);

  const onSubmit = useCallback(async (values: BranchesValues, helpers: FormikHelpers<BranchesValues>) => {
    const flat = formDataFlat<Record<string, string>>({ group_id: 'contact', items: values.items });
    const body = new FormData();
    Object.entries(flat).forEach(([k, v]) => body.append(k, String(v ?? '')));
    try {
      const url = urlMaker('/api/admin/settings/data');
      const response = await caller(url, { method: 'POST', body });
      if (response.ok) {
        message.success('Dəyişikliklər saxlanıldı');
      } else {
        message.error('Xəta baş verdi');
      }
    } catch {
      message.error('Şəbəkə xətası');
    }
    helpers.setSubmitting(false);
  }, []);

  return { initialValues, onSubmit, isLoading: query.isLoading };
};
