import { useCallback, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { Modal, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { CashFlowTransactionsService } from '../../services';

export const useCashFlowTransactionDetail = (id: string) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [removing, setRemoving] = useState(false);

  const query = useQuery(['cash-flow-transaction', id], () => CashFlowTransactionsService.getById(id), { enabled: !!id });

  const data = query.data?.status === 200 ? query.data.data : undefined;

  const remove = useCallback(() => {
    Modal.confirm({
      title: 'Diqqət',
      content: 'Tranzaksiyanı silməyə əminsinizmi?',
      okText: 'Bəli',
      cancelText: 'Xeyr',
      onOk: async () => {
        setRemoving(true);
        const result = await CashFlowTransactionsService.remove(id);
        setRemoving(false);
        if (result.status === 200) {
          message.success('Tranzaksiya silindi');
          queryClient.invalidateQueries(['cash-flow-transactions']);
          navigate(-1);
        } else {
          message.error(result.data as string);
        }
      },
    });
  }, [id, navigate, queryClient]);

  return { data, isLoading: query.isLoading, error: query.isError, removing, remove };
};
