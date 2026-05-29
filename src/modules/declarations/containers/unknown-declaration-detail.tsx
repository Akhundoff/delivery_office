import { FC } from 'react';
import { Modal, Descriptions, Spin, Result, Tag, Typography } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { UnknownDeclarationsService } from '../services';

const val = (v: string | number | null | undefined, suffix = '') => (v != null && v !== '' ? `${v}${suffix}` : '—');

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
    <Modal open={true} onCancel={close} footer={null} width={720} title={`Naməlum bəyannamə #${id}`}>
      {isLoading && <Spin />}
      {isError && <Result status='error' title='Xəta baş verdi' />}
      {data && (
        <>
          <Typography.Text strong style={{ display: 'block', marginBottom: 8 }}>Ümumi məlumat</Typography.Text>
          <Descriptions bordered column={2} size='small' style={{ marginBottom: 16 }}>
            <Descriptions.Item label='Kod'>{data.id}</Descriptions.Item>
            <Descriptions.Item label='Status'>{data.status.name}</Descriptions.Item>
            <Descriptions.Item label='Global izləmə kodu' span={2}>{data.globalTrackCode}</Descriptions.Item>
            <Descriptions.Item label='İzləmə kodu' span={2}>{data.trackCode}</Descriptions.Item>
            <Descriptions.Item label='İstifadəçi'>{data.user?.name ?? '—'}</Descriptions.Item>
            <Descriptions.Item label='Mağaza'>{val(data.shop)}</Descriptions.Item>
            <Descriptions.Item label='Növ'>{data.type === 'liquid' ? 'Maye' : 'Digər'}</Descriptions.Item>
            <Descriptions.Item label='Miqdar'>{val(data.quantity)}</Descriptions.Item>
            <Descriptions.Item label='Məhsul növü'>{data.productType?.name ?? '—'}</Descriptions.Item>
            <Descriptions.Item label='Tarif kateqoriyası'>{data.planCategory?.name ?? '—'}</Descriptions.Item>
            <Descriptions.Item label='VÖEN'>{val(data.voen)}</Descriptions.Item>
            <Descriptions.Item label='Şkaf nömrəsi'>{val(data.wardrobeNumber)}</Descriptions.Item>
            <Descriptions.Item label='Açıqlama' span={2}>{val(data.description)}</Descriptions.Item>
            <Descriptions.Item label='Ödənilib'>
              <Tag color={data.paid ? 'green' : 'red'}>{data.paid ? 'Bəli' : 'Xeyr'}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label='Təsdiqlənib'>
              <Tag color={data.approved ? 'green' : 'default'}>{data.approved ? 'Bəli' : 'Xeyr'}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label='Geri qaytarılıb'>
              <Tag color={data.returned ? 'orange' : 'default'}>{data.returned ? 'Bəli' : 'Xeyr'}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label='Yaradılma tarixi'>{val(data.createdAt)}</Descriptions.Item>
            {data.deliveredAt && <Descriptions.Item label='Çatdırılma tarixi'>{data.deliveredAt}</Descriptions.Item>}
          </Descriptions>

          <Typography.Text strong style={{ display: 'block', marginBottom: 8 }}>Qiymətlər</Typography.Text>
          <Descriptions bordered column={2} size='small' style={{ marginBottom: 16 }}>
            <Descriptions.Item label='Qiymət'>{data.price != null ? `${data.price} ${data.currency ?? ''}`.trim() : '—'}</Descriptions.Item>
            <Descriptions.Item label='Çatdırılma qiyməti'>{val(data.deliveryPrice)}</Descriptions.Item>
            <Descriptions.Item label='Valyuta'>{val(data.currency)}</Descriptions.Item>
          </Descriptions>

          <Typography.Text strong style={{ display: 'block', marginBottom: 8 }}>Ölçülər</Typography.Text>
          <Descriptions bordered column={3} size='small' style={{ marginBottom: 16 }}>
            <Descriptions.Item label='Çəki'>{data.weight != null ? `${data.weight} kg` : '—'}</Descriptions.Item>
            <Descriptions.Item label='Hündürlük'>{val(data.height, ' cm')}</Descriptions.Item>
            <Descriptions.Item label='Eni'>{val(data.width, ' cm')}</Descriptions.Item>
            <Descriptions.Item label='Dərinlik'>{val(data.depth, ' cm')}</Descriptions.Item>
          </Descriptions>

          <Typography.Text strong style={{ display: 'block', marginBottom: 8 }}>Yerləşmə</Typography.Text>
          <Descriptions bordered column={2} size='small'>
            <Descriptions.Item label='Filial'>{data.branch?.name ?? '—'}</Descriptions.Item>
            <Descriptions.Item label='Uçuş'>{data.flight?.name ?? '—'}</Descriptions.Item>
            <Descriptions.Item label='Qutu'>{data.box?.name ?? '—'}</Descriptions.Item>
            <Descriptions.Item label='Son qutu'>{data.lastBox?.name ?? '—'}</Descriptions.Item>
            <Descriptions.Item label='Səbət'>{data.basket?.name ?? '—'}</Descriptions.Item>
            <Descriptions.Item label='Çatdırılma nöqtəsi'>{data.deliveryPoint?.name ?? '—'}</Descriptions.Item>
            <Descriptions.Item label='Tərəfdaş'>{val(data.partnerName)}</Descriptions.Item>
            {data.handoverTaskId && <Descriptions.Item label='Tapşırıq ID'>{data.handoverTaskId}</Descriptions.Item>}
          </Descriptions>
        </>
      )}
    </Modal>
  );
};
