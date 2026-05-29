import { FC } from 'react';
import { NextTable } from '@shared/modules/next-table/containers';
import { PartnerBoxesTableContext } from '../context';
import { usePartnerBoxesTable } from '../hooks';

export const PartnerBoxesTable: FC = () => {
  const { columns } = usePartnerBoxesTable();
  return <NextTable context={PartnerBoxesTableContext} columns={columns} />;
};
