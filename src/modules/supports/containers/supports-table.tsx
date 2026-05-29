import { FC } from 'react';
import { NextTable } from '@shared/modules/next-table/containers';
import { SupportsTableContext } from '../context';
import { useSupportsTable } from '../hooks';

export const SupportsTable: FC = () => {
  const { columns } = useSupportsTable();

  return <NextTable context={SupportsTableContext} columns={columns} />;
};
