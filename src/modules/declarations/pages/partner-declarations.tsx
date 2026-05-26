import { FC } from 'react';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { PageContent } from '@shared/styled/page-content';
import { PartnerDeclarationsTableContext } from '../context';
import { partnerDeclarationsTableFetchUseCase } from '../use-cases/partner-declarations-table-fetch';
import { PartnerDeclarationsTable, PartnerDeclarationsActionBar } from '../containers';

export const PartnerDeclarationsPage: FC = () => {
  return (
    <PageContent $contain={true}>
      <NextTableProvider context={PartnerDeclarationsTableContext} onFetch={partnerDeclarationsTableFetchUseCase} name='partner-declarations-table'>
        <PartnerDeclarationsActionBar />
        <PartnerDeclarationsTable />
      </NextTableProvider>
    </PageContent>
  );
};
