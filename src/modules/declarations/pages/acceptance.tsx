import { FC } from 'react';
import { PageContent } from '@shared/styled/page-content';
import { DeclarationAcceptance } from '../containers/declaration-acceptance';

export const AcceptancePage: FC = () => (
  <PageContent>
    <DeclarationAcceptance />
  </PageContent>
);
