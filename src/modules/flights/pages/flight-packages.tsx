import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { FlightPackagesContainer } from '../containers';

export const FlightPackagesPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  return <FlightPackagesContainer id={id!} />;
};
