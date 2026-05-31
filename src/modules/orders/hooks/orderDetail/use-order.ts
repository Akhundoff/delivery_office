import { useCallback } from 'react';
import { message, Modal } from 'antd';
import { useBackgroundNavigate } from '@shared/hooks';

import { REJECTED_STATUS_ID } from '../../constants';
import { OrdersService } from '../../services';
import { useOrderById } from './use-order-by-id';

export const useOrder = (id: string) => {
  const navigate = useBackgroundNavigate();
  const { data, isLoading, error, refetch } = useOrderById(id);

  const openTimeline = useCallback(() => {
    navigate(`/orders/${id}/timeline`, { withBackground: true });
  }, [id, navigate]);

  const openUpdate = useCallback(() => {
    navigate(`/orders/${id}/update`, { withBackground: true });
  }, [id, navigate]);

  const openDeclaration = useCallback(() => {
    if (data?.declaration) {
      navigate(`/declarations/${data.declaration.id}`, { withBackground: false });
    }
  }, [data?.declaration, navigate]);

  const remove = useCallback(() => {
    Modal.confirm({
      title: 'Diqqət',
      content: 'Bağlamanı silməyə əminsinizmi?',
      okText: 'Sil',
      okType: 'danger',
      cancelText: 'Ləğv et',
      onOk: async () => {
        const result = await OrdersService.cancel([id]);
        if (result.status === 200) {
          message.success('Bağlama silindi.');
          navigate('/orders', { withBackground: false });
        } else {
          message.error(result.data as string);
        }
      },
    });
  }, [id, navigate]);

  const updateStatus = useCallback(
    async (statusId: number | string) => {
      if (Number(statusId) === REJECTED_STATUS_ID) {
        navigate(`/orders/${id}/reject`, { withBackground: true });
        return;
      }

      message.loading({ key: 'order-status', content: 'Status dəyişdirilir...', duration: 0 });
      const result = await OrdersService.changeStatus([id], statusId);
      message.destroy('order-status');

      if (result.status === 200) {
        message.success('Status dəyişdirildi');
        refetch();
      } else {
        message.error(result.data as string);
      }
    },
    [id, navigate, refetch],
  );

  return {
    data,
    isLoading,
    error: error?.message ?? null,
    remove,
    updateStatus,
    openTimeline,
    openUpdate,
    openDeclaration,
  };
};
