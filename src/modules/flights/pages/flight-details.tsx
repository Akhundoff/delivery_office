import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { FlightDetailsContainer } from '../containers';

export const FlightDetailsPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  return <FlightDetailsContainer id={id!} />;
};
