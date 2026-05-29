import { FC } from 'react';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { PageContent } from '@shared/styled/page-content';
import { BranchInspectionsTableContext } from '../context';
import { branchInspectionsTableFetchUseCase } from '../use-cases/table-fetch';
import { BranchInspectionsActionBar, BranchInspectionsTable, BranchInspectionScan } from '../containers';

export const BranchInspectionsPage: FC = () => (
  <PageContent $contain>
    <NextTableProvider context={BranchInspectionsTableContext} onFetch={branchInspectionsTableFetchUseCase} name="branch-inspections-table">
      <BranchInspectionsActionBar />
      <BranchInspectionsTable />
    </NextTableProvider>
  </PageContent>
);

export const BranchInspectionScanPage: FC = () => <BranchInspectionScan />;
