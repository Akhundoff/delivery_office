import { FC } from 'react';
import { Modal, Descriptions, Spin, Result } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { CustomsTasksService } from '../services';

export const CustomsTaskDetail: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const close = () => navigate(-1);

  const { data, isLoading, isError } = useQuery(
    ['customs-task', id],
    async () => {
      const result = await CustomsTasksService.getById(id!);
      if (result.status === 200) return result.data;
      throw new Error(result.data as string);
    },
    { enabled: !!id },
  );

  return (
    <Modal open={true} onCancel={close} footer={null} width={640} title={`Tapşırıq #${id}`}>
      {isLoading && <Spin />}
      {isError && <Result status='error' title='Xəta baş verdi' />}
      {data && (
        <Descriptions bordered column={1} size='small'>
          <Descriptions.Item label='Kod'>{data.id}</Descriptions.Item>
          <Descriptions.Item label='Əməliyyat'>{data.action}</Descriptions.Item>
          <Descriptions.Item label='Status'>{data.status.name}</Descriptions.Item>
          <Descriptions.Item label='Filial'>{data.branch.name}</Descriptions.Item>
          <Descriptions.Item label='İstifadəçi'>{data.declaration.user.name}</Descriptions.Item>
          <Descriptions.Item label='İzləmə kodu'>{data.declaration.globalTrackCode}</Descriptions.Item>
          <Descriptions.Item label='Bəyannamə statusu'>{data.declaration.status.name}</Descriptions.Item>
          <Descriptions.Item label='Məhsul növü'>{data.declaration.productType.name}</Descriptions.Item>
          <Descriptions.Item label='Çəki'>{data.declaration.weight ?? '—'} kg</Descriptions.Item>
          <Descriptions.Item label='Miqdar'>{data.declaration.quantity}</Descriptions.Item>
          {data.declaration.updatedBy && (
            <Descriptions.Item label='Dəyişdirən'>{data.declaration.updatedBy.name}</Descriptions.Item>
          )}
          <Descriptions.Item label='Yaradılma tarixi'>{data.createdAt}</Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
};
