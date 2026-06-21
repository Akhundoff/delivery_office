import { useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Modal, message } from 'antd';
import { MeContext } from '@modules/me';
import { WarehouseService } from '../../services';
import { IDetailedHandoverQueue } from '../../interfaces';
import { printHandoverCheck } from '../../utils';

export const useHandoverQueue = (queueId: string) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const me = useContext(MeContext);

  const queue = useQuery(
    ['warehouse', 'handover-items', queueId],
    async () => {
      const result = await WarehouseService.getHandoverQueue(queueId);
      if (result.status === 200) return result.data;
      throw new Error(result.data as string);
    },
    { enabled: !!queueId },
  );

  const updateStatus = useMutation<any, Error, number>(
    async (statusId) => {
      const result = await WarehouseService.updateHandoverQueueStatus(queueId, statusId);
      if (result.status !== 200) throw new Error(result.data as string);
    },
    {
      onError: (err) => {
        message.error(err.message);
      },
      onSettled: () => queryClient.invalidateQueries(['warehouse', 'handover-items']),
    },
  );

  const removeMutation = useMutation(
    async () => {
      const result = await WarehouseService.removeHandoverQueue([queueId]);
      if (result.status !== 200) throw new Error(result.data as string);
    },
    { onSettled: () => queryClient.invalidateQueries(['warehouse', 'handover-items']) },
  );

  const removeItem = useMutation(
    async (declarationId: number) => {
      const result = await WarehouseService.removeHandoverQueueItem(queueId, declarationId);
      if (result.status !== 200) throw new Error(result.data as string);
    },
    { onSuccess: () => queryClient.invalidateQueries(['warehouse', 'handover-items', queueId]) },
  );

  const handlePrint = useCallback(
    async (data?: IDetailedHandoverQueue | null) => {
      const target = data || queue.data;
      if (!target) return;
      await printHandoverCheck(me.state.user.data, queueId, target);
    },
    [me.state.user.data, queueId, queue.data],
  );

  const handover = useCallback(() => {
    updateStatus.mutate(43, {
      onSuccess: () => {
        navigate('/warehouse/handover/queues');
      },
    });
  }, [updateStatus, navigate]);

  const remove = useCallback(() => {
    removeMutation.mutate(undefined, {
      onSuccess: () => {
        navigate('/warehouse/handover/queues');
      },
    });
  }, [removeMutation, navigate]);

  return { queue, updateStatus, removeMutation, removeItem, handover, remove, handlePrint };
};
