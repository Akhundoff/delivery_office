import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { FlightAirWaybillsContainer } from '../containers';

export const FlightAirWaybillsPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  return <FlightAirWaybillsContainer id={id!} />;
};
