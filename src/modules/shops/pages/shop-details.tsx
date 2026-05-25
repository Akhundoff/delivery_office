import { FC, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Descriptions, Modal, Spin } from 'antd';
import { useQuery } from 'react-query';
import { useCountries } from '@modules/countries';
import { useBackgroundNavigate, useCloseModal } from '@shared/hooks';
import { ShopsService } from '../services';
import { useShopTypes } from '../hooks';

export const ShopDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const [closeModal] = useCloseModal();
  const navigate = useBackgroundNavigate();

  const { data: shop, isLoading } = useQuery(
    ['shops', id],
    async () => {
      const result = await ShopsService.getById(id!);
      if (result.status === 200) return result.data;
      throw new Error(result.data as string);
    },
    { enabled: !!id },
  );

  const { data: countries = [] } = useCountries();
  const { data: shopTypes = [] } = useShopTypes();

  const countryName = useMemo(
    () => countries.find((c) => c.id === shop?.countryId)?.name ?? '',
    [countries, shop?.countryId],
  );

  const categoriesTitle = useMemo(
    () => shopTypes.filter((t) => shop?.categoryIds.includes(t.id)).map((t) => t.name).join(' / '),
    [shopTypes, shop?.categoryIds],
  );

  return (
    <Modal
      open={true}
      okText="Düzəliş et"
      cancelText="Bağla"
      onOk={() => navigate(`/shops/${id}/update`, { withBackground: true })}
      onCancel={() => closeModal('/shops')}
    >
      <Spin spinning={isLoading}>
        <Descriptions bordered column={1} size="small" style={{ marginTop: 16 }}>
          <Descriptions.Item label="Kod">{shop?.id}</Descriptions.Item>
          <Descriptions.Item label="Ad">{shop?.label}</Descriptions.Item>
          <Descriptions.Item label="Ölkə">{countryName}</Descriptions.Item>
          <Descriptions.Item label="Sayt">
            <a href={shop?.url} target="_blank" rel="noreferrer">{shop?.url}</a>
          </Descriptions.Item>
          <Descriptions.Item label="Logo">
            {shop?.logo ? <a href={shop.logo} target="_blank" rel="noreferrer">Bax</a> : '—'}
          </Descriptions.Item>
          <Descriptions.Item label="Kateqoriyalar">{categoriesTitle}</Descriptions.Item>
        </Descriptions>
      </Spin>
    </Modal>
  );
};
