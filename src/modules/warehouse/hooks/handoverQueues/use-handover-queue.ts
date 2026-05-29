import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Modal, message } from 'antd';
import { WarehouseService } from '../../services';

export const useHandoverQueue = (queueId: string) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const queue = useQuery(
        ['handover-queue', queueId],
        async () => {
            const result = await WarehouseService.getHandoverQueue(queueId);
            if (result.status === 200) return result.data;
            throw new Error(result.data as string);
        },
        { enabled: !!queueId },
    );

    const updateStatus = useMutation(async (statusId: number) => {
        const result = await WarehouseService.updateHandoverQueueStatus(queueId, statusId);
        if (result.status !== 200) throw new Error(result.data as string);
    });

    const removeMutation = useMutation(async () => {
        const result = await WarehouseService.removeHandoverQueue([queueId]);
        if (result.status !== 200) throw new Error(result.data as string);
    });

    const removeItem = useMutation(
        async (declarationId: number) => {
            const result = await WarehouseService.removeHandoverQueueItem(queueId, declarationId);
            if (result.status !== 200) throw new Error(result.data as string);
        },
        { onSuccess: () => queryClient.invalidateQueries(['handover-queue', queueId]) },
    );

    const handover = useCallback(() => {
        Modal.confirm({
            title: 'Təhvil verdiyinizə əminsinizmi?',
            okText: 'Bəli',
            cancelText: 'Xeyr',
            onOk: async () => {
                await updateStatus.mutateAsync(43);
                message.success('Təhvil verildi');
                navigate('/warehouse/handover/queues');
            },
        });
    }, [updateStatus, navigate]);

    const remove = useCallback(() => {
        Modal.confirm({
            title: 'Növbəni ləğv etməyə əminsinizmi?',
            okType: 'danger',
            okText: 'Ləğv et',
            cancelText: 'İmtina',
            onOk: async () => {
                await removeMutation.mutateAsync();
                message.success('Növbə ləğv edildi');
                navigate('/warehouse/handover/queues');
            },
        });
    }, [removeMutation, navigate]);

    return { queue, updateStatus, removeMutation, removeItem, handover, remove };
};
