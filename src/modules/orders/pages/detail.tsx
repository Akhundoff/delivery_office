import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { OrderDetail } from '../containers';

export const OrderDetailPage: FC = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) return null;

  return <OrderDetail id={id} />;
};
