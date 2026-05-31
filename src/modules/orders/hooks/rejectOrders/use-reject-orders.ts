import { useCallback, useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useQueryClient } from 'react-query';
import { FormikHelpers } from 'formik';
import { message } from 'antd';

import { useBackgroundNavigate, useCloseModal } from '@shared/hooks';
import { localURLMaker } from '@shared/utils';

import { REJECTED_STATUS_ID } from '../../constants';
import { IRejectOrdersValues } from '../../interfaces';
import { OrdersService } from '../../services';

type RejectLocationState = {
  rejectIds?: (string | number)[];
  rejectQuery?: Record<string, any>;
};

export const useRejectOrders = () => {
  const { id } = useParams<{ id?: string }>();
  const location = useLocation();
  const [closeModal] = useCloseModal();
  const navigate = useBackgroundNavigate();
  const queryClient = useQueryClient();

  const state = (location.state || {}) as RejectLocationState;
  const ids = useMemo<(string | number)[] | undefined>(() => {
    if (id) return id.split('/');
    if (state.rejectIds?.length) return state.rejectIds;
    return undefined;
  }, [id, state.rejectIds]);

  const query = state.rejectQuery;
  const isBulk = !ids && !!query;

  const initialValues = useMemo<IRejectOrdersValues>(() => ({ description: '' }), []);

  const onClose = useCallback(() => {
    closeModal(id ? `/orders/${id}` : '/orders');
  }, [closeModal, id]);

  const onSubmit = useCallback(
    async (values: IRejectOrdersValues, helpers: FormikHelpers<IRejectOrdersValues>) => {
      let result;
      if (ids) {
        result = await OrdersService.changeStatus(ids, REJECTED_STATUS_ID, values.description);
      } else if (query) {
        result = await OrdersService.bulkChangeStatus(query, REJECTED_STATUS_ID, values.description);
      } else {
        onClose();
        return;
      }

      if (result.status === 200) {
        message.success('Sifariş(lər) ləğv edildi.');
        if (id) {
          queryClient.invalidateQueries(['orders', id]);
          closeModal(`/orders/${id}`);
        } else {
          navigate(localURLMaker('/orders', {}, { reFetchOrdersTable: '1' }), { withBackground: false });
        }
      } else {
        message.error(result.data as string);
      }
      helpers.setSubmitting(false);
    },
    [ids, query, id, closeModal, navigate, queryClient],
  );

  return { initialValues, onSubmit, onClose, ids, isBulk };
};
