import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { message } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { MeContext } from '@modules/me';
import { useCounter } from '@modules/counter';
import { WarehouseService } from '../../services';
import { defaultFilterEnabled } from '../../utils';

export const useHandoverQueues = () => {
  const navigate = useNavigate();
  const me = useContext(MeContext);
  const queryClient = useQueryClient();
  const { state: counter } = useCounter();
  const [checkPrint, setCheckPrint] = useState(defaultFilterEnabled());

  const branchId = me.state.user.data?.adminBranchId;

  const { data, isLoading, error } = useQuery(
    ['warehouse', 'handover-items', { state_id: [41], branch_id: branchId }],
    async () => {
      const result = await WarehouseService.getHandoverQueues({ state_id: [41], branch_id: branchId || undefined });
      if (result.status === 200) return result.data;
      throw new Error(result.data as string);
    },
    {
      onSuccess: (data) => {
        if (data.activeTasks.length) {
          navigate(`/warehouse/handover/queues/${data.activeTasks[0]}`);
        }
      },
    },
  );

  const onChangeFilter = useCallback((e: CheckboxChangeEvent) => {
    setCheckPrint(e.target.checked);
    localStorage.setItem('no_filter_warehouse_check', e.target.checked.toString());
  }, []);

  const updateStatus = useMutation<any, Error, { queueId: number; statusId: number }>(
    async ({ queueId, statusId }) => {
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

  const remove = useMutation(
    async ({ queueId }: { queueId: number }) => {
      const result = await WarehouseService.removeHandoverQueue([queueId]);
      if (result.status !== 200) throw new Error(result.data as string);
    },
    {
      onSettled: () => queryClient.invalidateQueries(['warehouse', 'handover-items']),
    },
  );

  const execute = useCallback(
    (id: number) => {
      updateStatus.mutate(
        { queueId: id, statusId: 42 },
        {
          onSuccess: () => {
            navigate(`/warehouse/handover/queues/${id}`);
          },
        },
      );
    },
    [navigate, updateStatus],
  );

  const { pending, executing, executed } = counter.handoverQueue;
  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    queryClient.invalidateQueries(['warehouse', 'handover-items']);
  }, [pending, executing, executed, queryClient]);

  return { data, isLoading, error, updateStatus, remove, execute, checkPrint, onChangeFilter };
};
