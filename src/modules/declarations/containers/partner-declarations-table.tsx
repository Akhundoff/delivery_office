import { FC } from 'react';
import { NextTable } from '@shared/modules/next-table/containers';
import { PartnerDeclarationsTableContext } from '../context';
import { usePartnerDeclarationsTable } from '../hooks';

export const PartnerDeclarationsTable: FC = () => {
  const { columns } = usePartnerDeclarationsTable();
  return <NextTable context={PartnerDeclarationsTableContext} columns={columns} />;
};
