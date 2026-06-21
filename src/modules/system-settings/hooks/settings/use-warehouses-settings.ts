import { useCallback, useMemo } from 'react';
import { useQuery } from 'react-query';
import { FormikHelpers } from 'formik';
import { message } from 'antd';
import { caller, formDataFlat, urlMaker } from '@shared/utils';
import { SystemSettingsService } from '../../services';

export type WarehouseItem = {
  id: string;
  city: string;
  addressHeading: string;
  postalCode: string;
  passportIdentity: string;
  address: string;
  province: string;
  district: string;
  country: string;
  phone: string;
};

export type WarehousesValues = { items: WarehouseItem[] };

export const useWarehousesSettings = () => {
  const query = useQuery(
    ['settings', 'warehouse'],
    async () => {
      const result = await SystemSettingsService.getGroup('warehouse');
      if (result.status === 200) return result.data as any[];
      throw new Error(result.data as string);
    },
    { staleTime: 5 * 60 * 1000 },
  );

  const initialValues = useMemo<WarehousesValues>(() => {
    if (!query.data) return { items: [] };
    return {
      items: (query.data as any[]).map((item) => ({
        id: item.id ?? '',
        city: item.city ?? '',
        addressHeading: item.address_heading ?? '',
        postalCode: item.postal_code ?? '',
        passportIdentity: item.passport_identity ?? '',
        address: item.address ?? '',
        province: item.province ?? '',
        district: item.district ?? '',
        country: item.country ?? '',
        phone: item.phone ?? '',
      })),
    };
  }, [query.data]);

  const onSubmit = useCallback(async (values: WarehousesValues, helpers: FormikHelpers<WarehousesValues>) => {
    const persistenceItems = values.items.map((item) => ({
      id: item.id,
      city: item.city,
      address_heading: item.addressHeading,
      postal_code: item.postalCode,
      passport_identity: item.passportIdentity,
      address: item.address,
      province: item.province,
      district: item.district,
      country: item.country,
      phone: item.phone,
    }));
    const flat = formDataFlat<Record<string, string>>({ group_id: 'warehouse', items: persistenceItems });
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
