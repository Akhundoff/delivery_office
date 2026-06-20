import { useCallback, useMemo } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { Modal, message } from 'antd';
import { useBackgroundNavigate } from '@shared/hooks';
import { StatusesService } from '@modules/statuses/services';
import { CouriersService } from '../../services';

export const useCourierDetail = (id: string) => {
  const backgroundNavigate = useBackgroundNavigate();
  const queryClient = useQueryClient();

  const query = useQuery(['courier', id], () => CouriersService.getById(id), { enabled: !!id });

  const statusesQuery = useQuery(['statuses-for-couriers-detail', 3], () => StatusesService.getList({ per_page: 500, model_id: 3 }));
  const statuses = useMemo(() => (statusesQuery.data?.status === 200 ? statusesQuery.data.data.data : []), [statusesQuery.data]);

  const updateStatus = useCallback(
    async (statusId: number) => {
      const result = await CouriersService.changeStatus([Number(id)], statusId);
      if (result.status === 200) {
        message.success('Status dəyişdirildi');
        queryClient.invalidateQueries(['courier', id]);
      } else {
        message.error(result.data as string);
      }
    },
    [id, queryClient],
  );

  const remove = useCallback(() => {
    Modal.confirm({
      title: 'Diqqət',
      content: 'Kuryer silinsin?',
      okText: 'Bəli',
      cancelText: 'Xeyr',
      onOk: async () => {
        const result = await CouriersService.cancel([Number(id)]);
        if (result.status === 200) {
          message.success('Kuryer silindi');
          queryClient.invalidateQueries(['couriers']);
          window.history.back();
        } else {
          message.error(result.data as string);
        }
      },
    });
  }, [id, queryClient]);

  const openTimeline = useCallback(() => backgroundNavigate(`/couriers/${id}/timeline`, { withBackground: true }), [backgroundNavigate, id]);
  const openUpdate = useCallback(() => backgroundNavigate(`/couriers/${id}/update`, { withBackground: true }), [backgroundNavigate, id]);

  return {
    data: query.data?.status === 200 ? query.data.data : undefined,
    isLoading: query.isLoading,
    error: query.isError ? 'Xəta baş verdi' : null,
    statuses,
    updateStatus,
    remove,
    openTimeline,
    openUpdate,
  };
};
