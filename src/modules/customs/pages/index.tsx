import { FC } from 'react';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { PageContent } from '@shared/styled/page-content';
import { DnsQueuesTableContext } from '../context';
import { dnsQueuesTableFetchUseCase } from '../use-cases/dns-queues-table-fetch';
import { DnsQueuesTable, DnsQueuesActionBar } from '../containers';

export const DnsQueuesPage: FC = () => {
  return (
    <PageContent $contain={true}>
      <NextTableProvider context={DnsQueuesTableContext} onFetch={dnsQueuesTableFetchUseCase} name='dns-queues-table'>
        <DnsQueuesActionBar />
        <DnsQueuesTable />
      </NextTableProvider>
    </PageContent>
  );
};
