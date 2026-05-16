import { FC } from 'react';
import { NextTable } from '@shared/modules/next-table/containers';
import { DnsQueuesTableContext } from '../context';
import { useDnsQueuesTable } from '../hooks';

export const DnsQueuesTable: FC = () => {
  const { columns } = useDnsQueuesTable();
  return <NextTable context={DnsQueuesTableContext} columns={columns} filterable={false} sortable={false} />;
};
