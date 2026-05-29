import { FC } from 'react';
import { NextTable } from '@shared/modules/next-table/containers';
import { BranchInspectionsTableContext } from '../context';
import { useBranchInspectionsTable } from '../hooks';

export const BranchInspectionsTable: FC = () => {
  const { columns } = useBranchInspectionsTable();

  return <NextTable context={BranchInspectionsTableContext} columns={columns} />;
};
