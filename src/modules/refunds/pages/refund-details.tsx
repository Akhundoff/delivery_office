import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { RefundDetails } from '../containers';

export const RefundDetailsPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  if (!id) return null;
  return <RefundDetails id={id} />;
};
