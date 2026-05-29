import { FC } from 'react';
import { NextTable } from '@shared/modules/next-table/containers';
import { UnitedDeclarationsTableContext } from '../context';
import { useUnitedDeclarationsTableColumns } from '../hooks';

export const UnitedDeclarationsTable: FC = () => {
  const columns = useUnitedDeclarationsTableColumns();

  return <NextTable context={UnitedDeclarationsTableContext} columns={columns} />;
};
