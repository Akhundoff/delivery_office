import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { PageContent } from '@shared/styled/page-content';
import { FlightPaletsContainer } from '../containers';

export const FlightPaletsByIdPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <PageContent>
      <FlightPaletsContainer flightId={id} />
    </PageContent>
  );
};
