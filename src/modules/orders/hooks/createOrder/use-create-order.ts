import { useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from 'react-query';
import { FormikHelpers } from 'formik';
import { message } from 'antd';

import { useBackgroundNavigate, useCloseModal } from '@shared/hooks';
import { localURLMaker } from '@shared/utils';
import { UsersService } from '@modules/users/services';
import { ShopsService } from '@modules/shops/services';

import { ICreateOrderValues } from '../../interfaces';
import { OrdersService } from '../../services';

const EMPTY_VALUES: ICreateOrderValues = {
  userId: '',
  countryId: '',
  isUrgent: false,
  description: '',
  product: {
    url: '',
    shop: '',
    typeId: '',
    color: '',
    size: '',
    quantity: '',
    price: '',
    internalShippingPrice: '',
  },
};

export const useCreateOrder = () => {
  const { id } = useParams<{ id?: string }>();
  const [closeModal] = useCloseModal();
  const navigate = useBackgroundNavigate();
  const queryClient = useQueryClient();

  const order = useQuery(
    ['orders', id],
    async () => {
      const result = await OrdersService.getById(id!);
      if (result.status === 200) return result.data;
      throw new Error(result.data as string);
    },
    { enabled: !!id },
  );

  const users = useQuery(
    ['orders-users-select'],
    async () => {
      const result = await UsersService.getUsers({ per_page: 1000 });
      if (result.status === 200) return result.data.data.map((u) => ({ id: u.id, name: `${u.firstname} ${u.lastname}` }));
      throw new Error('İstifadəçilər əldə edilə bilmədi');
    },
    { staleTime: 5 * 60 * 1000 },
  );

  const shopTypes = useQuery(
    ['orders-shop-types'],
    async () => {
      const result = await ShopsService.getCategories();
      if (result.status === 200) return result.data;
      throw new Error(result.data as string);
    },
    { staleTime: 15 * 60 * 1000 },
  );

  const isLoading = !!id && (order.isLoading || !order.data);

  const initialValues = useMemo<ICreateOrderValues>(() => {
    const data = order.data;
    if (id && data) {
      return {
        id: String(data.id),
        userId: String(data.user.id),
        countryId: String(data.countryId || ''),
        isUrgent: data.isUrgent,
        description: data.description,
        product: {
          url: data.product.url,
          shop: data.product.shop,
          typeId: data.product.type ? String(data.product.type.id) : '',
          color: data.product.color,
          size: data.product.size,
          quantity: String(data.product.quantity ?? ''),
          price: String(data.product.price ?? ''),
          internalShippingPrice: data.product.internalShippingPrice ? String(data.product.internalShippingPrice) : '',
        },
      };
    }
    return EMPTY_VALUES;
  }, [id, order.data]);

  const onSubmit = useCallback(
    async (values: ICreateOrderValues, helpers: FormikHelpers<ICreateOrderValues>) => {
      const result = await OrdersService.save(values, id || undefined);

      if (result.status === 200) {
        message.success(id ? 'Dəyişikliklər saxlanıldı' : 'Sifariş yaradıldı');
        if (id) {
          queryClient.invalidateQueries(['orders', id]);
          closeModal(`/orders/${id}`);
        } else {
          navigate(localURLMaker('/orders', {}, { reFetchOrdersTable: '1' }), { withBackground: false });
        }
      } else if (result.status === 422) {
        helpers.setErrors(result.data as Record<string, any>);
      } else {
        message.error(result.data as string);
      }
      helpers.setSubmitting(false);
    },
    [id, closeModal, navigate, queryClient],
  );

  return {
    id,
    isLoading,
    initialValues,
    onSubmit,
    users: users.data ?? [],
    usersLoading: users.isLoading,
    shopTypes: shopTypes.data ?? [],
    shopTypesLoading: shopTypes.isLoading,
  };
};
