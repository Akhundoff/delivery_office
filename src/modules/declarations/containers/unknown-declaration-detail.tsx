import { FC } from 'react';
import { Modal, Descriptions, Spin, Result } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { UnknownDeclarationsService } from '../services';

export const UnknownDeclarationDetail: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const close = () => navigate(-1);

  const { data, isLoading, isError } = useQuery(
    ['unknown-declaration', id],
    async () => {
      const result = await UnknownDeclarationsService.getById(id!);
      if (result.status === 200) return result.data;
      throw new Error(result.data as string);
    },
    { enabled: !!id },
  );

  return (
    <Modal open={true} onCancel={close} footer={null} width={560} title={`Naməlum bəyannamə #${id}`}>
      {isLoading && <Spin />}
      {isError && <Result status='error' title='Xəta baş verdi' />}
      {data && (
        <Descriptions bordered column={1} size='small'>
          <Descriptions.Item label='Kod'>{data.id}</Descriptions.Item>
          <Descriptions.Item label='Global izləmə kodu'>{data.globalTrackCode}</Descriptions.Item>
          <Descriptions.Item label='İzləmə kodu'>{data.trackCode}</Descriptions.Item>
          <Descriptions.Item label='İstifadəçi'>{data.user?.name ?? '—'}</Descriptions.Item>
          <Descriptions.Item label='Status'>{data.status.name}</Descriptions.Item>
          <Descriptions.Item label='Çəki'>{data.weight != null ? `${data.weight} kg` : '—'}</Descriptions.Item>
          <Descriptions.Item label='Qiymət'>{data.price != null ? `${data.price}` : '—'}</Descriptions.Item>
          <Descriptions.Item label='Yaradılma tarixi'>{data.createdAt}</Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
};
