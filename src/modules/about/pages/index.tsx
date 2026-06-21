import { FC } from 'react';
import { PageContent } from '@shared/styled/page-content';
import { AboutForm } from '../containers/about-form';

export const AboutPage: FC = () => (
  <PageContent $contain={true}>
    <AboutForm />
  </PageContent>
);
