import { FC } from 'react';
import { NextTableProvider } from '@shared/modules/next-table/context/provider';
import { PageContent } from '@shared/styled/page-content';
import { DnsQueuesTableContext } from '../context';
import { useDnsQueuesTable } from '../hooks';
import { DnsQueuesTable, DnsQueuesActionBar } from '../containers';

export const DnsQueuesPage: FC = () => {
  const { onFetch } = useDnsQueuesTable();

  return (
    <PageContent $contain={true}>
      <NextTableProvider context={DnsQueuesTableContext} onFetch={onFetch} name='dns-queues-table'>
        <DnsQueuesActionBar />
        <DnsQueuesTable />
      </NextTableProvider>
    </PageContent>
  );
};
