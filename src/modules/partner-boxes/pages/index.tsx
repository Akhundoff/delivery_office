import { FC } from 'react';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { PageContent } from '@shared/styled/page-content';
import { PartnerBoxesTableContext } from '../context';
import { partnerBoxesTableFetchUseCase } from '../use-cases/table-fetch';
import { PartnerBoxesTable, PartnerBoxesActionBar } from '../containers';

export const PartnerBoxesPage: FC = () => {
  return (
    <PageContent $contain={true}>
      <NextTableProvider context={PartnerBoxesTableContext} onFetch={partnerBoxesTableFetchUseCase} name='partner-boxes-table'>
        <PartnerBoxesActionBar />
        <PartnerBoxesTable />
      </NextTableProvider>
    </PageContent>
  );
};
